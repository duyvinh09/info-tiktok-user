const https = require('https');

function formatInput(input) {
    input = input.trim();
    try {
        const url = new URL(input);
        const parts = url.pathname.split('/');
        let username = parts.pop() || parts.pop(); // bỏ phần rỗng
        return username.replace(/^@/, '');
    } catch (e) {
        if (input.startsWith('@')) {
            return input.slice(1);
        }
        return input;
    }
}

function fetchHTML(url, headers = {}) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function toVietnamTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const time = date.toLocaleTimeString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const day = date.toLocaleDateString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return `${time} || ${day}`;
}

// Danh sách quốc gia gắn cờ
const flags = {
    "BY": "Belarus 🇧🇾",
    "TJ": "Tajikistan 🇹🇯",
    "TM": "Turkmenistan 🇹🇲",
    "KZ": "Kazakhstan 🇰🇿",
    "GB": "United Kingdom 🇬🇧",
    "DE": "Germany 🇩🇪",
    "ES": "Spain 🇪🇸",
    "FR": "France 🇫🇷",
    "UZ": "Uzbekistan 🇺🇿",
    "US": "United States 🇺🇸",
    "KG": "Kyrgyzstan 🇰🇬",
    "MD": "Moldova 🇲🇩",
    "AC": "Ascension Island 🇦🇨",
    "AD": "Andorra 🇦🇩",
    "AF": "Afghanistan 🇦🇫",
    "AG": "Antigua & Barbuda 🇦🇬",
    "AI": "Anguilla 🇦🇮",
    "AL": "Albania 🇦🇱",
    "AM": "Armenia 🇦🇲",
    "AO": "Angola 🇦🇴",
    "AQ": "Antarctica 🇦🇶",
    "AS": "American Samoa 🇦🇸",
    "AU": "Australia 🇦🇺",
    "AW": "Aruba 🇦🇼",
    "AX": "Åland Islands 🇦🇽",
    "BA": "Bosnia & Herzegovina 🇧🇦",
    "BB": "Barbados 🇧🇧",
    "BD": "Bangladesh 🇧🇩",
    "BF": "Burkina Faso 🇧🇫",
    "BG": "Bulgaria 🇧🇬",
    "BI": "Burundi 🇧🇮",
    "BJ": "Benin 🇧🇯",
    "BL": "St. Barthélemy 🇧🇱",
    "BM": "Bermuda 🇧🇲",
    "BN": "Brunei 🇧🇳",
    "BQ": "Caribbean Netherlands 🇧🇶",
    "BS": "Bahamas 🇧🇸",
    "BT": "Bhutan 🇧🇹",
    "BV": "Bouvet Island 🇧🇻",
    "BW": "Botswana 🇧🇼",
    "BZ": "Belize 🇧🇿",
    "CA": "Canada 🇨🇦",
    "CC": "Cocos (Keeling) Islands 🇨🇨",
    "CD": "Congo - Kinshasa 🇨🇩",
    "CF": "Central African Republic 🇨🇫",
    "CG": "Congo - Brazzaville 🇨🇬",
    "CI": "Côte d’Ivoire 🇨🇮",
    "CK": "Cook Islands 🇨🇰",
    "CM": "Cameroon 🇨🇲",
    "CN": "China 🇨🇳",
    "CS": "Serbia and Montenegro 🇷🇸",
    "CU": "Cuba 🇨🇺",
    "CV": "Cape Verde 🇨🇻",
    "CW": "Curaçao 🇨🇼",
    "CX": "Christmas Island 🇨🇽",
    "CY": "Cyprus 🇨🇾",
    "DK": "Denmark 🇩🇰",
    "DM": "Dominica 🇩🇲",
    "DR": "Dominican Republic 🇩🇴",
    "EA": "Ceuta & Melilla 🇪🇦",
    "EE": "Estonia 🇪🇪",
    "EH": "Western Sahara 🇪🇭",
    "EN": "Ethiopia 🇪🇹",
    "ET": "Fiji 🇫🇯",
    "FJ": "Fiji 🇫🇯",
    "FK": "Falkland Islands 🇫🇰",
    "FM": "Micronesia 🇫🇲",
    "FO": "Faroe Islands 🇫🇴",
    "GA": "Gabon 🇬🇦",
    "GD": "Grenada 🇬🇩",
    "GE": "Georgia 🇬🇪",
    "GF": "French Guiana 🇬🇫",
    "GG": "Guernsey 🇬🇬",
    "GH": "Ghana 🇬🇭",
    "GI": "Gibraltar 🇬🇮",
    "GL": "Greenland 🇬🇱",
    "GN": "Guinea 🇬🇳",
    "GP": "Guadeloupe 🇬🇵",
    "GQ": "Equatorial Guinea 🇬🇶",
    "GS": "South Georgia & South Sandwich Islands 🇬🇸",
    "GU": "Guam 🇬🇺",
    "GW": "Guinea-Bissau 🇬🇼",
    "GY": "Guyana 🇬🇾",
    "HK": "Hong Kong SAR China 🇭🇰",
    "HR": "Croatia 🇭🇷",
    "HT": "Haiti 🇭🇹",
    "IC": "Canary Islands 🇮🇨",
    "IE": "Ireland 🇮🇪",
    "IL": "Israel 🇮🇱",
    "IM": "Isle of Man 🇮🇲",
    "IN": "India 🇮🇳",
    "IO": "British Indian Ocean Territory 🇮🇴",
    "IS": "Iceland 🇮🇸",
    "JE": "Jersey 🇯🇪",
    "KE": "Kenya 🇰🇪",
    "KH": "Cambodia 🇰🇭",
    "KI": "Kiribati 🇰🇮",
    "KN": "St. Kitts & Nevis 🇰🇳",
    "KY": "Cayman Islands 🇰🇾",
    "LA": "Laos 🇱🇦",
    "LC": "St. Lucia 🇱🇨",
    "LI": "Liechtenstein 🇱🇮",
    "LK": "Sri Lanka 🇱🇰",
    "LR": "Liberia 🇱🇷",
    "LS": "Lesotho 🇱🇸",
    "LU": "Luxembourg 🇱🇺",
    "LV": "Latvia 🇱🇻",
    "MC": "Monaco 🇲🇨",
    "ME": "Montenegro 🇲🇪",
    "MF": "St. Martin 🇲🇫",
    "MG": "Madagascar 🇲🇬",
    "MH": "Marshall Islands 🇲🇭",
    "MK": "North Macedonia 🇲🇰",
    "ML": "Mali 🇲🇱",
    "MM": "Myanmar (Burma) 🇲🇲",
    "MN": "Mongolia 🇲🇳",
    "MO": "Macao SAR China 🇲🇴",
    "MP": "Northern Mariana Islands 🇲🇵",
    "MQ": "Martinique 🇲🇶",
    "MS": "Montserrat 🇲🇸",
    "MT": "Malta 🇲🇹",
    "MU": "Mauritius 🇲🇺",
    "MV": "Maldives 🇲🇻",
    "MW": "Malawi 🇲🇼",
    "MZ": "Mozambique 🇲🇿",
    "NA": "Namibia 🇳🇦",
    "NC": "New Caledonia 🇳🇨",
    "NE": "Niger 🇳🇪",
    "NF": "Norfolk Island 🇳🇫",
    "NG": "Nigeria 🇳🇬",
    "NJ": "Sweden 🇸🇪",
    "NO": "Norway 🇳🇴",
    "NR": "Nauru 🇳🇷",
    "NU": "Niue 🇳🇺",
    "NZ": "New Zealand 🇳🇿",
    "PF": "French Polynesia 🇵🇫",
    "PG": "Papua New Guinea 🇵🇬",
    "PK": "Pakistan 🇵🇰",
    "PM": "St. Pierre & Miquelon 🇵🇲",
    "PN": "Pitcairn Islands 🇵🇳",
    "PR": "Puerto Rico 🇵🇷",
    "PW": "Palau 🇵🇼",
    "QS": "Syria 🇸🇾",
    "RE": "Réunion 🇷🇪",
    "RW": "Rwanda 🇷🇼",
    "SB": "Solomon Islands 🇸🇧",
    "SC": "Seychelles 🇸🇨",
    "SH": "St. Helena 🇸🇭",
    "SI": "Slovenia 🇸🇮",
    "SJ": "Svalbard & Jan Mayen 🇸🇯",
    "SL": "Sierra Leone 🇸🇱",
    "SM": "San Marino 🇸🇲",
    "SN": "Senegal 🇸🇳",
    "SR": "Suriname 🇸🇷",
    "ST": "São Tomé & Príncipe 🇸🇹",
    "SX": "Sint Maarten 🇸🇽",
    "SZ": "Eswatini 🇸🇿",
    "TC": "Turks & Caicos Islands 🇹🇨",
    "TF": "French Southern Territories 🇹🇫",
    "TG": "Togo 🇹🇬",
    "TK": "Tokelau 🇹🇰",
    "TL": "Timor-Leste 🇹🇱",
    "TO": "Tonga 🇹🇴",
    "TP": "São Tomé & Príncipe 🇸🇹",
    "TS": "Benin 🇧🇯",
    "TV": "Tuvalu 🇹🇻",
    "TZ": "Tanzania 🇹🇿",
    "UG": "Uganda 🇺🇬",
    "UM": "U.S. Outlying Islands 🇺🇲",
    "VA": "Vatican City 🇻🇦",
    "VC": "St. Vincent & Grenadines 🇻🇨",
    "VG": "British Virgin Islands 🇻🇬",
    "VI": "U.S. Virgin Islands 🇻🇮",
    "VU": "Vanuatu 🇻🇺",
    "WF": "Wallis & Futuna 🇼🇫",
    "WS": "Samoa 🇼🇸",
    "XA": "Canada 🇨🇦",
    "XB": "Puerto Rico 🇵🇷",
    "XK": "Kosovo 🇽🇰",
    "XX": "Serbia 🇷🇸",
    "YJ": "Kosovo 🇽🇰",
    "YT": "Serbia 🇷🇸",
    "ZA": "South Africa 🇿🇦",
    "ZG": "Croatia 🇭🇷",
    "ZM": "Zambia 🇿🇲",
    "ZN": "Croatia 🇭🇷",
    "ZW": "Zimbabwe 🇿🇼",
    "TR": "Turkey 🇹🇷",
    "AZ": "Azerbaijan 🇦🇿",
    "MA": "Morocco 🇲🇦",
    "LB": "Lebanon 🇱🇧",
    "DZ": "Algeria 🇩🇿",
    "ER": "Eritrea 🇪🇷",
    "TN": "Tunisia 🇹🇳",
    "SS": "South Sudan 🇸🇸",
    "BR": "Brazil 🇧🇷",
    "MX": "Mexico 🇲🇽",
    "TH": "Thailand 🇹🇭",
    "ID": "Indonesia 🇮🇩",
    "MY": "Malaysia 🇲🇾",
    "VN": "Việt Nam 🇻🇳",
    "PH": "Philippines 🇵🇭",
    "SG": "Singapore 🇸🇬",
    "KR": "South Korea 🇰🇷",
    "JP": "Japan 🇯🇵",
    "EG": "Egypt 🇪🇬",
    "SY": "Syria 🇸🇾",
    "PS": "Palestine 🇵🇸",
    "JO": "Jordan 🇯🇴",
    "IQ": "Iraq 🇮🇶",
    "DJ": "Djibouti 🇩🇯",
    "KM": "Comoros 🇰🇲",
    "SO": "Somalia 🇸🇴",
    "TD": "Chad 🇹🇩",
    "OM": "Oman 🇴🇲",
    "QA": "Qatar 🇶🇦",
    "KW": "Kuwait 🇰🇼",
    "AE": "United Arab Emirates 🇦🇪",
    "BH": "Bahrain 🇧🇭",
    "SA": "Saudi Arabia 🇸🇦",
    "YE": "Yemen 🇾🇪",
    "LY": "Libya 🇱🇾",
    "SD": "Sudan 🇸🇩",
    "MR": "Mauritania 🇲🇷",
    "LT": "Lithuania 🇱🇹",
    "JM": "Jamaica 🇯🇲",
    "CH": "Switzerland 🇨🇭",
    "IR": "Iran 🇮🇷",
    "AN": "Netherlands Antilles 🇦🇳",
    "FI": "Finland 🇫🇮",
    "PY": "Paraguay 🇵🇾",
    "AR": "Argentina 🇦🇷",
    "GR": "Greece 🇬🇷",
    "UY": "Uruguay 🇺🇾",
    "CR": "Costa Rica 🇨🇷",
    "PE": "Peru 🇵🇪",
    "IT": "Italy 🇮🇹",
    "TT": "Trinidad & Tobago 🇹🇹",
    "SV": "El Salvador 🇸🇻",
    "CZ": "Czechia 🇨🇿",
    "BE": "Belgium 🇧🇪",
    "CO": "Colombia 🇨🇴",
    "TW": "Taiwan 🇹🇼",
    "HN": "Honduras 🇭🇳",
    "EC": "Ecuador 🇪🇨",
    "SK": "Slovakia 🇸🇰",
    "NP": "Nepal 🇳🇵",
    "RS": "Serbia 🇷🇸",
    "NI": "Nicaragua 🇳🇮",
    "SE": "Sweden 🇸🇪",
    "GT": "Guatemala 🇬🇹",
    "CL": "Chile 🇨🇱",
    "NL": "Netherlands 🇳🇱",
    "RO": "Romania 🇷🇴",
    "HU": "Hungary 🇭🇺",
    "VE": "Venezuela 🇻🇪",
    "AT": "Austria 🇦🇹",
    "PL": "Poland 🇵🇱",
    "PA": "Panama 🇵🇦",
    "BO": "Bolivia 🇧🇴",
    "GM": "Gambia 🇬🇲",
    "PT": "Portugal 🇵🇹"
};

// Tùy chọn random User-Agent
const userAgentList = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/15.4 Safari/605.1.15",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 Version/15.4 Mobile Safari/604.1",
    "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 Chrome/92.0.4515.131 Mobile Safari/537.36"
];

function getSafeUserAgent(headerUA) {
    if (headerUA && headerUA.length > 10) return headerUA;
    const index = Math.floor(Math.random() * userAgentList.length);
    return userAgentList[index];
}

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const input = req.query.input;
    if (!input) {
        return res.status(400).json({
            error: 'Thiếu tham số đầu vào. Vui lòng thêm "?input=" vào URL.'
        });
    }

    const username = formatInput(input);
    const url = `https://www.tiktok.com/@${encodeURIComponent(username)}`;
    const userAgent = getSafeUserAgent(req.headers['user-agent']);

    try {
        const html = await fetchHTML(url, {
            'User-Agent': userAgent
        });

        const match = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/s);
        if (!match) {
            return res.status(500).json({ error: 'Không tìm thấy data trong HTML TikTok' });
        }

        const jsonData = JSON.parse(match[1]);
        const userData = jsonData?.__DEFAULT_SCOPE__?.['webapp.user-detail'];
        if (!userData) {
            return res.status(500).json({ error: 'Lỗi data TikTok' });
        }

        const user = userData.userInfo?.user;

        if (user?.createTime) {
            user.createTime = toVietnamTime(user.createTime);
        }
        if (user?.uniqueIdModifyTime) {
            user.uniqueIdModifyTime = toVietnamTime(user.uniqueIdModifyTime);
        }
        if (user?.nickNameModifyTime) {
            user.nickNameModifyTime = toVietnamTime(user.nickNameModifyTime);
        }

        if (user?.region && flags[user.region]) {
            user.region = flags[user.region];
        }

        return res.status(200).json({
            success: true,
            data: userData
        });

    } catch (err) {
        return res.status(500).json({
            error: 'Lỗi khi xử lý: ' + err.message
        });
    }
};