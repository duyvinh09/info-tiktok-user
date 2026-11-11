function getTikTokProfileUrl(input) {
    const value = input.trim();
    if (/^https?:\/\//i.test(value)) return value;
    return `https://www.tiktok.com/@${encodeURIComponent(value.replace(/^@/, ""))}`;
}

async function fetchTikTokProfile(input, readJsonResponse) {
    const apiUrl = `https://tuantuprov.eu.org/api/other/tiktok_api.php?input=${encodeURIComponent(input.trim())}`;
    let response;
    try {
        response = await fetch(apiUrl);
    } catch {
        throw new Error("Không thể gọi API tài khoản do CORS. Máy chủ API cần cho phép domain GitHub Pages bằng Access-Control-Allow-Origin.");
    }
    const payload = await readJsonResponse(response);

    const userInfo = payload?.data?.userInfo;
    if (!response.ok || !payload?.success || !userInfo?.user) {
        throw new Error(payload?.error || payload?.data?.statusMsg || "Không tìm thấy thông tin tài khoản.");
    }

    const user = normalizeProfileObject(userInfo.user);
    return { user, statsV2: userInfo.statsV2 || {} };
}

function normalizeProfileUrl(value) {
    const match = String(value ?? "").match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
    return match ? match[2] : value;
}

function normalizeProfileObject(value) {
    if (Array.isArray(value)) return value.map(normalizeProfileObject);
    if (!value || typeof value !== "object") return normalizeProfileUrl(value);
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [
        key,
        normalizeProfileObject(item)
    ]));
}

function profileEscapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[character]);
}

function profileValue(value, fallback = "Không có thông tin") {
    if (value === null || value === undefined || value === "") return fallback;
    if (typeof value === "boolean") return value ? "Có" : "Không";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}

function profileNumber(value) {
    if (value === null || value === undefined || value === "") return "0";
    try {
        return new Intl.NumberFormat("vi-VN").format(BigInt(String(value)));
    } catch {
        return String(value);
    }
}

function profileDate(value) {
    if (!value) return "Không có thông tin";
    const text = String(value);
    const formatted = text.match(/^(\d{2}:\d{2}:\d{2})\s*\|\|\s*(\d{2})\/(\d{2})\/(\d{4})$/);
    if (formatted) {
        return `${formatted[1]} ${Number(formatted[3])} thg ${Number(formatted[2])}, ${formatted[4]}`;
    }

    const timestamp = Number(value);
    if (!Number.isFinite(timestamp)) return profileValue(value);
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
    }).formatToParts(new Date(timestamp * 1000));
    const datePart = (type) => parts.find((part) => part.type === type)?.value || "";
    return `${datePart("hour")}:${datePart("minute")}:${datePart("second")} ${Number(datePart("day"))} thg ${Number(datePart("month"))}, ${datePart("year")}`;
}

function profileHistoryDate(value, createdTime) {
    if (value === "08:00:00 || 01/01/1970") return "Chưa từng";
    if (!value) return createdTime || "Không có thông tin";
    return profileDate(value);
}

function profileCountry(region) {
    const code = String(region || "").trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(code)) return profileValue(region);
    const flag = [...code].map((letter) => String.fromCodePoint(letter.charCodeAt(0) + 127397)).join("");
    try {
        return `${new Intl.DisplayNames(["vi"], { type: "region" }).of(code) || code} ${flag}`;
    } catch {
        return `${code} ${flag}`;
    }
}

function profileLanguage(language) {
    const code = String(language || "").trim().toLowerCase();
    if (!/^[a-z]{2,3}$/.test(code)) return profileValue(language);
    try {
        return new Intl.DisplayNames(["vi"], { type: "language" }).of(code) || code;
    } catch {
        return code;
    }
}

function profileDetail(label, value, icon = "fa-circle-info") {
    return `<div class="rounded-lg border border-slate-800/70 bg-slate-950/35 px-3 py-2.5"><p class="text-[11px] text-slate-500"><i class="fa-solid ${icon} mr-1"></i>${label}</p><p class="mt-1 break-words text-sm font-semibold leading-5">${profileEscapeHtml(profileValue(value))}</p></div>`;
}

function profileGroup(title, icon, color, content, open = false) {
    return `<details class="group overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/35" ${open ? "open" : ""}>
        <summary class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 transition hover:bg-white/[.03]">
            <span class="flex items-center gap-2 text-sm font-semibold ${color}"><i class="fa-solid ${icon}"></i>${title}</span>
            <i class="fa-solid fa-chevron-down text-xs text-slate-500 transition-transform group-open:rotate-180"></i>
        </summary>
        <div class="border-t border-slate-800/70 p-3"><div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">${content}</div></div>
    </details>`;
}

function profileSetting(value, map) {
    return map[value] ?? profileValue(value);
}

function renderProfile(info) {
    const user = info.user || {};
    const stats = info.statsV2 || {};
    const tabs = user.profileTab || {};
    const username = user.uniqueId || user.id || "unknown";
    const avatar = user.avatarLarger || user.avatarMedium || user.avatarThumb || "";
    const isLive = Boolean(user.roomId);
    const createdTime = profileDate(user.createTime);
    const accountType = tabs.showMusicTab ? "Là tài khoản Nghệ Sĩ" : "Là tài khoản Người dùng Cá Nhân";
    const privacy = user.privateAccount ? "Tài khoản Riêng Tư" : "Tài khoản Công Khai";
    const followingVisibility = user.followingVisibility === 2 ? "Đã bị ẩn" : "Bạn có thể xem following ở tài khoản này";
    const repost = tabs.showRepostTab ? "Cho phép xem bài đăng lại" : "Không cho phép xem bài đăng lại";
    const playlist = tabs.showPlayListTab ? "Có danh sách phát" : "Không có danh sách phát";
    const likedVideos = user.openFavorite ? "Hiện" : "Ẩn";
    const accountDetails = [
        profileDetail("ID", user.id, "fa-id-card"),
        profileDetail("Ngày tạo Acc", createdTime, "fa-calendar"),
        profileDetail("Khu vực", profileCountry(user.region), "fa-earth-asia"),
        profileDetail("Ngôn ngữ", profileLanguage(user.language), "fa-language"),
        profileDetail("Lần cuối sửa tên", profileHistoryDate(user.nickNameModifyTime, createdTime), "fa-pen"),
        profileDetail("Lần cuối sửa Username", profileHistoryDate(user.uniqueIdModifyTime, createdTime), "fa-pen"),
        profileDetail("Loại tài khoản", accountType, "fa-user"),
        profileDetail("Trạng thái", privacy, "fa-lock")
    ].join("");
    const contentDetails = [
        profileDetail("Đăng lại", repost, "fa-retweet"),
        profileDetail("Danh sách đã follow", followingVisibility, "fa-users"),
        profileDetail("Danh sách phát", playlist, "fa-list"),
        profileDetail("Video đã thích", likedVideos, "fa-heart"),
        profileDetail("Music tab", tabs.showMusicTab, "fa-music"),
        profileDetail("Q&A tab", tabs.showQuestionTab, "fa-circle-question")
    ].join("");
    const privacyDetails = [
        profileDetail("Bình luận", profileSetting(user.commentSetting, { 0: "Cho phép từ Mọi người", 1: "Cho phép từ Bạn bè", 2: "Không ai cả" }), "fa-comment"),
        profileDetail("Duet", profileSetting(user.duetSetting, { 0: "Cho phép từ Mọi người", 1: "Cho phép từ Bạn bè", 2: "Không cho phép Duet" }), "fa-people-arrows"),
        profileDetail("Ghép nối", profileSetting(user.stitchSetting, { 0: "Cho phép từ Mọi người", 1: "Cho phép từ Bạn bè", 2: "Không cho phép Ghép nối" }), "fa-scissors"),
        profileDetail("Cho phép tải video", profileSetting(user.downloadSetting, { 0: "Không cho phép", 1: "Cho phép" }), "fa-download"),
        profileDetail("Following", profileSetting(user.followingVisibility, { 1: "Có thể xem", 2: "Đã ẩn" }), "fa-users"),
        profileDetail("Embed", user.isEmbedBanned ? "Bị chặn" : "Được phép", "fa-code")
    ].join("");
    const otherDetails = [
        profileDetail("Tài khoản ảo quảng cáo", user.isADVirtual, "fa-robot"),
        profileDetail("Tài khoản Seller", user.ttSeller, "fa-shop")
    ].join("");

    document.querySelector("#profile-result").innerHTML = `<div class="fade-in space-y-5">
        <div class="flex flex-col gap-4 rounded-2xl border border-slate-700/60 bg-slate-950/40 p-5 sm:flex-row sm:items-center">
            <div class="relative h-20 w-20 shrink-0"><img src="${profileEscapeHtml(avatar)}" onerror="this.style.display='none'" class="h-20 w-20 rounded-full border-2 ${isLive ? "border-red-500" : "border-pink-400/50"} object-cover" alt="Ảnh đại diện">${isLive ? '<span class="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">LIVE</span>' : ""}</div>
            <div class="min-w-0 flex-1"><div class="flex items-center gap-2"><h2 class="truncate text-xl font-bold">${profileEscapeHtml(user.nickname || username)}</h2>${user.verified ? '<i class="fa-solid fa-circle-check text-cyan-300"></i>' : ""}</div><p class="text-sm text-slate-400">@${profileEscapeHtml(username)}</p><p class="mt-2 text-sm text-slate-300">${profileEscapeHtml(user.signature || "Tài khoản chưa có tiểu sử.")}</p></div>
            <a href="https://www.tiktok.com/@${encodeURIComponent(username)}" target="_blank" rel="noopener" class="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold transition hover:border-pink-400 hover:text-pink-300">Mở TikTok <i class="fa-solid fa-arrow-up-right-from-square ml-1"></i></a>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">${profileStat("Follower", stats.followerCount, "fa-users", "text-pink-400")}${profileStat("Đang follow", stats.followingCount, "fa-user-plus", "text-cyan-300")}${profileStat("Lượt thích", stats.heartCount || stats.heart, "fa-heart", "text-red-400")}${profileStat("Video", stats.videoCount, "fa-video", "text-yellow-300")}${profileStat("Bạn bè", stats.friendCount, "fa-user-group", "text-violet-300")}</div>
        <div class="space-y-3">
            <div class="flex items-center justify-between"><h3 class="text-sm font-bold uppercase tracking-wider text-slate-300">Thông tin chi tiết</h3><span class="text-[11px] text-slate-500">Bấm vào từng nhóm để xem</span></div>
            ${profileGroup("Thông tin tài khoản", "fa-id-card", "text-cyan-300", accountDetails, true)}
            ${profileGroup("Nội dung & hồ sơ", "fa-sliders", "text-pink-300", contentDetails)}
            ${profileGroup("Quyền riêng tư & quyền hạn", "fa-shield-halved", "text-yellow-300", privacyDetails)}
            ${profileGroup("Thông tin khác", "fa-circle-info", "text-violet-300", otherDetails)}
        </div>
    </div>`;
    document.querySelector("#profile-result").classList.remove("hidden");
}

function profileStat(label, value, icon, color) {
    return `<div class="rounded-xl bg-slate-950/40 p-4"><i class="fa-solid ${icon} ${color}"></i><p class="mt-3 text-xs text-slate-500">${label}</p><p class="mt-1 text-lg font-bold">${profileNumber(value)}</p></div>`;
}
