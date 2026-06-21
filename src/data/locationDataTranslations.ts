// Translations for free-text Supabase data on location detail pages.
// Keys are the raw English values stored in the DB (whitespace-normalized
// by translateData). Falls back to the English value when missing.

type Lang = "zh-TW" | "zh-CN";

export const locationDataTranslations: Record<Lang, Record<string, string>> = {
  "zh-TW": {
    // ============ Distances / transport ============
    "52km (75 mins)": "52公里（約75分鐘）",
    "43km (44 mins)": "43公里（約44分鐘）",
    "130km (Around 2 hours From Luohu border)": "130公里（由羅湖口岸出發約2小時）",
    "153km (Around 2 hours)": "153公里（約2小時）",
    "322km (Around 5-6 hours)": "322公里（約5-6小時）",
    "177km (Around 2.5 hours from Bangkok)": "177公里（由曼谷出發約2.5小時）",

    "45km (1 hour)": "45公里（約1小時）",
    "60km (58 mins) From HKZM Bridge border": "60公里（約58分鐘，由港珠澳大橋口岸出發）",
    "48km (50 mins)": "48公里（約50分鐘）",

    "Grab (~THB 1000)": "Grab（約1000泰銖）",
    "Grab (~THB 2500)": "Grab（約2500泰銖）",
    "Taxi (~RMB 100)": "的士（約100人民幣）",
    "Taxi (~RMB 250) OR Reserved pick up service": "的士（約250人民幣）或預約接送服務",
    "Mixed transport (Train + taxi)": "混合交通（高鐵 + 的士）",

    // ============ Climate summaries ============
    "Cool, dry season runs November to February (15-28°C) — the absolute best time for skydiving with crisp visibility over mountains and temples. Hot season March-May can exceed 35°C; avoid the smoky burning season in March-April.":
      "11月至2月為涼爽乾季（15-28°C），是俯瞰山脈與寺廟、能見度最佳的最理想跳傘季節。3月至5月為炎熱季節，氣溫可超過35°C；3月至4月有燒田霧霾，建議避開。",
    "Zhuhai enjoys a mild subtropical maritime climate. October to April brings comfortable temperatures (15-25°C) and lower humidity — perfect for skydiving with stunning coastal views.":
      "珠海屬亞熱帶海洋性氣候，氣候溫和。10月至4月氣溫舒適（15-25°C）、濕度較低，正是俯瞰絕美海岸的最佳跳傘時節。",
    "Subtropical climate with mild winters (12-20°C) and hot, humid summers (28-34°C). October through March offers the most stable, sunny weather for skydiving. Summer brings frequent typhoons and rain.":
      "亞熱帶氣候，冬季溫和（12-20°C），夏季炎熱潮濕（28-34°C）。10月至3月天氣最穩定、陽光充沛，是跳傘的黃金季節。夏季多颱風及降雨。",
    "Tropical island climate — warm year-round (22-32°C) with the dry season from November to April being ideal for skydiving. Summer (May-October) is hot, humid and prone to typhoons.":
      "熱帶海島氣候，全年溫暖（22-32°C），11月至4月為乾季，是最理想的跳傘季節。夏季（5月至10月）炎熱潮濕，多颱風。",
    "Luoding has a humid subtropical climate with mild dry winters and hot rainy summers. October to March is ideal for skydiving — pleasant temperatures (15-25°C), low humidity, and clear skies.":
      "羅定屬潮濕亞熱帶氣候，冬季溫和乾燥，夏季炎熱多雨。10月至3月最適合跳傘——氣溫舒適（15-25°C）、濕度低、天空晴朗。",
    "Tropical climate with warm temperatures year-round (25-33°C). The dry, sunny season from November to March offers the best skydiving conditions with calm winds and clear blue skies. Avoid June-October monsoon for fewer cancellations.":
      "熱帶氣候，全年溫暖（25-33°C）。11月至3月為乾燥晴朗季節，風勢平穩、天空蔚藍，是最佳跳傘時節。建議避開6月至10月雨季以減少取消機會。",

    // ============ Getting there from HK ============
    "Direct flights from Hong Kong to Chiang Mai (CNX) take ~3.5 hours. The dropzone is about 45 minutes from the airport by taxi (~400 THB) or pre-arranged transfer.":
      "由香港直飛清邁（CNX）約需3.5小時。跳傘場距離機場約45分鐘車程，可乘搭的士（約400泰銖）或預約接送。",
    "From Hong Kong: cross the Hong Kong-Zhuhai-Macau Bridge by shuttle bus (about 45 minutes), or take the TurboJET ferry from Sheung Wan to Zhuhai Jiuzhou Port (around 75 minutes). The dropzone is a 30-45 minute drive from the border.":
      "由香港出發：可乘搭港珠澳大橋穿梭巴士（約45分鐘），或於上環乘搭噴射飛航前往珠海九洲港（約75分鐘）。跳傘場距離口岸約30-45分鐘車程。",
    "Most direct: high-speed rail from West Kowloon to Huizhou South (~1.5 hours), then 45-minute taxi to dropzone. Alternative: drive via Shenzhen Bay or Hong Kong-Zhuhai-Macau Bridge (~3 hours total).":
      "最便捷路線：由西九龍乘高鐵直達惠州南站（約1.5小時），再轉的士45分鐘到達跳傘場。另可經深圳灣口岸或港珠澳大橋自駕（合共約3小時）。",
    "Direct flights from Hong Kong to Sanya (SYX) or Haikou (HAK) take ~1.5 hours. From Sanya airport, the dropzone is about 1 hour by taxi or pre-arranged transfer.":
      "由香港直飛三亞（SYX）或海口（HAK）約需1.5小時。由三亞機場前往跳傘場約1小時車程，可乘的士或預約接送。",
    "From Hong Kong: take the high-speed train from West Kowloon to Zhaoqing East (about 1.5 hours), then a 1.5-hour taxi or coach transfer to Luoding. Alternatively, drive via the HZMB and G55 expressway (around 4 hours).":
      "由香港出發：於西九龍乘高鐵到肇慶東站（約1.5小時），再轉的士或巴士約1.5小時抵達羅定。或可經港珠澳大橋及G55高速自駕（約4小時）。",
    "Direct flights from Hong Kong (HKG) to Bangkok (BKK or DMK) take ~3 hours. From Bangkok, Pattaya is a 1.5-hour drive via private transfer (~700 THB) or bus (~150 THB). Total travel time door-to-door: about 6 hours.":
      "由香港（HKG）直飛曼谷（BKK 或 DMK）約需3小時。由曼谷前往芭達雅約1.5小時車程，可選私家車接送（約700泰銖）或巴士（約150泰銖）。全程約6小時。",

    // ============ Travel tips: currency / language / visa / plug / tipping ============
    "Thai Baht (THB)": "泰銖 (THB)",
    "Chinese Yuan (CNY)": "人民幣 (CNY)",

    "Thai (English in tourist areas)": "泰文（旅遊區通英文）",
    "Thai (English widely spoken)": "泰文（英文普及）",
    "Mandarin / Cantonese": "普通話 / 廣東話",
    "Mandarin & Cantonese": "普通話及廣東話",
    "Mandarin (some Hainanese)": "普通話（部分海南話）",

    "30-day visa exemption for HK passport holders": "持香港特區護照可免簽證入境30天",
    "Mainland Travel Permit for HK residents required": "香港居民需持回鄉證入境",
    "HK residents enter via Home Return Permit / mainland travel permit": "香港居民可憑回鄉證入境",
    "30-day visa-free entry for HK residents flying directly to Hainan": "香港居民直飛海南可享30天免簽入境",

    "Type A/B/C, 220V": "A/B/C 型插頭，220V",
    "Type A / I, 220V": "A/I 型插頭，220V",
    "Type A/C/I, 220V": "A/C/I 型插頭，220V",

    "Optional, 10% appreciated": "非必須，10%小費為佳",
    "Not customary": "當地不流行給小費",

    // ============ Accommodation types / distances ============
    Hotel: "酒店",
    Hostel: "青年旅舍",
    Resort: "度假村",
    Guesthouse: "民宿",

    "10 min from dropzone": "距跳傘場10分鐘",
    "15 min from dropzone": "距跳傘場15分鐘",
    "20 min from dropzone": "距跳傘場20分鐘",
    "25 min from dropzone": "距跳傘場25分鐘",
    "30 min from dropzone": "距跳傘場30分鐘",
    "40 min from dropzone": "距跳傘場40分鐘",
    "45 min from dropzone": "距跳傘場45分鐘",
    "50 min from dropzone": "距跳傘場50分鐘",
    "1 hr from dropzone": "距跳傘場約1小時",

    // ============ Accommodations: names + descriptions ============
    "Sheraton Zhuhai Hotel": "珠海華發喜來登酒店",
    "Luxury seafront hotel with elegant rooms, multiple restaurants, and full spa facilities.":
      "豪華海濱酒店，房間優雅、餐廳多元，並設有完善水療設施。",
    "Zhuhai Holiday Inn Express": "珠海智選假日酒店",
    "Modern mid-range hotel close to the city center with great value and reliable service.":
      "鄰近市中心的現代化中檔酒店，性價比高、服務可靠。",
    "Gongbei Port Hostel": "拱北口岸青年旅舍",
    "Budget-friendly hostel near the Macau border — convenient for cross-border travelers.":
      "鄰近澳門口岸的經濟型旅舍，過境旅客最方便。",
    "137 Pillars House": "137 Pillars House 精品酒店",
    "Award-winning boutique luxury hotel blending colonial heritage with Lanna design. Pure indulgence.":
      "屢獲殊榮的精品奢華酒店，融合殖民風情與蘭納設計，極致享受。",
    "Tamarind Village": "羅望子之家酒店",
    "Charming hotel inside the Old City walls, set around a 200-year-old tamarind tree.":
      "古城牆內的迷人酒店，圍繞一棵200年樹齡的羅望子樹而建。",
    "Stamps Backpackers": "Stamps 背包客旅舍",
    "Friendly hostel in the heart of Old City with rooftop bar, pool, and easy access to night markets.":
      "位於古城核心的友善旅舍，設天台酒吧、泳池，步行即達夜市。",
    "Sheraton Huizhou Beach Resort": "惠州巽寮灣喜來登度假酒店",
    "Beachfront 5-star resort on Xunliao Bay with private beach, multiple pools and family suites.":
      "巽寮灣海濱五星級度假酒店，設私人沙灘、多個泳池及家庭套房。",
    "Holiday Inn Huizhou": "惠州假日酒店",
    "Reliable comfort in central Huizhou — modern rooms, good breakfast and easy taxi access to the dropzone.":
      "位於惠州市中心，房間現代、早餐豐富，前往跳傘場交通便利。",
    "Hanting Hotel": "漢庭酒店",
    "Clean, budget-friendly business hotel chain. Perfect for a one-night stay before or after your jump.":
      "潔淨、實惠的連鎖商務酒店，是跳傘前後一晚住宿的理想選擇。",
    "Luoding International Hotel": "羅定國際酒店",
    "Modern 4-star hotel in central Luoding with comfortable rooms and on-site restaurants.":
      "位於羅定市中心的四星級現代酒店，房間舒適並設有餐廳。",
    "Yacheng Holiday Inn": "雅城假日酒店",
    "Mid-range hotel with clean rooms and local hospitality, popular with weekend travelers.":
      "中檔酒店，房間整潔、待客熱情，深受周末旅客歡迎。",
    "Luoding City Inn": "羅定城市旅館",
    "Budget-friendly guesthouse with simple rooms — perfect for short overnight stays.":
      "經濟實惠的民宿，房間簡約，適合短暫過夜。",
    "Atlantis Sanya": "三亞亞特蘭蒂斯",
    "Iconic ocean-themed mega-resort with the largest aquarium in Asia, water park and stunning suites.":
      "海洋主題標誌性度假村，設有亞洲最大的水族館、水上樂園及奢華套房。",
    "Mangrove Tree Resort World": "三亞海棠灣天房洲際度假酒店",
    "Sprawling beachfront resort on Yalong Bay with multiple themed buildings, pools and restaurants.":
      "亞龍灣海濱大型度假村，多棟主題建築、泳池及餐廳一應俱全。",
    "Ji Hotel Sanya": "三亞全季酒店",
    "Modern, well-priced city hotel ideal for travellers prioritising convenience over luxury.":
      "現代化、高性價比的市區酒店，適合重視便利的旅客。",
    "Hilton Pattaya": "芭達雅希爾頓酒店",
    "Luxury beachfront hotel with infinity pool, panoramic Gulf of Thailand views, and easy access to Walking Street.":
      "海濱奢華酒店，設無邊際泳池，可飽覽泰國灣全景，鄰近 Walking Street。",
    "Centara Mirage Beach Resort": "芭達雅 Centara Mirage 海灘度假村",
    "Family-friendly resort with lazy river, water park and direct beach access. Great for groups travelling together.":
      "親子度假村，設漂流河、水上樂園，並可直達沙灘，適合團體出遊。",
    "Lub d Pattaya": "芭達雅 Lub d 旅舍",
    "Modern social hostel with private rooms and dorms. Pool, bar, and a vibrant backpacker community.":
      "現代化社交型旅舍，提供私人房及多人房，設有泳池、酒吧及活潑的背包客社區。",

    // ============ Attraction categories ============
    Culture: "文化",
    culture: "文化",
    Nature: "自然",
    nature: "自然",
    Beach: "海灘",
    beach: "海灘",
    Shopping: "購物",
    shopping: "購物",
    sightseeing: "觀光",

    "1 hr": "1小時",
    "1.5 hr": "1.5小時",
    "15 min": "15分鐘",
    "20 min": "20分鐘",
    "25 min": "25分鐘",
    "30 min": "30分鐘",
    "35 min": "35分鐘",
    "40 min": "40分鐘",
    "45 min": "45分鐘",
    "45 min by ferry": "渡輪約45分鐘",

    // Attractions
    "Zhuhai Fisher Girl Statue": "珠海漁女像",
    "Iconic 8.7m granite statue overlooking Xianglu Bay — the symbol of Zhuhai.":
      "高8.7米的花崗岩雕像，俯瞰香爐灣，是珠海的標誌。",
    "Lovers' Road": "情侶路",
    "Scenic 28km coastal road perfect for cycling, sunset walks, and seaside dining.":
      "全長28公里的海濱大道，適合單車、看日落及海景用餐。",
    "Hengqin Chimelong Ocean Kingdom": "橫琴長隆海洋王國",
    "One of the world's largest marine theme parks — great for families.":
      "全球最大型的海洋主題公園之一，親子同遊首選。",
    "New Yuan Ming Palace": "圓明新園",
    "A scaled replica of Beijing's Old Summer Palace with cultural performances.":
      "按比例重現北京圓明園的主題園區，並有文化表演。",
    "Doi Suthep Temple": "雙龍寺",
    "Sacred mountaintop temple with golden chedi and panoramic views over Chiang Mai. A must-visit landmark.":
      "山頂神聖寺廟，金色佛塔配清邁全景，必訪地標。",
    "Elephant Nature Park": "大象自然公園",
    "Ethical elephant sanctuary where you can feed and bathe rescued elephants. No riding — just love.":
      "道德大象保護區，可餵食及為獲救大象洗澡，不騎乘、純體驗。",
    "Old City Temples": "古城寺廟群",
    "Walk the moated Old City to discover Wat Chedi Luang, Wat Phra Singh and dozens of historic temples.":
      "漫步護城河環繞的古城，探訪柴迪隆寺、帕辛寺等數十座歷史寺廟。",
    "Sunday Walking Street": "週日步行街",
    "Sprawling Sunday-evening market with handicrafts, street food and live music throughout the Old City.":
      "古城內延綿的週日夜市，手工藝、街頭小食、現場音樂應有盡有。",
    "West Lake (Xihu)": "惠州西湖",
    "Scenic freshwater lake with pagodas, walking paths and pedal boats. A relaxing post-jump stroll.":
      "風景秀麗的淡水湖，有古塔、步道及腳踏船，是跳傘後放鬆的好去處。",
    "Xunliao Bay Beach": "巽寮灣",
    "One of Guangdong's cleanest beaches — golden sand, gentle surf and beachside seafood shacks.":
      "廣東最潔淨的海灘之一，金沙、輕浪，並有海邊海鮮小店。",
    "Luofu Mountain": "羅浮山",
    "Sacred Taoist mountain with hiking trails, ancient temples and waterfalls. Great half-day excursion.":
      "道教聖山，設行山徑、古寺與瀑布，半日遊首選。",
    "Huizhou Old Town": "惠州古城",
    "Restored historic district with Qing-dynasty alleys, teahouses and craft shops. Best at dusk.":
      "修復後的歷史街區，清代小巷、茶館與工藝店林立，黃昏最美。",
    "Longwan Eco Tourist Area": "龍灣生態旅遊區",
    "Lush valley with waterfalls, hiking trails, and natural pools — a refreshing escape after your jump.":
      "蔥鬱山谷，有瀑布、行山徑及天然水池，是跳傘後消暑勝地。",
    "Jinyin Lake": "金銀湖",
    "Scenic reservoir surrounded by mountains, great for boat rides and lakeside walks.":
      "群山環抱的水庫，適合泛舟與湖畔漫步。",
    "Luoding Confucian Temple": "羅定文廟",
    "Historic Ming-dynasty temple showcasing classical Chinese architecture.":
      "明代古寺，展現中國古典建築之美。",
    "Cangzu Mountain": "蒼祖山",
    "Sacred mountain offering panoramic views and Taoist temple sites.":
      "聖山之一，可飽覽全景，並有道教寺廟遺址。",
    "Yalong Bay": "亞龍灣",
    'Often called "the Oriental Hawaii" — 7km of pristine white sand and turquoise water. Snorkelling paradise.':
      "有「東方夏威夷」之稱，7公里純白沙灘、碧綠海水，浮潛天堂。",
    "Nanshan Buddhism Cultural Park": "南山佛教文化園",
    "Home to the 108-metre Guanyin statue rising from the sea — one of the tallest in the world.":
      "矗立海上的108米觀音像所在地，是世界最高觀音像之一。",
    "Wuzhizhou Island": "蜈支洲島",
    "Heart-shaped island with diving, glass-bottom boats and some of China's clearest water.":
      "心形小島，可潛水、乘玻璃底船，海水清澈度居全國之冠。",
    "Tianya Haijiao": "天涯海角",
    'Romantic "Edge of the Sky, Corner of the Sea" coastal park with iconic boulders and ocean views.':
      "浪漫的「天涯海角」海濱公園，有標誌性巨石與壯闊海景。",
    "Sanctuary of Truth": "真理寺",
    "Stunning all-wooden temple sculpture, hand-carved and over 100m tall. A masterpiece of Thai craftsmanship.":
      "驚艷的全木雕寺廟，手工雕刻、高逾100米，泰國工藝代表作。",
    "Coral Island (Koh Larn)": "珊瑚島（蘭島）",
    "Crystal-clear waters and white-sand beaches just off the coast. Perfect for snorkelling and chilling after your jump.":
      "離岸不遠的水晶清澈海域與白沙灘，跳傘後浮潛放鬆首選。",

    // ============ Food ============
    "Wanzai Seafood": "灣仔海鮮",
    "Wanzai Seafood Street": "灣仔海鮮街",
    "Fresh seafood market with restaurants cooking your pick to order — try the steamed prawns and clams.":
      "新鮮海鮮市場，可即點即煮，推薦清蒸大蝦及炒蜆。",
    "Doumen Cantonese Cuisine": "斗門粵菜",
    "Doumen District restaurants": "斗門區餐廳",
    "Traditional Cantonese village dishes featuring river fish and rural specialties.":
      "傳統粵式鄉村菜，以河鮮及農家風味為特色。",
    "Portuguese-style Egg Tarts": "葡式蛋撻",
    "Gongbei bakeries": "拱北烘焙店",
    "Macau-influenced egg tarts with a flaky crust and creamy custard center.":
      "受澳門影響的葡式蛋撻，酥脆撻皮配香滑蛋漿。",
    "Khao Soi": "金麵咖哩（Khao Soi）",
    "Khao Soi Khun Yai": "Khao Soi Khun Yai 餐廳",
    "Northern Thailand's signature dish: creamy coconut curry noodles topped with crispy egg noodles.":
      "泰北招牌菜：椰香咖哩湯麵配脆炸雞蛋麵。",
    "Sai Oua (Northern Sausage)": "Sai Oua 泰北香腸",
    "Warorot Market": "瓦洛洛市場",
    "Spicy grilled herb-and-pork sausage packed with lemongrass, kaffir lime and chilli. Pure Lanna flavour.":
      "辛辣燒烤香草豬肉腸，香茅、青檸葉與辣椒滿載，蘭納風味十足。",
    "Sticky Rice with Mango": "芒果糯米飯",
    "Chang Phuak Night Market": "象門夜市",
    "Warm sticky rice and ripe Nam Dok Mai mango with coconut cream — refreshing after a hot day jumping.":
      "溫熱糯米配香甜芒果及椰漿，跳傘後最消暑。",
    "Hakka Salt-Baked Chicken": "客家鹽焗雞",
    "Lao Dong Jiang Restaurant": "老東江酒家",
    "Huizhou's most famous dish — whole chicken slow-baked in coarse salt for tender, fragrant meat.":
      "惠州名菜，整雞以粗鹽慢焗，肉嫩味香。",
    "Stuffed Tofu (Niang Dofu)": "釀豆腐",
    "Hakka Family Restaurant": "客家私房菜",
    "Silken tofu stuffed with seasoned pork, then braised in savoury broth. Comfort food at its finest.":
      "嫩豆腐釀入調味豬肉，再以鮮湯慢燉，極致暖心。",
    "East River Steamed Fish": "東江清蒸魚",
    "Local seafood restaurants": "當地海鮮餐廳",
    "Fresh river fish steamed Cantonese-style with ginger, scallion and a splash of soy. Delicate and clean. Delicate and clean.":
      "新鮮河魚以粵式清蒸，配薑蔥及豉油，清雅鮮甜。",
    "Fresh river fish steamed Cantonese-style with ginger, scallion and a splash of soy. Delicate and clean.":
      "新鮮河魚以粵式清蒸，配薑蔥及豉油，清雅鮮甜。",
    "Luoding Pickled Vegetables": "羅定泡菜",
    "Local Cantonese restaurants": "當地粵菜館",
    "A signature Luoding specialty — fragrant, tangy pickles served with rice or stir-fries.":
      "羅定招牌特產，香酸開胃，伴飯或入菜皆宜。",
    "Roasted Goose": "燒鵝",
    "Yacheng District eateries": "雅城區餐廳",
    "Cantonese-style roasted goose with crispy skin and tender meat.": "粵式燒鵝，皮脆肉嫩。",
    "Rice Noodle Rolls (Cheung Fun)": "腸粉",
    "Morning markets": "早市",
    "Silky steamed rice rolls with sweet soy sauce — a classic local breakfast.":
      "嫩滑米腸配甜豉油，地道經典早餐。",
    "Wenchang Chicken": "文昌雞",
    "Sichuan & Hainanese Restaurants": "川海菜館",
    "Hainan's most famous dish — free-range chicken poached to silky perfection, served with ginger-scallion oil.":
      "海南名菜，走地雞浸煮至嫩滑，配薑蔥油。",
    "Hele Crab": "和樂蟹",
    "Local seafood markets": "當地海鮮市場",
    "Sweet, fatty crab from Wanning prized across China. Steamed simply to let the flavour shine.":
      "來自萬寧、蜚聲全國的肥美甜蟹，清蒸最能突顯原味。",
    "Coconut Rice": "椰子飯",
    "Sanya street stalls": "三亞街頭小攤",
    "Fragrant rice steamed inside a young coconut with chicken or seafood. Tropical comfort food.":
      "於嫩椰殼內蒸煮的香米飯，配雞肉或海鮮，熱帶風味。",
    "Som Tam (Papaya Salad)": "Som Tam 青木瓜沙律",
    "Mum Aroi Restaurant": "Mum Aroi 餐廳",
    "Spicy, tangy green papaya salad with lime, chilli and peanuts. The quintessential Thai street food.":
      "酸辣青木瓜沙律，配青檸、辣椒及花生，泰國街頭經典。",
    "Tom Yum Goong": "冬蔭功湯",
    "Sketch Restaurant": "Sketch Restaurant 餐廳",
    "Hot and sour prawn soup with lemongrass, galangal and lime leaves. Fragrant and unforgettable.":
      "酸辣大蝦湯，配香茅、南薑及青檸葉，香氣難忘。",
    "Mango Sticky Rice": "芒果糯米飯",
    "Naklua Market": "Naklua 市場",
    "Sweet sticky rice paired with ripe mango and coconut cream. Thailand's most beloved dessert.":
      "香甜糯米配熟芒果及椰漿，泰國最受歡迎的甜品。",

    // ============ Tour itinerary — day titles ============
    "Arrival & Alcazar Night": "抵達與 Alcazar 夜遊",
    "Arrival & Old City": "抵達與古城散策",
    "Arrival & Phoenix Island Lights": "抵達與鳳凰島燈光秀",
    "Arrival & Sanya Bay Sunset": "抵達與三亞灣日落",
    "Arrival, Sanctuary & Walking Street": "抵達、真理寺與步行街",
    "Bangkok Shopping & Departure": "曼谷購物與返程",
    "Cooking Class & Departure": "泰菜烹飪體驗與返程",
    "Departure": "返程",
    "Final Views & Departure": "最後美景與返程",
    "Free & Easy + Departure": "自由活動 + 返程",
    "Free & Easy in Pattaya": "芭堤雅自由活動",
    "Free & Easy in Sanya": "三亞自由活動",
    "HK → Huizhou & Skydive": "香港 → 惠州跳傘",
    "HK → Zhuhai One-Day Skydive": "香港 → 珠海一日跳傘",
    "Tandem Skydive & Coral Island": "雙人跳傘與珊瑚島",
    "Tandem Skydive & Cultural Icons": "雙人跳傘與文化景點",
    "Tandem Skydive & Cultural Pattaya": "雙人跳傘與芭堤雅文化",
    "Tandem Skydive & Island Day": "雙人跳傘與離島之旅",
    "Tandem Skydive Day": "雙人跳傘日",
    "Temples & Mountains": "寺廟與山林",
    "West Lake & Return": "西湖遊覽與返程",

    // ============ Tour itinerary — item titles ============
    "09:00 Meet at HK Port (allow buffer time)": "09:00 於香港口岸集合（請預留緩衝時間）",
    "10:10 Private transfer to dropzone (~1h15m)": "10:10 專車接送至跳傘場（約1小時15分鐘）",
    "11:25 Arrive dropzone & check-in": "11:25 抵達跳傘場並辦理報到",
    "13:45 Jump complete, certificate & video": "13:45 完成跳傘，領取證書及影片",
    "14:30 Lunch": "14:30 午餐",
    "16:30 Coach back to Zhuhai Port": "16:30 乘車返回珠海口岸",
    "17:40 Gold Bus shuttle back to HK": "17:40 乘金巴返回香港",
    "18:30 Arrive HK Port": "18:30 抵達香港口岸",
    "4★ city hotel": "四星級市區酒店",
    "Alcazar Cabaret Show": "Alcazar 人妖歌舞秀",
    "Arrive Zhuhai Port & immigration (~20 min)": "抵達珠海口岸並通關（約20分鐘）",
    "Art in Paradise 3D museum": "Art in Paradise 3D立體美術館",
    "Asiatique or Jodd Fairs night market": "Asiatique 或 Jodd Fairs 夜市",
    "Big C souvenir run": "Big C 手信掃貨",
    "Boutique hotel": "精品酒店",
    "Boutique hotel in Old City": "古城區精品酒店",
    "Breakfast": "早餐",
    "Breakfast + farm-to-table lunch": "早餐 + 農家午餐",
    "Breakfast + lunch": "早餐 + 午餐",
    "Briefing": "行前簡介",
    "Coach back to HK": "乘車返回香港",
    "Coconut Dream Corridor stroll": "椰夢長廊漫步",
    "Cooking class lunch": "烹飪課午餐",
    "Dadonghai Beach": "大東海沙灘",
    "Dadonghai night stroll": "大東海夜遊",
    "Direct flight HKG–CNX + transfer": "香港直飛清邁 + 接送",
    "Doi Suthep": "雙龍寺（素帖山）",
    "Erawan Shrine / Central World quick stop": "四面佛 / Central World 快閃",
    "Flight + transfer": "航班 + 接送",
    "Flight BKK → HKG": "曼谷飛香港",
    "Flight HKG → BKK": "香港飛曼谷",
    "Flight HKG → Sanya (SYX)": "香港飛三亞（SYX）",
    "Flight Sanya → HKG": "三亞飛香港",
    "Free — Atlantis Aquaventure Waterpark": "自由活動 — 亞特蘭蒂斯水世界",
    "Free — Big Buddha (Wat Phra Yai) viewpoint": "自由活動 — 大佛山（Wat Phra Yai）觀景台",
    "Free — Nong Nooch Garden": "自由活動 — 東芭樂園",
    "Free dinner — hotel beach or West Island sunset": "自由晚餐 — 酒店海灘或西島日落",
    "Free seafood dinner — Mimosa or Lan Po seafood market": "自由海鮮晚餐 — Mimosa 或藍坡海鮮市場",
    "Free time — Haitang Bay Duty-Free Mall": "自由時間 — 海棠灣免稅城",
    "Gold Bus shuttle to Zhuhai (~40 min)": "金巴前往珠海（約40分鐘）",
    "Hainan coffee & snack shopping": "海南咖啡及手信採購",
    "Haitang Bay Duty-Free Mall shopping": "海棠灣免稅城購物",
    "Half-day cooking class": "半日泰菜烹飪課",
    "HD video & photos": "高清影片及照片",
    "HK–Huizhou coach + dropzone transfer": "港惠跨境巴士 + 跳傘場接送",
    "Hotel ⇄ dropzone": "酒店 ⇄ 跳傘場",
    "Hotel ⇄ dropzone (45 min)": "酒店 ⇄ 跳傘場（約45分鐘）",
    "Hotel check-in": "酒店辦理入住",
    "Huizhou West Lake stroll": "惠州西湖漫步",
    "Khao Soi welcome dinner": "Khao Soi 咖喱麵迎賓晚餐",
    "Koh Larn (Coral Island) by speedboat": "快艇前往珊瑚島（Koh Larn）",
    "Last-minute Hainan coffee shopping": "出發前海南咖啡掃貨",
    "Local Hainanese dinner": "海南風味晚餐",
    "Luhuitou Park night view": "鹿回頭公園夜景",
    "Lunch + dinner": "午餐 + 晚餐",
    "Nanshan Cultural Zone — 108m Guanyin statue": "南山文化園 — 108米海上觀音",
    "Nanshan Temple or Luhuitou 360° viewpoint": "南山寺或鹿回頭360°觀景台",
    "Night Bazaar": "夜市集",
    "Night Market": "夜市",
    "Nong Nooch Tropical Garden — Dinosaur Valley & cultural show": "東芭熱帶植物園 — 恐龍谷及文化表演",
    "Optional Sanya Romance Show (千古情)": "自選三亞千古情演出",
    "Or Art in Paradise 3D museum": "或 Art in Paradise 3D立體美術館",
    "Or Atlantis Sanya day-pass": "或亞特蘭蒂斯三亞日券",
    "Or Binglang Valley (Li & Miao village)": "或檳榔谷（黎苗村寨）",
    "Or Frost Magical Ice": "或 Frost 魔法冰雪世界",
    "Or Khao Kheow Open Zoo": "或 Khao Kheow 野生動物園",
    "Or Pattaya Floating Market": "或芭堤雅水上市場",
    "Or Yalong Bay Tropical Forest Park (glass bridge)": "或亞龍灣熱帶天堂森林公園（玻璃橋）",
    "Or Yanoda Rainforest": "或呀諾達雨林",
    "Pattaya Beach walk": "芭堤雅海灘漫步",
    "Pattaya Floating Market dinner & street food": "芭堤雅水上市場晚餐及街頭小食",
    "Phoenix Island light show": "鳳凰島燈光秀",
    "Private transfer": "專車接送",
    "Private transfer to airport": "專車送機",
    "Private transfer to hotel": "專車送至酒店",
    "Private transfer to Pattaya": "專車前往芭堤雅",
    "Private transfer to Pattaya (~1.5h)": "專車前往芭堤雅（約1.5小時）",
    "Private van": "專屬商務車",
    "Riverside dinner": "河畔晚餐",
    "Sanctuary of Truth — wood-carved seaside temple": "真理寺 — 海邊木雕聖殿",
    "Seafood dinner at First Market (第一市場)": "於第一市場享用海鮮晚餐",
    "Seaside BBQ celebration dinner": "海邊燒烤慶祝晚宴",
    "Shuttle to dropzone + safety briefing": "跳傘場接送 + 安全簡介",
    "Siam / IconSiam shopping": "Siam / IconSiam 購物",
    "Skydive briefing & training": "跳傘簡介及訓練",
    "Snorkeling / parasailing / jet ski": "浮潛 / 拖曳傘 / 水上電單車",
    "Snorkeling / water sports": "浮潛 / 水上活動",
    "Souvenir shopping": "手信採購",
    "Spa / massage": "Spa / 按摩",
    "Street food tour": "街頭小食之旅",
    "Tandem skydive": "雙人跳傘",
    "Tandem skydive jump": "雙人跳傘體驗",
    "Tandem skydive over Doi Saket": "於 Doi Saket 上空雙人跳傘",
    "Tandem skydive over Haitang Bay": "於海棠灣上空雙人跳傘",
    "Tandem skydive over Haitang Bay coastline": "於海棠灣海岸線上空雙人跳傘",
    "Tandem skydive over Pattaya coast": "於芭堤雅海岸上空雙人跳傘",
    "Terminal 21 Pattaya dinner": "Terminal 21 芭堤雅晚餐",
    "Terminal 21 Pattaya shopping": "Terminal 21 芭堤雅購物",
    "Tha Phae Gate sunset": "塔佩門日落",
    "Thai massage & beach time": "泰式按摩及海灘時光",
    "Thai seafood celebration dinner": "泰式海鮮慶祝晚宴",
    "Tianya Haijiao (Ends of the Earth)": "天涯海角",
    "Tiffany / Alcazar Cabaret Show": "Tiffany / Alcazar 人妖歌舞秀",
    "Transfer + flight": "接送 + 航班",
    "Transfer to Bangkok": "前往曼谷",
    "Video & photos": "影片及照片",
    "Walking Street": "步行街",
    "Welcome dinner": "迎賓晚餐",
    "Welcome Hainanese seafood dinner": "海南風味迎賓海鮮晚宴",
    "Wuzhizhou Island — the 'Maldives of China'": "蜈支洲島 — 「中國的馬爾代夫」",
    "Yalong Bay beach walk": "亞龍灣海灘漫步",

    // ============ Tour itinerary — locations ============
    "Alcazar Pattaya": "芭堤雅 Alcazar",
    "Art in Paradise": "Art in Paradise 立體美術館",
    "Asiatique": "Asiatique 河濱夜市",
    "Atlantis Sanya": "三亞亞特蘭蒂斯",
    "Bangkok → HK": "曼谷 → 香港",
    "Chiang Mai → HK": "清邁 → 香港",
    "Chiang Mai Skydiving": "清邁跳傘",
    "Chiang Mai Skydiving dropzone": "清邁跳傘場",
    "Dadonghai": "大東海",
    "Doi Suthep & Nimman": "雙龍寺與 Nimman",
    "Haitang Bay": "海棠灣",
    "HK → Bangkok": "香港 → 曼谷",
    "HK → Chiang Mai": "香港 → 清邁",
    "HK → Sanya": "香港 → 三亞",
    "HK-Zhuhai-Macao Bridge HK Port": "港珠澳大橋香港口岸",
    "Huizhou → HK": "惠州 → 香港",
    "IconSiam": "IconSiam 商場",
    "Koh Larn": "珊瑚島",
    "Luhuitou Peak Park": "鹿回頭公園",
    "Nanshan / Luhuitou": "南山 / 鹿回頭",
    "Nanshan Temple": "南山寺",
    "Nong Nooch Garden": "東芭樂園",
    "Pattaya → Bangkok": "芭堤雅 → 曼谷",
    "Pattaya Floating Market": "芭堤雅水上市場",
    "Phoenix Island": "鳳凰島",
    "Sanctuary of Truth": "真理寺",
    "Sanya → HK": "三亞 → 香港",
    "Sanya Bay": "三亞灣",
    "Sanya Phoenix Airport": "三亞鳳凰機場",
    "Terminal 21 Pattaya": "芭堤雅 Terminal 21",
    "Thai Sky Adventures": "Thai Sky Adventures 跳傘場",
    "Tianya Haijiao": "天涯海角",
    "Walking Street": "步行街",
    "Wat Phra Yai": "大佛山（Wat Phra Yai）",
    "Weland Hainan dropzone": "Weland 海南跳傘場",
    "Weland Zhuhai Dropzone": "Weland 珠海跳傘場",
    "Wuzhizhou Island": "蜈支洲島",
    "Yalong Bay": "亞龍灣",
    "Yingfei Huizhou dropzone": "鷹飛惠州跳傘場",

    // ============ Tour itinerary — quick highlights ============
    "Sanya Bay sunset": "三亞灣日落",
    "First Market seafood": "第一市場海鮮",
    "Luhuitou Park": "鹿回頭公園",
    "Nanshan 108m Guanyin": "南山108米觀音",
    "Haitang Bay Duty-Free": "海棠灣免稅城",
    "Yalong Bay Forest Park": "亞龍灣森林公園",
    "Departure transfer": "返程接送",
    "Phoenix Island lights": "鳳凰島燈光秀",
    "Welcome seafood": "迎賓海鮮",
    "Wuzhizhou Island": "蜈支洲島",
    "Water sports": "水上活動",
    "Atlantis Aquaventure": "亞特蘭蒂斯水世界",
    "Yanoda Rainforest": "呀諾達雨林",
    "Spa & shopping": "Spa 與購物",
    "Luhuitou 360°": "鹿回頭360°",
    "Sanctuary of Truth": "真理寺",
    "Terminal 21": "Terminal 21 商場",
    "Nong Nooch Garden": "東芭樂園",
    "Alcazar Cabaret": "Alcazar 人妖秀",
    "Big Buddha": "大佛山",
    "Floating Market": "水上市場",
    "Bangkok transfer": "曼谷接送",
    "Art in Paradise 3D": "Art in Paradise 3D",
    "Koh Larn snorkeling": "珊瑚島浮潛",
    "Jet ski": "水上電單車",
    "Nong Nooch": "東芭樂園",
    "Khao Kheow Zoo": "Khao Kheow 動物園",
    "Thai massage": "泰式按摩",
    "Bangkok shopping": "曼谷購物",
    "Jodd Fairs": "Jodd Fairs 夜市",
  },


  "zh-CN": {
    // ============ Distances / transport ============
    "52km (75 mins)": "52公里（约75分钟）",
    "43km (44 mins)": "43公里（约44分钟）",
    "130km (Around 2 hours From Luohu border)": "130公里（由罗湖口岸出发约2小时）",
    "153km (Around 2 hours)": "153公里（约2小时）",
    "322km (Around 5-6 hours)": "322公里（约5-6小时）",
    "177km (Around 2.5 hours from Bangkok)": "177公里（由曼谷出发约2.5小时）",

    "45km (1 hour)": "45公里（约1小时）",
    "60km (58 mins) From HKZM Bridge border": "60公里（约58分钟，由港珠澳大桥口岸出发）",
    "48km (50 mins)": "48公里（约50分钟）",

    "Grab (~THB 1000)": "Grab（约1000泰铢）",
    "Grab (~THB 2500)": "Grab（约2500泰铢）",
    "Taxi (~RMB 100)": "出租车（约100人民币）",
    "Taxi (~RMB 250) OR Reserved pick up service": "出租车（约250人民币）或预约接送服务",
    "Mixed transport (Train + taxi)": "混合交通（高铁 + 出租车）",

    // ============ Climate ============
    "Cool, dry season runs November to February (15-28°C) — the absolute best time for skydiving with crisp visibility over mountains and temples. Hot season March-May can exceed 35°C; avoid the smoky burning season in March-April.":
      "11月至2月为凉爽干季（15-28°C），俯瞰山脉与寺庙能见度最佳，是最理想的跳伞季节。3月至5月炎热可超35°C；3月至4月有烧田烟雾，建议避开。",
    "Zhuhai enjoys a mild subtropical maritime climate. October to April brings comfortable temperatures (15-25°C) and lower humidity — perfect for skydiving with stunning coastal views.":
      "珠海属亚热带海洋性气候，气候温和。10月至4月气温舒适（15-25°C）、湿度较低，是俯瞰海岸美景的最佳跳伞时节。",
    "Subtropical climate with mild winters (12-20°C) and hot, humid summers (28-34°C). October through March offers the most stable, sunny weather for skydiving. Summer brings frequent typhoons and rain.":
      "亚热带气候，冬季温和（12-20°C），夏季炎热潮湿（28-34°C）。10月至3月天气最稳定、阳光充沛，是跳伞黄金季节。夏季多台风及降雨。",
    "Tropical island climate — warm year-round (22-32°C) with the dry season from November to April being ideal for skydiving. Summer (May-October) is hot, humid and prone to typhoons.":
      "热带海岛气候，全年温暖（22-32°C），11月至4月为干季，是最理想的跳伞季节。夏季（5月至10月）炎热潮湿，多台风。",
    "Luoding has a humid subtropical climate with mild dry winters and hot rainy summers. October to March is ideal for skydiving — pleasant temperatures (15-25°C), low humidity, and clear skies.":
      "罗定属潮湿亚热带气候，冬季温和干燥，夏季炎热多雨。10月至3月最适合跳伞——气温舒适（15-25°C）、湿度低、天空晴朗。",
    "Tropical climate with warm temperatures year-round (25-33°C). The dry, sunny season from November to March offers the best skydiving conditions with calm winds and clear blue skies. Avoid June-October monsoon for fewer cancellations.":
      "热带气候，全年温暖（25-33°C）。11月至3月干燥晴朗，风势平稳、天空蔚蓝，是最佳跳伞时节。建议避开6月至10月雨季以减少取消机会。",

    // ============ Getting there ============
    "Direct flights from Hong Kong to Chiang Mai (CNX) take ~3.5 hours. The dropzone is about 45 minutes from the airport by taxi (~400 THB) or pre-arranged transfer.":
      "由香港直飞清迈（CNX）约需3.5小时。跳伞场距机场约45分钟车程，可乘出租车（约400泰铢）或预约接送。",
    "From Hong Kong: cross the Hong Kong-Zhuhai-Macau Bridge by shuttle bus (about 45 minutes), or take the TurboJET ferry from Sheung Wan to Zhuhai Jiuzhou Port (around 75 minutes). The dropzone is a 30-45 minute drive from the border.":
      "由香港出发：可乘搭港珠澳大桥穿梭巴士（约45分钟），或于上环乘搭喷射飞航前往珠海九洲港（约75分钟）。跳伞场距口岸约30-45分钟车程。",
    "Most direct: high-speed rail from West Kowloon to Huizhou South (~1.5 hours), then 45-minute taxi to dropzone. Alternative: drive via Shenzhen Bay or Hong Kong-Zhuhai-Macau Bridge (~3 hours total).":
      "最便捷路线：由西九龙乘高铁直达惠州南站（约1.5小时），再转出租车45分钟到达跳伞场。也可经深圳湾口岸或港珠澳大桥自驾（合共约3小时）。",
    "Direct flights from Hong Kong to Sanya (SYX) or Haikou (HAK) take ~1.5 hours. From Sanya airport, the dropzone is about 1 hour by taxi or pre-arranged transfer.":
      "由香港直飞三亚（SYX）或海口（HAK）约需1.5小时。由三亚机场前往跳伞场约1小时车程，可乘出租车或预约接送。",
    "From Hong Kong: take the high-speed train from West Kowloon to Zhaoqing East (about 1.5 hours), then a 1.5-hour taxi or coach transfer to Luoding. Alternatively, drive via the HZMB and G55 expressway (around 4 hours).":
      "由香港出发：于西九龙乘高铁到肇庆东站（约1.5小时），再转出租车或巴士约1.5小时抵达罗定。或可经港珠澳大桥及G55高速自驾（约4小时）。",
    "Direct flights from Hong Kong (HKG) to Bangkok (BKK or DMK) take ~3 hours. From Bangkok, Pattaya is a 1.5-hour drive via private transfer (~700 THB) or bus (~150 THB). Total travel time door-to-door: about 6 hours.":
      "由香港（HKG）直飞曼谷（BKK 或 DMK）约需3小时。由曼谷前往芭提雅约1.5小时车程，可选私家车接送（约700泰铢）或巴士（约150泰铢）。全程约6小时。",

    // ============ Travel tips ============
    "Thai Baht (THB)": "泰铢 (THB)",
    "Chinese Yuan (CNY)": "人民币 (CNY)",

    "Thai (English in tourist areas)": "泰文（旅游区通英文）",
    "Thai (English widely spoken)": "泰文（英文普及）",
    "Mandarin / Cantonese": "普通话 / 广东话",
    "Mandarin & Cantonese": "普通话及广东话",
    "Mandarin (some Hainanese)": "普通话（部分海南话）",

    "30-day visa exemption for HK passport holders": "持香港特区护照可免签证入境30天",
    "Mainland Travel Permit for HK residents required": "香港居民需持回乡证入境",
    "HK residents enter via Home Return Permit / mainland travel permit": "香港居民可凭回乡证入境",
    "30-day visa-free entry for HK residents flying directly to Hainan": "香港居民直飞海南可享30天免签入境",

    "Type A/B/C, 220V": "A/B/C 型插头，220V",
    "Type A / I, 220V": "A/I 型插头，220V",
    "Type A/C/I, 220V": "A/C/I 型插头，220V",

    "Optional, 10% appreciated": "非必须，10%小费为佳",
    "Not customary": "当地不流行给小费",

    // ============ Accommodation types / distances ============
    Hotel: "酒店",
    Hostel: "青年旅舍",
    Resort: "度假村",
    Guesthouse: "民宿",

    "10 min from dropzone": "距跳伞场10分钟",
    "15 min from dropzone": "距跳伞场15分钟",
    "20 min from dropzone": "距跳伞场20分钟",
    "25 min from dropzone": "距跳伞场25分钟",
    "30 min from dropzone": "距跳伞场30分钟",
    "40 min from dropzone": "距跳伞场40分钟",
    "45 min from dropzone": "距跳伞场45分钟",
    "50 min from dropzone": "距跳伞场50分钟",
    "1 hr from dropzone": "距跳伞场约1小时",

    // Accommodations
    "Sheraton Zhuhai Hotel": "珠海华发喜来登酒店",
    "Luxury seafront hotel with elegant rooms, multiple restaurants, and full spa facilities.":
      "豪华海滨酒店，房间优雅、餐厅多元，并设有完善水疗设施。",
    "Zhuhai Holiday Inn Express": "珠海智选假日酒店",
    "Modern mid-range hotel close to the city center with great value and reliable service.":
      "邻近市中心的现代化中档酒店，性价比高、服务可靠。",
    "Gongbei Port Hostel": "拱北口岸青年旅舍",
    "Budget-friendly hostel near the Macau border — convenient for cross-border travelers.":
      "邻近澳门口岸的经济型旅舍，过境旅客最方便。",
    "137 Pillars House": "137 Pillars House 精品酒店",
    "Award-winning boutique luxury hotel blending colonial heritage with Lanna design. Pure indulgence.":
      "屡获殊荣的精品奢华酒店，融合殖民风情与兰纳设计，极致享受。",
    "Tamarind Village": "罗望子之家酒店",
    "Charming hotel inside the Old City walls, set around a 200-year-old tamarind tree.":
      "古城墙内的迷人酒店，围绕一棵200年树龄的罗望子树而建。",
    "Stamps Backpackers": "Stamps 背包客旅舍",
    "Friendly hostel in the heart of Old City with rooftop bar, pool, and easy access to night markets.":
      "位于古城核心的友善旅舍，设天台酒吧、泳池，步行即达夜市。",
    "Sheraton Huizhou Beach Resort": "惠州巽寮湾喜来登度假酒店",
    "Beachfront 5-star resort on Xunliao Bay with private beach, multiple pools and family suites.":
      "巽寮湾海滨五星级度假酒店，设私人沙滩、多个泳池及家庭套房。",
    "Holiday Inn Huizhou": "惠州假日酒店",
    "Reliable comfort in central Huizhou — modern rooms, good breakfast and easy taxi access to the dropzone.":
      "位于惠州市中心，房间现代、早餐丰富，前往跳伞场交通便利。",
    "Hanting Hotel": "汉庭酒店",
    "Clean, budget-friendly business hotel chain. Perfect for a one-night stay before or after your jump.":
      "洁净、实惠的连锁商务酒店，是跳伞前后一晚住宿的理想选择。",
    "Luoding International Hotel": "罗定国际酒店",
    "Modern 4-star hotel in central Luoding with comfortable rooms and on-site restaurants.":
      "位于罗定市中心的四星级现代酒店，房间舒适并设有餐厅。",
    "Yacheng Holiday Inn": "雅城假日酒店",
    "Mid-range hotel with clean rooms and local hospitality, popular with weekend travelers.":
      "中档酒店，房间整洁、待客热情，深受周末旅客欢迎。",
    "Luoding City Inn": "罗定城市旅馆",
    "Budget-friendly guesthouse with simple rooms — perfect for short overnight stays.":
      "经济实惠的民宿，房间简约，适合短暂过夜。",
    "Atlantis Sanya": "三亚亚特兰蒂斯",
    "Iconic ocean-themed mega-resort with the largest aquarium in Asia, water park and stunning suites.":
      "海洋主题标志性度假村，设有亚洲最大的水族馆、水上乐园及奢华套房。",
    "Mangrove Tree Resort World": "三亚海棠湾天房洲际度假酒店",
    "Sprawling beachfront resort on Yalong Bay with multiple themed buildings, pools and restaurants.":
      "亚龙湾海滨大型度假村，多栋主题建筑、泳池及餐厅一应俱全。",
    "Ji Hotel Sanya": "三亚全季酒店",
    "Modern, well-priced city hotel ideal for travellers prioritising convenience over luxury.":
      "现代化、高性价比的市区酒店，适合重视便利的旅客。",
    "Hilton Pattaya": "芭提雅希尔顿酒店",
    "Luxury beachfront hotel with infinity pool, panoramic Gulf of Thailand views, and easy access to Walking Street.":
      "海滨奢华酒店，设无边际泳池，可饱览泰国湾全景，邻近 Walking Street。",
    "Centara Mirage Beach Resort": "芭提雅 Centara Mirage 海滩度假村",
    "Family-friendly resort with lazy river, water park and direct beach access. Great for groups travelling together.":
      "亲子度假村，设漂流河、水上乐园，并可直达沙滩，适合团体出游。",
    "Lub d Pattaya": "芭提雅 Lub d 旅舍",
    "Modern social hostel with private rooms and dorms. Pool, bar, and a vibrant backpacker community.":
      "现代化社交型旅舍，提供私人房及多人房，设有泳池、酒吧及活泼的背包客社区。",

    // ============ Attraction categories / distances ============
    Culture: "文化",
    culture: "文化",
    Nature: "自然",
    nature: "自然",
    Beach: "海滩",
    beach: "海滩",
    Shopping: "购物",
    shopping: "购物",
    sightseeing: "观光",

    "1 hr": "1小时",
    "1.5 hr": "1.5小时",
    "15 min": "15分钟",
    "20 min": "20分钟",
    "25 min": "25分钟",
    "30 min": "30分钟",
    "35 min": "35分钟",
    "40 min": "40分钟",
    "45 min": "45分钟",
    "45 min by ferry": "渡轮约45分钟",

    // Attractions
    "Zhuhai Fisher Girl Statue": "珠海渔女像",
    "Iconic 8.7m granite statue overlooking Xianglu Bay — the symbol of Zhuhai.":
      "高8.7米的花岗岩雕像，俯瞰香炉湾，是珠海的标志。",
    "Lovers' Road": "情侣路",
    "Scenic 28km coastal road perfect for cycling, sunset walks, and seaside dining.":
      "全长28公里的海滨大道，适合骑行、看日落及海景用餐。",
    "Hengqin Chimelong Ocean Kingdom": "横琴长隆海洋王国",
    "One of the world's largest marine theme parks — great for families.":
      "全球最大型的海洋主题公园之一，亲子同游首选。",
    "New Yuan Ming Palace": "圆明新园",
    "A scaled replica of Beijing's Old Summer Palace with cultural performances.":
      "按比例重现北京圆明园的主题园区，并有文化表演。",
    "Doi Suthep Temple": "双龙寺",
    "Sacred mountaintop temple with golden chedi and panoramic views over Chiang Mai. A must-visit landmark.":
      "山顶神圣寺庙，金色佛塔配清迈全景，必访地标。",
    "Elephant Nature Park": "大象自然公园",
    "Ethical elephant sanctuary where you can feed and bathe rescued elephants. No riding — just love.":
      "道德大象保护区，可喂食及为获救大象洗澡，不骑乘、纯体验。",
    "Old City Temples": "古城寺庙群",
    "Walk the moated Old City to discover Wat Chedi Luang, Wat Phra Singh and dozens of historic temples.":
      "漫步护城河环绕的古城，探访柴迪隆寺、帕辛寺等数十座历史寺庙。",
    "Sunday Walking Street": "周日步行街",
    "Sprawling Sunday-evening market with handicrafts, street food and live music throughout the Old City.":
      "古城内绵延的周日夜市，手工艺、街头小食、现场音乐应有尽有。",
    "West Lake (Xihu)": "惠州西湖",
    "Scenic freshwater lake with pagodas, walking paths and pedal boats. A relaxing post-jump stroll.":
      "风景秀丽的淡水湖，有古塔、步道及脚踏船，是跳伞后放松的好去处。",
    "Xunliao Bay Beach": "巽寮湾",
    "One of Guangdong's cleanest beaches — golden sand, gentle surf and beachside seafood shacks.":
      "广东最洁净的海滩之一，金沙、轻浪，并有海边海鲜小店。",
    "Luofu Mountain": "罗浮山",
    "Sacred Taoist mountain with hiking trails, ancient temples and waterfalls. Great half-day excursion.":
      "道教圣山，设登山径、古寺与瀑布，半日游首选。",
    "Huizhou Old Town": "惠州古城",
    "Restored historic district with Qing-dynasty alleys, teahouses and craft shops. Best at dusk.":
      "修复后的历史街区，清代小巷、茶馆与工艺店林立，黄昏最美。",
    "Longwan Eco Tourist Area": "龙湾生态旅游区",
    "Lush valley with waterfalls, hiking trails, and natural pools — a refreshing escape after your jump.":
      "葱郁山谷，有瀑布、登山径及天然水池，是跳伞后消暑胜地。",
    "Jinyin Lake": "金银湖",
    "Scenic reservoir surrounded by mountains, great for boat rides and lakeside walks.":
      "群山环抱的水库，适合泛舟与湖畔漫步。",
    "Luoding Confucian Temple": "罗定文庙",
    "Historic Ming-dynasty temple showcasing classical Chinese architecture.":
      "明代古寺，展现中国古典建筑之美。",
    "Cangzu Mountain": "苍祖山",
    "Sacred mountain offering panoramic views and Taoist temple sites.":
      "圣山之一，可饱览全景，并有道教寺庙遗址。",
    "Yalong Bay": "亚龙湾",
    'Often called "the Oriental Hawaii" — 7km of pristine white sand and turquoise water. Snorkelling paradise.':
      "有「东方夏威夷」之称，7公里纯白沙滩、碧绿海水，浮潜天堂。",
    "Nanshan Buddhism Cultural Park": "南山佛教文化园",
    "Home to the 108-metre Guanyin statue rising from the sea — one of the tallest in the world.":
      "矗立海上的108米观音像所在地，是世界最高观音像之一。",
    "Wuzhizhou Island": "蜈支洲岛",
    "Heart-shaped island with diving, glass-bottom boats and some of China's clearest water.":
      "心形小岛，可潜水、乘玻璃底船，海水清澈度居全国之冠。",
    "Tianya Haijiao": "天涯海角",
    'Romantic "Edge of the Sky, Corner of the Sea" coastal park with iconic boulders and ocean views.':
      "浪漫的「天涯海角」海滨公园，有标志性巨石与壮阔海景。",
    "Sanctuary of Truth": "真理寺",
    "Stunning all-wooden temple sculpture, hand-carved and over 100m tall. A masterpiece of Thai craftsmanship.":
      "惊艳的全木雕寺庙，手工雕刻、高逾100米，泰国工艺代表作。",
    "Coral Island (Koh Larn)": "珊瑚岛（兰岛）",
    "Crystal-clear waters and white-sand beaches just off the coast. Perfect for snorkelling and chilling after your jump.":
      "离岸不远的水晶清澈海域与白沙滩，跳伞后浮潜放松首选。",

    // ============ Food ============
    "Wanzai Seafood": "湾仔海鲜",
    "Wanzai Seafood Street": "湾仔海鲜街",
    "Fresh seafood market with restaurants cooking your pick to order — try the steamed prawns and clams.":
      "新鲜海鲜市场，可即点即煮，推荐清蒸大虾及炒蚬。",
    "Doumen Cantonese Cuisine": "斗门粤菜",
    "Doumen District restaurants": "斗门区餐厅",
    "Traditional Cantonese village dishes featuring river fish and rural specialties.":
      "传统粤式乡村菜，以河鲜及农家风味为特色。",
    "Portuguese-style Egg Tarts": "葡式蛋挞",
    "Gongbei bakeries": "拱北烘焙店",
    "Macau-influenced egg tarts with a flaky crust and creamy custard center.":
      "受澳门影响的葡式蛋挞，酥脆挞皮配香滑蛋浆。",
    "Khao Soi": "金面咖喱（Khao Soi）",
    "Khao Soi Khun Yai": "Khao Soi Khun Yai 餐厅",
    "Northern Thailand's signature dish: creamy coconut curry noodles topped with crispy egg noodles.":
      "泰北招牌菜：椰香咖喱汤面配脆炸鸡蛋面。",
    "Sai Oua (Northern Sausage)": "Sai Oua 泰北香肠",
    "Warorot Market": "瓦洛洛市场",
    "Spicy grilled herb-and-pork sausage packed with lemongrass, kaffir lime and chilli. Pure Lanna flavour.":
      "辛辣烧烤香草猪肉肠，香茅、青柠叶与辣椒满载，兰纳风味十足。",
    "Sticky Rice with Mango": "芒果糯米饭",
    "Chang Phuak Night Market": "象门夜市",
    "Warm sticky rice and ripe Nam Dok Mai mango with coconut cream — refreshing after a hot day jumping.":
      "温热糯米配香甜芒果及椰浆，跳伞后最消暑。",
    "Hakka Salt-Baked Chicken": "客家盐焗鸡",
    "Lao Dong Jiang Restaurant": "老东江酒家",
    "Huizhou's most famous dish — whole chicken slow-baked in coarse salt for tender, fragrant meat.":
      "惠州名菜，整鸡以粗盐慢焗，肉嫩味香。",
    "Stuffed Tofu (Niang Dofu)": "酿豆腐",
    "Hakka Family Restaurant": "客家私房菜",
    "Silken tofu stuffed with seasoned pork, then braised in savoury broth. Comfort food at its finest.":
      "嫩豆腐酿入调味猪肉，再以鲜汤慢炖，极致暖心。",
    "East River Steamed Fish": "东江清蒸鱼",
    "Local seafood restaurants": "当地海鲜餐厅",
    "Fresh river fish steamed Cantonese-style with ginger, scallion and a splash of soy. Delicate and clean.":
      "新鲜河鱼以粤式清蒸，配姜葱及豉油，清雅鲜甜。",
    "Luoding Pickled Vegetables": "罗定泡菜",
    "Local Cantonese restaurants": "当地粤菜馆",
    "A signature Luoding specialty — fragrant, tangy pickles served with rice or stir-fries.":
      "罗定招牌特产，香酸开胃，伴饭或入菜皆宜。",
    "Roasted Goose": "烧鹅",
    "Yacheng District eateries": "雅城区餐厅",
    "Cantonese-style roasted goose with crispy skin and tender meat.": "粤式烧鹅，皮脆肉嫩。",
    "Rice Noodle Rolls (Cheung Fun)": "肠粉",
    "Morning markets": "早市",
    "Silky steamed rice rolls with sweet soy sauce — a classic local breakfast.":
      "嫩滑米肠配甜豉油，地道经典早餐。",
    "Wenchang Chicken": "文昌鸡",
    "Sichuan & Hainanese Restaurants": "川海菜馆",
    "Hainan's most famous dish — free-range chicken poached to silky perfection, served with ginger-scallion oil.":
      "海南名菜，走地鸡浸煮至嫩滑，配姜葱油。",
    "Hele Crab": "和乐蟹",
    "Local seafood markets": "当地海鲜市场",
    "Sweet, fatty crab from Wanning prized across China. Steamed simply to let the flavour shine.":
      "来自万宁、蜚声全国的肥美甜蟹，清蒸最能突显原味。",
    "Coconut Rice": "椰子饭",
    "Sanya street stalls": "三亚街头小摊",
    "Fragrant rice steamed inside a young coconut with chicken or seafood. Tropical comfort food.":
      "于嫩椰壳内蒸煮的香米饭，配鸡肉或海鲜，热带风味。",
    "Som Tam (Papaya Salad)": "Som Tam 青木瓜沙拉",
    "Mum Aroi Restaurant": "Mum Aroi 餐厅",
    "Spicy, tangy green papaya salad with lime, chilli and peanuts. The quintessential Thai street food.":
      "酸辣青木瓜沙拉，配青柠、辣椒及花生，泰国街头经典。",
    "Tom Yum Goong": "冬荫功汤",
    "Sketch Restaurant": "Sketch Restaurant 餐厅",
    "Hot and sour prawn soup with lemongrass, galangal and lime leaves. Fragrant and unforgettable.":
      "酸辣大虾汤，配香茅、南姜及青柠叶，香气难忘。",
    "Mango Sticky Rice": "芒果糯米饭",
    "Naklua Market": "Naklua 市场",
    "Sweet sticky rice paired with ripe mango and coconut cream. Thailand's most beloved dessert.":
      "香甜糯米配熟芒果及椰浆，泰国最受欢迎的甜品。",
  },
};
