async function fetchTikTokVideo(url, readJsonResponse) {
    const response = await fetch("https://www.tikwm.com/api/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ url, hd: "1" })
    });
    const payload = await readJsonResponse(response);

    if (!response.ok || payload.error || !payload.data) {
        throw new Error(payload.error || "Không thể lấy thông tin video.");
    }

    return payload.data;
}

function videoEscapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[character]);
}

function videoFormatNumber(value) {
    return Number(value || 0).toLocaleString("vi-VN");
}

function formatVietnamDate(timestamp) {
    if (!timestamp) return "Không có thông tin";
    const date = new Date(Number(timestamp) * 1000);
    if (Number.isNaN(date.getTime())) return String(timestamp);
    return new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        dateStyle: "medium",
        timeStyle: "medium"
    }).format(date);
}

function formatDuration(seconds) {
    const value = Number(seconds);
    if (!Number.isFinite(value) || value <= 0) return "Không có thông tin";
    const minutes = Math.floor(value / 60);
    return `${minutes ? `${minutes} phút ` : ""}${Math.floor(value % 60)} giây`;
}

function formatFileSize(bytes) {
    const value = Number(bytes);
    if (!Number.isFinite(value) || value <= 0) return "Không có thông tin";
    return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}

function formatCountry(region) {
    const value = String(region || "").trim();
    if (!value) return "Không có thông tin";

    const code = value.toUpperCase();
    if (!/^[A-Z]{2}$/.test(code)) return value;

    const flag = [...code].map((letter) => String.fromCodePoint(letter.charCodeAt(0) + 127397)).join("");
    try {
        const name = new Intl.DisplayNames(["vi"], { type: "region" }).of(code);
        return `${name || code} ${flag}`;
    } catch {
        return `${code} ${flag}`;
    }
}

function videoDetail(label, value, icon) {
    return `<div class="rounded-xl bg-slate-950/40 p-3"><p class="text-xs text-slate-500"><i class="fa-solid ${icon} mr-1"></i>${label}</p><p class="mt-1 text-sm font-semibold">${videoEscapeHtml(value)}</p></div>`;
}

function openImageLightbox(imageUrl, altText) {
    let lightbox = document.querySelector("#image-lightbox");
    if (!lightbox) {
        lightbox = document.createElement("div");
        lightbox.id = "image-lightbox";
        lightbox.className = "fixed inset-0 z-50 hidden items-center justify-center bg-black/90 p-4";
        lightbox.innerHTML = `
            <button type="button" data-lightbox-close class="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20" aria-label="Đóng ảnh">&times;</button>
            <img data-lightbox-image class="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl" alt="">
        `;
        document.body.appendChild(lightbox);
        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox || event.target.closest("[data-lightbox-close]")) {
                lightbox.classList.add("hidden");
                lightbox.classList.remove("flex");
            }
        });
    }

    const image = lightbox.querySelector("[data-lightbox-image]");
    image.src = imageUrl;
    image.alt = altText;
    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        const lightbox = document.querySelector("#image-lightbox");
        if (lightbox) {
            lightbox.classList.add("hidden");
            lightbox.classList.remove("flex");
        }
    }
});

function getImageUrls(images) {
    if (!Array.isArray(images)) return [];
    return images.map((image) => typeof image === "string" ? image : (image?.url || image?.url_list?.[0] || ""))
        .filter((image) => /^https?:\/\//i.test(image));
}

async function downloadVideoMedia(url, filename, button) {
    const originalContent = button.innerHTML;
    let completed = false;
    button.disabled = true;
    button.classList.add("opacity-60");
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Đang tải...';

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Tải file thất bại (${response.status}).`);

        const blob = await response.blob();
        const file = new File([blob], filename, { type: blob.type || "application/octet-stream" });
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
            || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
        if (isIOS && navigator.share && navigator.canShare?.({ files: [file] })) {
            await navigator.share({ files: [file], title: filename });
            completed = true;
            return;
        }

        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        completed = true;
    } catch (error) {
        if (!["AbortError", "NotAllowedError"].includes(error?.name)) {
            window.alert("Không thể tải trực tiếp file này. Máy chủ TikTok có thể đang chặn CORS.");
        }
    } finally {
        button.disabled = false;
        button.classList.remove("opacity-60");
        if (completed) {
            button.innerHTML = '<i class="fa-solid fa-check mr-2"></i>Đã tải';
            button.classList.add("text-emerald-300");
            window.setTimeout(() => {
                if (button.isConnected) {
                    button.innerHTML = originalContent;
                    button.classList.remove("text-emerald-300");
                }
            }, 3000);
        } else {
            button.innerHTML = originalContent;
        }
    }
}

async function downloadAllImages(images, button) {
    const originalContent = button.innerHTML;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    button.disabled = true;
    button.classList.add("opacity-60");

    try {
        for (let index = 0; index < images.length; index += 1) {
            button.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i>Đang tải ${index + 1}/${images.length}...`;
            const response = await fetch(images[index]);
            if (!response.ok) throw new Error(`Tải ảnh thất bại (${response.status}).`);

            const blob = await response.blob();
            const filename = `tiktok-image-${index + 1}.jpg`;
            const file = new File([blob], filename, { type: blob.type || "image/jpeg" });
            if (isIOS && navigator.share && navigator.canShare?.({ files: [file] })) {
                await navigator.share({ files: [file], title: filename });
            } else {
                const objectUrl = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = objectUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
                await new Promise((resolve) => window.setTimeout(resolve, 250));
            }
            const imageButton = document.querySelector(`#video-result button[data-download-filename="${filename}"]`);
            if (imageButton) {
                const originalImageContent = imageButton.innerHTML;
                imageButton.innerHTML = '<i class="fa-solid fa-check mr-1"></i>Đã tải';
                imageButton.classList.add("text-emerald-300");
                window.setTimeout(() => {
                    if (imageButton.isConnected) {
                        imageButton.innerHTML = originalImageContent;
                        imageButton.classList.remove("text-emerald-300");
                    }
                }, 3000);
            }
        }
    } catch (error) {
        if (!["AbortError", "NotAllowedError"].includes(error?.name)) {
            window.alert("Không thể tải toàn bộ ảnh. Máy chủ TikTok có thể đang chặn CORS.");
        }
    } finally {
        button.disabled = false;
        button.classList.remove("opacity-60");
        button.innerHTML = originalContent;
    }
}

async function copyVideoUsername(username, element) {
    const value = `@${username}`;
    try {
        await navigator.clipboard.writeText(value);
        const original = element.textContent;
        element.textContent = "Đã copy!";
        element.classList.add("text-emerald-300");
        window.setTimeout(() => {
            element.textContent = original;
            element.classList.remove("text-emerald-300");
        }, 1400);
    } catch {
        element.textContent = "Không thể copy";
        window.setTimeout(() => {
            element.textContent = value;
        }, 1400);
    }
}

function lookupVideoUsername(username) {
    const profileTab = document.querySelector('[data-tab="profile"]');
    const profileInput = document.querySelector("#profile-input");
    const profileForm = document.querySelector("#profile-form");
    if (!profileTab || !profileInput || !profileForm) return;

    profileInput.value = username;
    profileTab.click();
    profileForm.requestSubmit();
}

function setupMusicPlayer() {
    const player = document.querySelector("#video-result .music-player");
    const audio = player?.querySelector("audio");
    const playButton = player?.querySelector(".music-play");
    if (!player || !audio || !playButton) return;

    playButton.addEventListener("click", async () => {
        if (audio.paused) {
            await audio.play();
        } else {
            audio.pause();
        }
    });
    audio.addEventListener("play", () => {
        playButton.querySelector("i").className = "fa-solid fa-pause mr-2";
        playButton.querySelector("span").textContent = "Đang phát";
    });
    audio.addEventListener("pause", () => {
        playButton.querySelector("i").className = "fa-solid fa-play mr-2";
        playButton.querySelector("span").textContent = "Nghe nhạc";
    });
}

function renderVideo(video) {
    const author = video.author || {};
    const music = video.music_info || {};
    const authorName = typeof author === "string" ? author : (author.nickname || "Không xác định");
    const username = typeof author === "object" ? author.unique_id : "";
    const videoUrl = video.play || video.wmplay || video.url;
    const musicUrl = video.music || music.play_url || music.url;
    const imageUrls = getImageUrls(video.images);
    const isImagePost = imageUrls.length > 0;
    const duration = Number(video.duration) > 0
        ? formatDuration(video.duration)
        : `Nhạc: ${formatDuration(music.duration)}`;
    const size = formatFileSize(video.size);
    const previewUrl = isImagePost ? imageUrls[0] : (video.cover || video.origin_cover || "");
    const mediaActions = isImagePost
        ? `<div class="mt-6"><p class="mb-3 text-sm font-semibold"><i class="fa-solid fa-images mr-2 text-cyan-300"></i>Ảnh trong bài đăng (${imageUrls.length})</p><div class="grid grid-cols-2 gap-3 sm:grid-cols-3">${imageUrls.map((image, index) => `<div class="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950/40"><button type="button" class="image-preview block w-full cursor-zoom-in" data-image-url="${videoEscapeHtml(image)}" data-image-alt="Ảnh ${index + 1}"><img src="${videoEscapeHtml(image)}" class="aspect-square w-full object-cover transition duration-300 hover:scale-105" alt="Ảnh ${index + 1}" loading="lazy"></button><button type="button" class="direct-download flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/10" data-download-url="${videoEscapeHtml(image)}" data-download-filename="tiktok-image-${index + 1}.jpg"><i class="fa-solid fa-download"></i>Tải ảnh ${index + 1}</button></div>`).join("")}</div></div>`
        : (videoUrl ? `<button type="button" class="gradient-button direct-download mt-4 inline-flex items-center rounded-xl px-5 py-3 text-sm font-bold" data-download-url="${videoEscapeHtml(videoUrl)}" data-download-filename="tiktok-video.mp4"><i class="fa-solid fa-download mr-2"></i>Tải video</button>` : "");

    document.querySelector("#video-result").innerHTML = `<div class="fade-in overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-950/40">
        <div class="grid items-start gap-5 p-5 sm:grid-cols-[180px_1fr]">
            <div class="mx-auto w-full max-w-none overflow-hidden rounded-xl bg-black sm:mx-0 sm:aspect-[9/16] sm:w-[180px]"><img src="${videoEscapeHtml(previewUrl)}" onerror="this.style.display='none'" class="h-auto max-h-80 w-full object-contain sm:h-full" alt="${isImagePost ? "Ảnh bài đăng" : "Ảnh xem trước video"}"></div>
            <div class="flex flex-col justify-center">
                <h2 class="text-lg font-bold">${videoEscapeHtml(video.title || "Video TikTok")}</h2>
                <div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                    ${username
                        ? `<button type="button" class="video-username cursor-copy text-cyan-300 transition hover:text-cyan-200" title="Bấm để copy username">@${videoEscapeHtml(username)}</button><span aria-hidden="true">·</span><span>${videoEscapeHtml(authorName)}</span><button type="button" class="lookup-video-user rounded-lg border border-cyan-400/30 px-2.5 py-1 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/10" title="Tra cứu thông tin tài khoản"><i class="fa-solid fa-magnifying-glass mr-1"></i>Tra cứu</button>`
                        : videoEscapeHtml(authorName)}
                </div>
                <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    ${videoDetail("Lượt xem", videoFormatNumber(video.play_count), "fa-play text-cyan-300")}
                    ${videoDetail("Lượt tim", videoFormatNumber(video.digg_count), "fa-heart text-pink-400")}
                    ${videoDetail("Bình luận", videoFormatNumber(video.comment_count), "fa-comment text-yellow-300")}
                    ${videoDetail("Lượt share", videoFormatNumber(video.share_count), "fa-share text-violet-300")}
                    ${videoDetail("Lượt tải", videoFormatNumber(video.download_count), "fa-download text-emerald-300")}
                    ${videoDetail("Lượt yêu thích", videoFormatNumber(video.collect_count), "fa-bookmark text-orange-300")}
                </div>
                <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    ${videoDetail("Khu vực", formatCountry(video.region), "fa-earth-asia text-cyan-300")}
                    ${videoDetail("Ngày đăng", formatVietnamDate(video.create_time), "fa-calendar text-pink-300")}
                    ${videoDetail("Độ dài", duration, "fa-clock text-yellow-300")}
                    ${videoDetail("Dung lượng", size, "fa-hard-drive text-violet-300")}
                    ${videoDetail("Quảng cáo", video.is_ad === true ? "Có" : "Không", "fa-bullhorn text-red-300")}
                </div>
                ${mediaActions}
                ${isImagePost ? `<button type="button" class="download-all-images mt-4 inline-flex items-center rounded-xl border border-pink-400/40 px-5 py-3 text-sm font-bold text-pink-200 transition hover:bg-pink-400/10"><i class="fa-solid fa-images mr-2"></i>Tải tất cả ảnh</button>` : ""}
                ${musicUrl ? `<div class="music-player mt-4 flex items-center overflow-hidden rounded-xl border border-cyan-400/30 bg-slate-950/30"><audio class="hidden" preload="metadata" src="${videoEscapeHtml(musicUrl)}">Trình duyệt không hỗ trợ phát nhạc.</audio><button type="button" class="music-play flex min-w-0 flex-1 items-center px-4 py-3 text-left text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/10"><i class="fa-solid fa-play mr-2"></i><span>Nghe nhạc</span></button><button type="button" class="direct-download border-l border-cyan-400/20 px-4 py-3 text-cyan-200 transition hover:bg-cyan-400/10" data-download-url="${videoEscapeHtml(musicUrl)}" data-download-filename="tiktok-audio.mp3" aria-label="Tải nhạc"><i class="fa-solid fa-download"></i></button></div>` : ""}
            </div>
        </div>
    </div>`;
    document.querySelector("#video-result").classList.remove("hidden");
    document.querySelectorAll("#video-result .direct-download").forEach((button) => {
        button.addEventListener("click", () => downloadVideoMedia(button.dataset.downloadUrl, button.dataset.downloadFilename, button));
    });
    document.querySelector("#video-result .download-all-images")?.addEventListener("click", (event) => {
        downloadAllImages(imageUrls, event.currentTarget);
    });
    setupMusicPlayer();
    const usernameButton = document.querySelector("#video-result .video-username");
    const lookupButton = document.querySelector("#video-result .lookup-video-user");
    usernameButton?.addEventListener("click", () => copyVideoUsername(username, usernameButton));
    lookupButton?.addEventListener("click", () => lookupVideoUsername(username));
    document.querySelectorAll("#video-result .image-preview").forEach((button) => {
        button.addEventListener("click", () => openImageLightbox(button.dataset.imageUrl, button.dataset.imageAlt));
    });
}
