# API Kiểm Tra Thông Tin Tài Khoản TikTok

API này cho phép bạn kiểm tra thông tin của một tài khoản TikTok dựa trên username hoặc ID của tài khoản.

## Endpoint

```
GET /api/tiktok/user-info
```

## Tham số yêu cầu

| Tên tham số | Loại dữ liệu | Bắt buộc | Mô tả                  |
|-------------|--------------|----------|------------------------|
| `username`  | String       | Có       | Tên người dùng TikTok. |
| `user_id`   | String       | Không    | ID của tài khoản TikTok.|

> **Lưu ý:** Bạn chỉ cần cung cấp `username` hoặc `user_id`.

## Phản hồi

### Thành công (HTTP 200)

```json
{
    "status": "success",
    "data": {
        "username": "example_user",
        "user_id": "123456789",
        "followers_count": 1000,
        "following_count": 150,
        "videos_count": 25,
        "bio": "This is an example bio."
    }
}
```

### Lỗi (HTTP 400 hoặc 404)

```json
{
    "status": "error",
    "message": "User not found or invalid parameters."
}
```

## Hướng dẫn sử dụng

1. Gửi yêu cầu GET đến endpoint với tham số `username` hoặc `user_id`.
2. Đảm bảo rằng bạn đã xác thực nếu API yêu cầu token.
3. Kiểm tra phản hồi để lấy thông tin tài khoản.

## Ví dụ

### Yêu cầu

```
GET /api/tiktok/user-info?username=example_user
```

### Phản hồi

```json
{
    "status": "success",
    "data": {
        "username": "example_user",
        "user_id": "123456789",
        "followers_count": 1000,
        "following_count": 150,
        "videos_count": 25,
        "bio": "This is an example bio."
    }
}
```