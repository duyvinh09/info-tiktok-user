<?php
namespace Tiktok;
use Exception;

// https://apify.com/karamelo/tiktok-profile-scraper (Xem thông tin các biến có nghĩa là gì)

final class Users
{
    const URL_BASE = 'https://www.tiktok.com/';
    const API_VINH = 'https://api16-core-c-alisg.tiktokv.com/lite/v2/user/detail/other/';
    private $object;
    private $user;
    private $statusCode;
    private $flags;

    function __construct()
    {
        $this->object = [];
        $this->statusCode = '';
        $this->flags = [
            "BY" => "Belarus 🇧🇾",
            "TJ" => "Tajikistan 🇹🇯",
            "TM" => "Turkmenistan 🇹🇲",
            "KZ" => "Kazakhstan 🇰🇿",
            "GB" => "United Kingdom 🇬🇧",
            "DE" => "Germany 🇩🇪",
            "ES" => "Spain 🇪🇸",
            "FR" => "France 🇫🇷",
            "UZ" => "Uzbekistan 🇺🇿",
            "US" => "United States 🇺🇸",
            "KG" => "Kyrgyzstan 🇰🇬",
            "MD" => "Moldova 🇲🇩",
            "AC" => "Ascension Island 🇦🇨",
            "AD" => "Andorra 🇦🇩",
            "AF" => "Afghanistan 🇦🇫",
            "AG" => "Antigua & Barbuda 🇦🇬",
            "AI" => "Anguilla 🇦🇮",
            "AL" => "Albania 🇦🇱",
            "AM" => "Armenia 🇦🇲",
            "AO" => "Angola 🇦🇴",
            "AQ" => "Antarctica 🇦🇶",
            "AS" => "American Samoa 🇦🇸",
            "AU" => "Australia 🇦🇺",
            "AW" => "Aruba 🇦🇼",
            "AX" => "Åland Islands 🇦🇽",
            "BA" => "Bosnia & Herzegovina 🇧🇦",
            "BB" => "Barbados 🇧🇧",
            "BD" => "Bangladesh 🇧🇩",
            "BF" => "Burkina Faso 🇧🇫",
            "BG" => "Bulgaria 🇧🇬",
            "BI" => "Burundi 🇧🇮",
            "BJ" => "Benin 🇧🇯",
            "BL" => "St. Barthélemy 🇧🇱",
            "BM" => "Bermuda 🇧🇲",
            "BN" => "Brunei 🇧🇳",
            "BQ" => "Caribbean Netherlands 🇧🇶",
            "BS" => "Bahamas 🇧🇸",
            "BT" => "Bhutan 🇧🇹",
            "BV" => "Bouvet Island 🇧🇻",
            "BW" => "Botswana 🇧🇼",
            "BZ" => "Belize 🇧🇿",
            "CA" => "Canada 🇨🇦",
            "CC" => "Cocos (Keeling) Islands 🇨🇨",
            "CD" => "Congo - Kinshasa 🇨🇩",
            "CF" => "Central African Republic 🇨🇫",
            "CG" => "Congo - Brazzaville 🇨🇬",
            "CI" => "Côte d’Ivoire 🇨🇮",
            "CK" => "Cook Islands 🇨🇰",
            "CM" => "Cameroon 🇨🇲",
            "CN" => "China 🇨🇳",
            "CS" => "Serbia and Montenegro 🇷🇸",
            "CU" => "Cuba 🇨🇺",
            "CV" => "Cape Verde 🇨🇻",
            "CW" => "Curaçao 🇨🇼",
            "CX" => "Christmas Island 🇨🇽",
            "CY" => "Cyprus 🇨🇾",
            "DK" => "Denmark 🇩🇰",
            "DM" => "Dominica 🇩🇲",
            "DR" => "Dominican Republic 🇩🇴",
            "EA" => "Ceuta & Melilla 🇪🇦",
            "EE" => "Estonia 🇪🇪",
            "EH" => "Western Sahara 🇪🇭",
            "EN" => "Ethiopia 🇪🇹",
            "ET" => "Fiji 🇫🇯",
            "FJ" => "Fiji 🇫🇯",
            "FK" => "Falkland Islands 🇫🇰",
            "FM" => "Micronesia 🇫🇲",
            "FO" => "Faroe Islands 🇫🇴",
            "GA" => "Gabon 🇬🇦",
            "GD" => "Grenada 🇬🇩",
            "GE" => "Georgia 🇬🇪",
            "GF" => "French Guiana 🇬🇫",
            "GG" => "Guernsey 🇬🇬",
            "GH" => "Ghana 🇬🇭",
            "GI" => "Gibraltar 🇬🇮",
            "GL" => "Greenland 🇬🇱",
            "GN" => "Guinea 🇬🇳",
            "GP" => "Guadeloupe 🇬🇵",
            "GQ" => "Equatorial Guinea 🇬🇶",
            "GS" => "South Georgia & South Sandwich Islands 🇬🇸",
            "GU" => "Guam 🇬🇺",
            "GW" => "Guinea-Bissau 🇬🇼",
            "GY" => "Guyana 🇬🇾",
            "HK" => "Hong Kong SAR China 🇭🇰",
            "HR" => "Croatia 🇭🇷",
            "HT" => "Haiti 🇭🇹",
            "IC" => "Canary Islands 🇮🇨",
            "IE" => "Ireland 🇮🇪",
            "IL" => "Israel 🇮🇱",
            "IM" => "Isle of Man 🇮🇲",
            "IN" => "India 🇮🇳",
            "IO" => "British Indian Ocean Territory 🇮🇴",
            "IS" => "Iceland 🇮🇸",
            "JE" => "Jersey 🇯🇪",
            "KE" => "Kenya 🇰🇪",
            "KH" => "Cambodia 🇰🇭",
            "KI" => "Kiribati 🇰🇮",
            "KN" => "St. Kitts & Nevis 🇰🇳",
            "KY" => "Cayman  🇰🇾Islands",
            "LA" => "Laos 🇱🇦",
            "LC" => "St. Lucia 🇱🇨",
            "LI" => "Liechtenstein 🇱🇮",
            "LK" => "Sri Lanka 🇱🇰",
            "LR" => "Liberia 🇱🇷",
            "LS" => "Lesotho 🇱🇸",
            "LU" => "Luxembourg 🇱🇺",
            "LV" => "Latvia 🇱🇻",
            "MC" => "Monaco 🇲🇨",
            "ME" => "Montenegro 🇲🇪",
            "MF" => "St. Martin 🇲🇫",
            "MG" => "Madagascar 🇲🇬",
            "MH" => "Marshall Islands 🇲🇭",
            "MK" => "North Macedonia 🇲🇰",
            "ML" => "Mali 🇲🇱",
            "MM" => "Myanmar (Burma) 🇲🇲",
            "MN" => "Mongolia 🇲🇳",
            "MO" => "Macao SAR China 🇲🇴",
            "MP" => "Northern Mariana Islands 🇲🇵",
            "MQ" => "Martinique 🇲🇶",
            "MS" => "Montserrat 🇲🇸",
            "MT" => "Malta 🇲🇹",
            "MU" => "Mauritius 🇲🇺",
            "MV" => "Maldives 🇲🇻",
            "MW" => "Malawi 🇲🇼",
            "MZ" => "Mozambique 🇲🇿",
            "NA" => "Namibia 🇳🇦",
            "NC" => "New Caledonia 🇳🇨",
            "NE" => "Niger 🇳🇪",
            "NF" => "Norfolk Island 🇳🇫",
            "NG" => "Nigeria 🇳🇬",
            "NJ" => "Sweden 🇳🇯",
            "NO" => "Norway 🇳🇴",
            "NR" => "Nauru 🇳🇷",
            "NU" => "Niue 🇳🇺",
            "NZ" => "New Zealand 🇳🇿",
            "PF" => "French Polynesia 🇵🇫",
            "PG" => "Papua New Guinea 🇵🇬",
            "PK" => "Pakistan 🇵🇰",
            "PM" => "St. Pierre & Miquelon 🇵🇲",
            "PN" => "Pitcairn Islands 🇵🇳",
            "PR" => "Puerto Rico 🇵🇷",
            "PW" => "Palau 🇵🇼",
            "QS" => "Syria 🇶🇦",
            "RE" => "Réunion 🇷🇪",
            "RW" => "Rwanda 🇷🇼",
            "SB" => "Solomon Islands 🇸🇧",
            "SC" => "Seychelles 🇸🇨",
            "SH" => "St. Helena 🇸🇭",
            "SI" => "Slovenia 🇸🇮",
            "SJ" => "Svalbard & Jan Mayen 🇸🇯",
            "SL" => "Sierra Leone 🇸🇱",
            "SM" => "San Marino 🇸🇲",
            "SN" => "Senegal 🇸🇳",
            "SR" => "Suriname 🇸🇷",
            "ST" => "São Tomé & Príncipe 🇸🇹",
            "SX" => "Sint Maarten 🇸🇽",
            "SZ" => "Eswatini 🇸🇿",
            "TC" => "Turks & Caicos Islands 🇹🇨",
            "TF" => "French Southern Territories 🇹🇫",
            "TG" => "Togo 🇹🇬",
            "TK" => "Tokelau 🇹🇰",
            "TL" => "Timor-Leste 🇹🇱",
            "TO" => "Tonga 🇹🇴",
            "TP" => "São Tomé & Príncipe 🇹🇵",
            "TS" => "Benin 🇹🇨",
            "TV" => "Tuvalu 🇹🇻",
            "TZ" => "Tanzania 🇹🇿",
            "UG" => "Uganda 🇺🇬",
            "UM" => "U.S. Outlying Islands 🇺🇲",
            "VA" => "Vatican City 🇻🇦",
            "VC" => "St. Vincent & Grenadines 🇻🇨",
            "VG" => "British Virgin Islands 🇻🇬",
            "VI" => "U.S. Virgin Islands 🇻🇮",
            "VU" => "Vanuatu 🇻🇺",
            "WF" => "Wallis & Futuna 🇼🇫",
            "WS" => "Samoa 🇼🇸",
            "XA" => "Canada 🇺🇸",
            "XB" => "Puerto Rico 🇵🇷",
            "XK" => "Kosovo 🇽🇰",
            "XX" => "Serbia 🇷🇸",
            "YJ" => "Kosovo 🇽🇰",
            "YT" => "Serbia 🇷🇸",
            "ZA" => "South Africa 🇿🇦",
            "ZG" => "Croatia 🇭🇷",
            "ZM" => "Zambia 🇿🇲",
            "ZN" => "Croatia 🇭🇷",
            "ZW" => "Zimbabwe 🇿🇼",
            "ZZ" => "Croatia 🇭🇷",
            "ES" => "Spain 🇪🇸",
            "TR" => "Turkey 🇹🇷",
            "AZ" => "Azerbaijan 🇦🇿",
            "MA" => "Morocco 🇲🇦",
            "LB" => "Lebanon 🇱🇧",
            "DZ" => "Algeria 🇩🇿",
            "ER" => "Eritrea 🇪🇷",
            "TN" => "Tunisia 🇹🇳",
            "SS" => "South Sudan 🇸🇸",
            "BR" => "Brazil 🇧🇷",
            "MX" => "Mexico 🇲🇽",
            "TH" => "Thailand 🇹🇭",
            "ID" => "Indonesia 🇮🇩",
            "MY" => "Malaysia 🇲🇾",
            "VN" => "Việt Nam 🇻🇳",
            "PH" => "Philippines 🇵🇭",
            "SG" => "Singapore 🇸🇬",
            "KR" => "South Korea 🇰🇷",
            "JP" => "Japan 🇯🇵",
            "EG" => "Egypt 🇪🇬",
            "SY" => "Syria 🇸🇾",
            "PS" => "Palestine 🇵🇸",
            "JO" => "Jordan 🇯🇴",
            "IQ" => "Iraq 🇮🇶",
            "DJ" => "Djibouti 🇩🇯",
            "KM" => "Comoros 🇰🇲",
            "SO" => "Somalia 🇸🇴",
            "TD" => "Chad 🇹🇩",
            "OM" => "Oman 🇴🇲",
            "QA" => "Qatar 🇶🇦",
            "KW" => "Kuwait 🇰🇼",
            "AE" => "United Arab Emirates 🇦🇪",
            "BH" => "Bahrain 🇧🇭",
            "SA" => "Saudi Arabia 🇸🇦",
            "YE" => "Yemen 🇾🇪",
            "LY" => "Libya 🇱🇾",
            "SD" => "Sudan 🇸🇩",
            "MR" => "Mauritania 🇲🇷",
            "LT" => "Lithuania 🇱🇹",
            "JM" => "Jamaica 🇯🇲",
            "CH" => "Switzerland 🇨🇭",
            "IR" => "Iran 🇮🇷",
            "AN" => "Netherlands Antilles 🇦🇳",
            "FI" => "Finland 🇫🇮",
            "PY" => "Paraguay 🇵🇾",
            "AR" => "Argentina 🇦🇷",
            "GR" => "Greece 🇬🇷",
            "UY" => "Uruguay 🇺🇾",
            "CR" => "Costa Rica 🇨🇷",
            "DO" => "Dominican Republic 🇩🇴",
            "PE" => "Peru 🇵🇪",
            "IT" => "Italy 🇮🇹",
            "TT" => "Trinidad & Tobago 🇹🇹",
            "SV" => "El Salvador 🇸🇻",
            "CZ" => "Czechia 🇨🇿",
            "BE" => "Belgium 🇧🇪",
            "CO" => "Colombia 🇨🇴",
            "TW" => "Taiwan 🇹🇼",
            "HN" => "Honduras 🇭🇳",
            "EC" => "Ecuador 🇪🇨",
            "SK" => "Slovakia 🇸🇰",
            "NP" => "Nepal 🇳🇵",
            "RS" => "Serbia 🇷🇸",
            "NI" => "Nicaragua 🇳🇮",
            "SE" => "Sweden 🇸🇪",
            "GT" => "Guatemala 🇬🇹",
            "CL" => "Chile 🇨🇱",
            "NL" => "Netherlands 🇳🇱",
            "RO" => "Romania 🇷🇴",
            "HU" => "Hungary 🇭🇺",
            "VE" => "Venezuela 🇻🇪",
            "AT" => "Austria 🇦🇹",
            "PL" => "Poland 🇵🇱",
            "PA" => "Panama 🇵🇦",
            "BO" => "Bolivia 🇧🇴",
            "GM" => "Gambia 🇬🇲",
            "PT" => "Portugal 🇵🇹",
        ];
    }

    public function details($user)
    {
        if (empty($user)) {
            throw new Exception('Thiếu đối số bắt buộc: "user"');
        }
        $this->user = $this->prepare($user);
        $request = $this->request();
        $response = $this->extract(
            '/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"([^>]+)>([^<]+)<\/script>/',
            $request
        );
        $validateProps = $response['__DEFAULT_SCOPE__']['webapp.user-detail'] ?? [];
        if (!array_key_exists('userInfo', $validateProps)) {
            $this->statusCode = 404;
            return $this->template($validateProps, $this->object, $this->statusCode);
        }
        $userId = $validateProps['userInfo']['user']['id'] ?? null;
        if ($userId) {
            $additionalResponse = $this->additionalRequest($userId);
            $validateProps['userInfo']['user']['profileTab']['showRepostTab'] = $additionalResponse['user']['tab_settings']['repost_tab']['repost_tab_all_visible'] ?? null;
            $validateProps['userInfo']['stats']['heartCount'] = $additionalResponse['user']['total_favorited'] ?? null;
            $validateProps['userInfo']['stats']['followerCount'] = $additionalResponse['user']['follower_count'] ?? null;
            $validateProps['userInfo']['stats']['followingCount'] = $additionalResponse['user']['following_count'] ?? null;
            $validateProps['userInfo']['user']['bio_email'] = $additionalResponse['user']['bio_email'] ?? null;
            $validateProps['userInfo']['user']['original_musician'] = $additionalResponse['user']['original_musician'] ?? null;
            $userIdString = (string) $userId;
            if ($userIdString === '107955') { // if (strlen($userIdString) < 19 && $userIdString !== '107955') {
                $userIdString = '1474300800'; // $userIdString = str_pad($userIdString, 19, '0', STR_PAD_RIGHT);
            } elseif ($userIdString === '5831967') {
                $userIdString = '1515627030';
            } elseif ($userIdString === '127905465618821121') {
                $userIdString = '1558784715';
            } else {
                if (strlen($userIdString) < 19) {
                    $userIdString = str_pad($userIdString, 19, '0', STR_PAD_RIGHT);
                }
            }
            $binaryUserId = substr(decbin($userIdString), 0, 31); // mã hóa id về dạng nhị phân rồi lấy 31 bit đầu tiên
            $timestamp = bindec($binaryUserId);
            $date = new \DateTime('@' . $timestamp);
            $date->setTimezone(new \DateTimeZone('Asia/Ho_Chi_Minh'));
            $created_time = $date->format('H:i:s || d/m/Y');
            $validateProps['userInfo']['created_time'] = $created_time;
            if (isset($validateProps['userInfo']['user']['createTime'])) {
                $timestamp = $validateProps['userInfo']['user']['createTime'];
                $date = new \DateTime('@' . $timestamp);
                $date->setTimezone(new \DateTimeZone('Asia/Ho_Chi_Minh'));
                $createTime = $date->format('H:i:s || d/m/Y');
                $validateProps['userInfo']['user']['createTime'] = $createTime;
            }
            if (isset($validateProps['userInfo']['user']['uniqueIdModifyTime'])) {
                $timestamp = $validateProps['userInfo']['user']['uniqueIdModifyTime'];
                $date = new \DateTime('@' . $timestamp);
                $date->setTimezone(new \DateTimeZone('Asia/Ho_Chi_Minh'));
                $uniqueIdModifyTime = $date->format('H:i:s || d/m/Y');
                $validateProps['userInfo']['user']['uniqueIdModifyTime'] = $uniqueIdModifyTime;
            }
            if (isset($validateProps['userInfo']['user']['nickNameModifyTime'])) {
                $timestamp = $validateProps['userInfo']['user']['nickNameModifyTime'];
                $date = new \DateTime('@' . $timestamp);
                $date->setTimezone(new \DateTimeZone('Asia/Ho_Chi_Minh'));
                $nickNameModifyTime = $date->format('H:i:s || d/m/Y');
                $validateProps['userInfo']['user']['nickNameModifyTime'] = $nickNameModifyTime;
            }
            $region = $validateProps['userInfo']['user']['region'] ?? '';
            if (!empty($region) && isset($this->flags[$region])) {
                $validateProps['userInfo']['user']['region'] = $this->flags[$region];
            }
        }
        return $this->template($validateProps, $this->object, 200);
    }

    protected function request($method = 'GET', $getParams = [])
    {
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => self::URL_BASE . '@' . $this->user . '/?lang=vi',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTPHEADER => [
                'user-agent: Mozilla/5.0 (compatible; Google-Apps-Script)',
            ],
        ]);
        $response = curl_exec($curl);
        $this->statusCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);
        return $response;
    }

    protected function additionalRequest($userId)
    {
        $url = self::API_VINH . '?user_id=' . $userId . '&lite_flow_schedule=new&manifest_version_code=350101&_rticket=1720875305381&app_language=vi&app_type=normal&iid=291207&channel=googleplay&device_type=SM-S901E&language=vi&host_abi=arm64-v8a&locale=vi-VN&resolution=1080*2214&openudid=421133e392491a10&update_version_code=350101&ac2=0&cdid=9889010c-e59f-4b73-ae73-af69a23b7da1&sys_region=VN&os_api=34&timezone_name=Asia/Ho_Chi_Minh&dpi=480&carrier_region=VN&ac=mobile&device_id=7388464793307317766&os_version=14&timezone_offset=25200&version_code=350101&app_name=musically_go&ab_version=35.1.1&version_name=35.1.1&device_brand=samsung&op_region=VN&ssmix=a&device_platform=android&build_number=35.1.1&region=VN&aid=1340&ts=1720875289';
        $response = file_get_contents($url);
        return json_decode($response, true);
    }

    private function prepare($user)
    {
        $url_parts = parse_url($user);
        if ($url_parts && isset($url_parts['path'])) {
            $path_parts = explode('/', trim($url_parts['path'], '/'));
            $username = end($path_parts);
            return strtolower(preg_replace('/@/', '', $username, 1));
        } else {
            throw new Exception('URL TikTok không hợp lệ.');
        }
    }

    private function extract($pattern, $_)
    {
        preg_match($pattern, $_, $matches);
        return json_decode($matches[2], true);
    }

    private function template($request_, $object_, $statusCode_)
    {
        $object_['code'] = $statusCode_;
        switch ($statusCode_) {
            case 200:
                $object_['data'] = $request_;
                break;
            case 404:
                $object_['error'] = 'Không có tài khoản.';
                break;
            default:
                $object_['error'] = 'không thể load.';
                break;
        }
        return json_encode($object_, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
}

header('Content-Type: application/json; charset=UTF-8');

if (!isset($_GET['user']) || empty($_GET['user'])) {
    echo json_encode(['error' => 'Vui lòng cung cấp URL video cần tải bằng cách thêm tham số "?user=" vào URL của trang.'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

$user = $_GET['user'];
try {
    $users = new \Tiktok\Users();
    $details = $users->details($user);
    echo $details;
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
}
?>
