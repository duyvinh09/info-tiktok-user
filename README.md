# API Kiểm Tra Thông Tin Tài Khoản TikTok

API này cho phép bạn kiểm tra thông tin của một tài khoản TikTok dựa trên username hoặc ID của tài khoản.

## Endpoint

```
GET /tiktok/
```

## Tham số yêu cầu

| Tên tham số | Loại dữ liệu | Bắt buộc | Mô tả                  |
|-------------|--------------|----------|------------------------|
| `username`  | String       | Có       | Tên người dùng TikTok. |
| `link`   | String       | Không    | Link tài khoản TikTok.|
| `user_id`   | String       | Không    | ID của tài khoản TikTok.|

> **Lưu ý:** Bạn chỉ cần cung cấp `username`, `link` hoặc `user_id`.

## Example API Request  
```plaintext  
https://info-tiktok-user.vercel.app/tiktok?input=tiktok
```  

## Phản hồi

### Thành công (HTTP 200)

```json
{
    "success": true,
    "data": {
        "userInfo": {
            "user": {
                "id": "107955",
                "shortId": "",
                "uniqueId": "tiktok",
                "nickname": "TikTok",
                "avatarLarger": "https://p19-pu-sign-useast8.tiktokcdn-us.com/tos-useast5-avt-0068-tx/ba67b11de451691939223e9d978e613a~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=9640&refresh_token=2d0dfc64&x-expires=1749956400&x-signature=xZ9f1ZCGATMvM0H6hcYSmVhlB3U%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=useast8",
                "avatarMedium": "https://p16-pu-sign-useast8.tiktokcdn-us.com/tos-useast5-avt-0068-tx/ba67b11de451691939223e9d978e613a~tplv-tiktokx-cropcenter:720:720.jpeg?dr=9640&refresh_token=bc428886&x-expires=1749956400&x-signature=KdS0K4zyKu6pJB64E2vibmtWot4%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=useast8",
                "avatarThumb": "https://p19-pu-sign-useast8.tiktokcdn-us.com/tos-useast5-avt-0068-tx/ba67b11de451691939223e9d978e613a~tplv-tiktokx-cropcenter:100:100.jpeg?dr=9640&refresh_token=7b56dbb6&x-expires=1749956400&x-signature=sGJIoGvUwAHf8PGJJPEj%2B3040nI%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=useast8",
                "signature": "One TikTok can make a big impact",
                "createTime": "00:22:29 || 01/03/2015",
                "verified": true,
                "secUid": "MS4wLjABAAAAv7iSuuXDJGDvJkmH_vz1qkDZYo1apxgzaxdBSeIuPiM",
                "ftc": false,
                "relation": 0,
                "openFavorite": false,
                "bioLink": {
                    "link": "linktr.ee/tiktok",
                    "risk": 0
                },
                "commentSetting": 0,
                "commerceUserInfo": {
                    "commerceUser": true,
                    "downLoadLink": {
                        "android": "",
                        "ios": ""
                    },
                    "category": "Media & Entertainment",
                    "categoryButton": false
                },
                "duetSetting": 0,
                "stitchSetting": 0,
                "privateAccount": false,
                "secret": false,
                "isADVirtual": false,
                "roomId": "",
                "uniqueIdModifyTime": 0,
                "ttSeller": false,
                "region": "United States 🇺🇸",
                "downloadSetting": 0,
                "profileTab": {
                    "showMusicTab": false,
                    "showQuestionTab": true,
                    "showPlayListTab": true
                },
                "followingVisibility": 1,
                "recommendReason": "",
                "nowInvitationCardUrl": "",
                "nickNameModifyTime": "02:26:40 || 04/12/2021",
                "isEmbedBanned": false,
                "canExpPlaylist": true,
                "profileEmbedPermission": 1,
                "language": "en",
                "eventList": [
                    {
                        "id": "7515127578227638302",
                        "start_time": "1749859200",
                        "duration": "0",
                        "title": "In The Mix with Zara Larsson",
                        "desc": "",
                        "status": 0,
                        "subscriber_count": "0",
                        "type": 0,
                        "enable_update": false,
                        "has_subscribed": false,
                        "under_review_desc": "",
                        "is_paid_event": false,
                        "ticket_amount": "0",
                        "is_promoting": false,
                        "write_acl": {
                            "update_block": null,
                            "delete_block": null
                        },
                        "promote_video_count": 0
                    }
                ],
                "suggestAccountBind": false,
                "isOrganization": 1
                },
            "stats": {
                "followerCount": 90100000,
                "followingCount": 6,
                "heart": 398500000,
                "heartCount": 398500000,
                "videoCount": 1202,
                "diggCount": 0,
                "friendCount": 1
            },
            "statsV2": {
                "followerCount": "90059172",
                "followingCount": "6",
                "heart": "398487976",
                "heartCount": "398487976",
                "videoCount": "1202",
                "diggCount": "0",
                "friendCount": "1"
            },
            "itemList": []
        },
        "shareMeta": {
            "title": "TikTok on TikTok",
            "desc": "@tiktok 90.1m Followers, 6 Following, 398.5m Likes - Watch awesome short videos created by TikTok"
        },
        "statusCode": 0,
        "statusMsg": "",
        "needFix": false
    }
}
```

### Lỗi (HTTP 400 hoặc 404)

```json
{
    "success": true,
    "data": {
        "statusCode": 10221,
        "statusMsg": "",
        "needFix": false
    }
}
```

## Hướng dẫn sử dụng

1. Gửi yêu cầu GET đến endpoint với tham số `username`, `link` hoặc `user_id`.
2. Đảm bảo rằng bạn đã xác thực nếu API yêu cầu token.
3. Kiểm tra phản hồi để lấy thông tin tài khoản.
