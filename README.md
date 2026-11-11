# TikTokTools

Website tĩnh thuần HTML, CSS và JavaScript. Không dùng PHP, Node.js hoặc serverless function.

## Giới hạn của web tĩnh

- Tra cứu tài khoản dùng TikTok oEmbed nên chỉ lấy được thông tin cơ bản như tên, username và ảnh đại diện.
- Không thể lấy follower, likes hoặc dữ liệu HTML TikTok trực tiếp bằng JavaScript do CORS và cơ chế chống bot của TikTok.
- Tra cứu và tải video gọi trực tiếp TikWM API; tính năng phụ thuộc việc API cho phép CORS tại thời điểm sử dụng.

Mở [index.html](./index.html) bằng trình duyệt hoặc triển khai repository bằng GitHub Pages.
