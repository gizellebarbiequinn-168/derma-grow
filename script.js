document.addEventListener("DOMContentLoaded", () => {
    // --- GLOBAL STATE ENGINE ---
    let userSkinProfile = {
        baseType: "Normal",     
        reactivity: "Resilient", 
        acneProne: false,
        dehydrated: false,
        isCalculated: false
    };

    // Global Multi-Currency Engine (~195 World Currencies)
    const currencyMap = {
        "AED": { locale: "ar-AE", symbol: "AED ", maxBudget: 110, step: 5, defaultVal: 55 },
        "AFN": { locale: "ps-AF", symbol: "AFN ", maxBudget: 2200, step: 50, defaultVal: 1100 },
        "ALL": { locale: "sq-AL", symbol: "ALL ", maxBudget: 2800, step: 100, defaultVal: 1400 },
        "AMD": { locale: "hy-AM", symbol: "AMD ", maxBudget: 12000, step: 500, defaultVal: 6000 },
        "ANG": { locale: "nl-CW", symbol: "NAƒ ", maxBudget: 55, step: 1, defaultVal: 25 },
        "AOA": { locale: "pt-AO", symbol: "Kz ", maxBudget: 27000, step: 1000, defaultVal: 13500 },
        "ARS": { locale: "es-AR", symbol: "ARS$ ", maxBudget: 30000, step: 1000, defaultVal: 15000 },
        "AUD": { locale: "en-AU", symbol: "A$", maxBudget: 45, step: 1, defaultVal: 20 },
        "AWG": { locale: "nl-AW", symbol: "Afl. ", maxBudget: 55, step: 1, defaultVal: 25 },
        "AZN": { locale: "az-AZ", symbol: "₼ ", maxBudget: 50, step: 2, defaultVal: 25 },
        "BAM": { locale: "bs-BA", symbol: "KM ", maxBudget: 55, step: 2, defaultVal: 25 },
        "BBD": { locale: "en-BB", symbol: "Bds$ ", maxBudget: 60, step: 2, defaultVal: 30 },
        "BDT": { locale: "bn-BD", symbol: "৳ ", maxBudget: 3500, step: 100, defaultVal: 1750 },
        "BGN": { locale: "bg-BG", symbol: "лв. ", maxBudget: 55, step: 2, defaultVal: 25 },
        "BHD": { locale: "ar-BH", symbol: "BD ", maxBudget: 12, step: 1, defaultVal: 6 },
        "BIF": { locale: "fr-BI", symbol: "FBu ", maxBudget: 85000, step: 2000, defaultVal: 42000 },
        "BMD": { locale: "en-BM", symbol: "$ ", maxBudget: 30, step: 1, defaultVal: 15 },
        "BND": { locale: "ms-BN", symbol: "B$ ", maxBudget: 40, step: 1, defaultVal: 20 },
        "BOB": { locale: "es-BO", symbol: "Bs. ", maxBudget: 200, step: 10, defaultVal: 100 },
        "BRL": { locale: "pt-BR", symbol: "R$ ", maxBudget: 150, step: 5, defaultVal: 75 },
        "BSD": { locale: "en-BS", symbol: "B$ ", maxBudget: 30, step: 1, defaultVal: 15 },
        "BTN": { locale: "dz-BT", symbol: "Nu. ", maxBudget: 2500, step: 100, defaultVal: 1250 },
        "BWP": { locale: "en-BW", symbol: "P ", maxBudget: 400, step: 10, defaultVal: 200 },
        "BYN": { locale: "be-BY", symbol: "Br ", maxBudget: 100, step: 5, defaultVal: 50 },
        "BZD": { locale: "en-BZ", symbol: "BZ$ ", maxBudget: 60, step: 2, defaultVal: 30 },
        "CAD": { locale: "en-CA", symbol: "CA$ ", maxBudget: 40, step: 1, defaultVal: 20 },
        "CDF": { locale: "fr-CD", symbol: "FC ", maxBudget: 85000, step: 2000, defaultVal: 42000 },
        "CHF": { locale: "de-CH", symbol: "CHF ", maxBudget: 28, step: 1, defaultVal: 14 },
        "CLP": { locale: "es-CL", symbol: "CLP$ ", maxBudget: 28000, step: 1000, defaultVal: 14000 },
        "CNY": { locale: "zh-CN", symbol: "¥ ", maxBudget: 220, step: 10, defaultVal: 110 },
        "COP": { locale: "es-CO", symbol: "COP$ ", maxBudget: 120000, step: 5000, defaultVal: 60000 },
        "CRC": { locale: "es-CR", symbol: "₡ ", maxBudget: 15000, step: 500, defaultVal: 7500 },
        "CUP": { locale: "es-CU", symbol: "$MN ", maxBudget: 720, step: 20, defaultVal: 360 },
        "CVE": { locale: "pt-CV", symbol: "Esc ", maxBudget: 3000, step: 100, defaultVal: 1500 },
        "CZK": { locale: "cs-CZ", symbol: "Kč ", maxBudget: 700, step: 25, defaultVal: 350 },
        "DJF": { locale: "fr-DJ", symbol: "Fdj ", maxBudget: 5300, step: 200, defaultVal: 2650 },
        "DKK": { locale: "da-DK", symbol: "kr. ", maxBudget: 210, step: 10, defaultVal: 105 },
        "DOP": { locale: "es-DO", symbol: "RD$ ", maxBudget: 1800, step: 50, defaultVal: 900 },
        "DZD": { locale: "ar-DZ", symbol: "DA ", maxBudget: 4000, step: 100, defaultVal: 2000 },
        "EGP": { locale: "ar-EG", symbol: "E£ ", maxBudget: 1400, step: 50, defaultVal: 700 },
        "ERN": { locale: "ti-ER", symbol: "Nfk ", maxBudget: 450, step: 20, defaultVal: 225 },
        "ETB": { locale: "am-ET", symbol: "Br ", maxBudget: 1700, step: 50, defaultVal: 850 },
        "EUR": { locale: "de-DE", symbol: "€", maxBudget: 30, step: 1, defaultVal: 15 },
        "FJD": { locale: "en-FJ", symbol: "FJ$ ", maxBudget: 65, step: 2, defaultVal: 32 },
        "FKP": { locale: "en-FK", symbol: "£ ", maxBudget: 25, step: 1, defaultVal: 12 },
        "GBP": { locale: "en-GB", symbol: "£", maxBudget: 25, step: 1, defaultVal: 12 },
        "GEL": { locale: "ka-GE", symbol: "₾ ", maxBudget: 80, step: 5, defaultVal: 40 },
        "GHS": { locale: "en-GH", symbol: "GH₵ ", maxBudget: 420, step: 20, defaultVal: 210 },
        "GIP": { locale: "en-GI", symbol: "£ ", maxBudget: 25, step: 1, defaultVal: 12 },
        "GMD": { locale: "en-GM", symbol: "D ", maxBudget: 2000, step: 50, defaultVal: 1000 },
        "GNF": { locale: "fr-GN", symbol: "FG ", maxBudget: 250000, step: 10000, defaultVal: 125000 },
        "GTQ": { locale: "es-GT", symbol: "Q ", maxBudget: 230, step: 10, defaultVal: 115 },
        "GYD": { locale: "en-GY", symbol: "G$ ", maxBudget: 6200, step: 200, defaultVal: 3100 },
        "HKD": { locale: "zh-HK", symbol: "HK$ ", maxBudget: 235, step: 10, defaultVal: 115 },
        "HNL": { locale: "es-HN", symbol: "L ", maxBudget: 740, step: 20, defaultVal: 370 },
        "HRK": { locale: "hr-HR", symbol: "€ ", maxBudget: 30, step: 1, defaultVal: 15 },
        "HTG": { locale: "fr-HT", symbol: "G ", maxBudget: 4000, step: 100, defaultVal: 2000 },
        "HUF": { locale: "hu-HU", symbol: "Ft ", maxBudget: 11000, step: 500, defaultVal: 5500 },
        "IDR": { locale: "id-ID", symbol: "Rp ", maxBudget: 300000, step: 10000, defaultVal: 150000 },
        "ILS": { locale: "he-IL", symbol: "₪ ", maxBudget: 110, step: 5, defaultVal: 55 },
        "INR": { locale: "hi-IN", symbol: "₹ ", maxBudget: 2500, step: 100, defaultVal: 1250 },
        "IQD": { locale: "ar-IQ", symbol: "IQD ", maxBudget: 39000, step: 1000, defaultVal: 19500 },
        "IRR": { locale: "fa-IR", symbol: "IRR ", maxBudget: 1250000, step: 50000, defaultVal: 625000 },
        "ISK": { locale: "is-IS", symbol: "kr. ", maxBudget: 4100, step: 100, defaultVal: 2050 },
        "JMD": { locale: "en-JM", symbol: "J$ ", maxBudget: 4600, step: 200, defaultVal: 2300 },
        "JOD": { locale: "ar-JO", symbol: "JD ", maxBudget: 21, step: 1, defaultVal: 10 },
        "JPY": { locale: "ja-JP", symbol: "¥ ", maxBudget: 4500, step: 200, defaultVal: 2250 },
        "KES": { locale: "sw-KE", symbol: "KSh ", maxBudget: 3900, step: 100, defaultVal: 1950 },
        "KGS": { locale: "ky-KG", symbol: "сом ", maxBudget: 2600, step: 100, defaultVal: 1300 },
        "KHR": { locale: "km-KH", symbol: "៛ ", maxBudget: 120000, step: 5000, defaultVal: 60000 },
        "KMF": { locale: "fr-KM", symbol: "CF ", maxBudget: 13500, step: 500, defaultVal: 6750 },
        "KPW": { locale: "ko-KP", symbol: "₩ ", maxBudget: 27000, step: 1000, defaultVal: 13500 },
        "KRW": { locale: "ko-KR", symbol: "₩ ", maxBudget: 40000, step: 1000, defaultVal: 20000 },
        "KWD": { locale: "ar-KW", symbol: "KD ", maxBudget: 9, step: 1, defaultVal: 4 },
        "KYD": { locale: "en-KY", symbol: "CI$ ", maxBudget: 25, step: 1, defaultVal: 12 },
        "KZT": { locale: "kk-KZ", symbol: "₸ ", maxBudget: 14000, step: 500, defaultVal: 7000 },
        "LAK": { locale: "lo-LA", symbol: "₭ ", maxBudget: 630000, step: 20000, defaultVal: 315000 },
        "LBP": { locale: "ar-LB", symbol: "L£ ", maxBudget: 2700000, step: 100000, defaultVal: 1350000 },
        "LKR": { locale: "si-LK", symbol: "Rs ", maxBudget: 9000, step: 500, defaultVal: 4500 },
        "LRD": { locale: "en-LR", symbol: "L$ ", maxBudget: 5800, step: 200, defaultVal: 2900 },
        "LSL": { locale: "st-LS", symbol: "L ", maxBudget: 550, step: 25, defaultVal: 275 },
        "LYD": { locale: "ar-LY", symbol: "LD ", maxBudget: 145, step: 5, defaultVal: 72 },
        "MAD": { locale: "ar-MA", symbol: "MAD ", maxBudget: 300, step: 10, defaultVal: 150 },
        "MDL": { locale: "ro-MD", symbol: "L ", maxBudget: 530, step: 20, defaultVal: 265 },
        "MGA": { locale: "mg-MG", symbol: "Ar ", maxBudget: 135000, step: 5000, defaultVal: 67500 },
        "MKD": { locale: "mk-MK", symbol: "ден ", maxBudget: 1700, step: 50, defaultVal: 850 },
        "MMK": { locale: "my-MM", symbol: "Ks ", maxBudget: 63000, step: 2000, defaultVal: 31500 },
        "MNT": { locale: "mn-MN", symbol: "₮ ", maxBudget: 100000, step: 5000, defaultVal: 50000 },
        "MOP": { locale: "zh-MO", symbol: "MOP$ ", maxBudget: 240, step: 10, defaultVal: 120 },
        "MRU": { locale: "ar-MR", symbol: "UM ", maxBudget: 1200, step: 50, defaultVal: 600 },
        "MUR": { locale: "en-MU", symbol: "Rs ", maxBudget: 1380, step: 50, defaultVal: 690 },
        "MVR": { locale: "dv-MV", symbol: "Rf ", maxBudget: 460, step: 20, defaultVal: 230 },
        "MWK": { locale: "ny-MW", symbol: "MK ", maxBudget: 50000, step: 2000, defaultVal: 25000 },
        "MXN": { locale: "es-MX", symbol: "Mex$ ", maxBudget: 550, step: 25, defaultVal: 275 },
        "MYR": { locale: "ms-MY", symbol: "RM ", maxBudget: 135, step: 5, defaultVal: 65 },
        "MZN": { locale: "pt-MZ", symbol: "MT ", maxBudget: 1900, step: 50, defaultVal: 950 },
        "NAD": { locale: "en-NA", symbol: "N$ ", maxBudget: 550, step: 25, defaultVal: 275 },
        "NGN": { locale: "ha-NG", symbol: "₦ ", maxBudget: 45000, step: 2000, defaultVal: 22500 },
        "NIO": { locale: "es-NI", symbol: "C$ ", maxBudget: 1100, step: 50, defaultVal: 550 },
        "NOK": { locale: "nb-NO", symbol: "kr ", maxBudget: 320, step: 10, defaultVal: 160 },
        "NPR": { locale: "ne-NP", symbol: "Rs ", maxBudget: 4000, step: 100, defaultVal: 2000 },
        "NZD": { locale: "en-NZ", symbol: "NZ$ ", maxBudget: 50, step: 2, defaultVal: 25 },
        "OMR": { locale: "ar-OM", symbol: "OMR ", maxBudget: 11, step: 1, defaultVal: 5 },
        "PAB": { locale: "es-PA", symbol: "B/. ", maxBudget: 30, step: 1, defaultVal: 15 },
        "PEN": { locale: "es-PE", symbol: "S/ ", maxBudget: 110, step: 5, defaultVal: 55 },
        "PGK": { locale: "en-PG", symbol: "K ", maxBudget: 115, step: 5, defaultVal: 57 },
        "PHP": { locale: "en-PH", symbol: "₱ ", maxBudget: 1700, step: 50, defaultVal: 850 },
        "PKR": { locale: "ur-PK", symbol: "Rs ", maxBudget: 8300, step: 200, defaultVal: 4150 },
        "PLN": { locale: "pl-PL", symbol: "zł ", maxBudget: 120, step: 5, defaultVal: 60 },
        "PYG": { locale: "es-PY", symbol: "₲ ", maxBudget: 220000, step: 10000, defaultVal: 110000 },
        "QAR": { locale: "ar-QA", symbol: "QR ", maxBudget: 110, step: 5, defaultVal: 55 },
        "RON": { locale: "ro-RO", symbol: "lei ", maxBudget: 135, step: 5, defaultVal: 67 },
        "RSD": { locale: "sr-RS", symbol: "дин. ", maxBudget: 3200, step: 100, defaultVal: 1600 },
        "RUB": { locale: "ru-RU", symbol: "₽ ", maxBudget: 2800, step: 100, defaultVal: 1400 },
        "RWF": { locale: "rw-RW", symbol: "FRw ", maxBudget: 38000, step: 1000, defaultVal: 19000 },
        "SAR": { locale: "ar-SA", symbol: "SR ", maxBudget: 112, step: 5, defaultVal: 56 },
        "SBD": { locale: "en-SB", symbol: "SI$ ", maxBudget: 250, step: 10, defaultVal: 125 },
        "SCR": { locale: "fr-SC", symbol: "SR ", maxBudget: 400, step: 20, defaultVal: 200 },
        "SDG": { locale: "ar-SD", symbol: "SDG ", maxBudget: 18000, step: 500, defaultVal: 9000 },
        "SEK": { locale: "sv-SE", symbol: "kr ", maxBudget: 310, step: 10, defaultVal: 155 },
        "SGD": { locale: "en-SG", symbol: "S$", maxBudget: 40, step: 1, defaultVal: 20 },
        "SHP": { locale: "en-SH", symbol: "£ ", maxBudget: 25, step: 1, defaultVal: 12 },
        "SLE": { locale: "en-SL", symbol: "Le ", maxBudget: 650, step: 25, defaultVal: 325 },
        "SOS": { locale: "so-SO", symbol: "Ssh ", maxBudget: 17000, step: 500, defaultVal: 8500 },
        "SRD": { locale: "nl-SR", symbol: "SRD$ ", maxBudget: 1000, step: 50, defaultVal: 500 },
        "SSP": { locale: "en-SS", symbol: "SSP£ ", maxBudget: 39000, step: 1000, defaultVal: 19500 },
        "STN": { locale: "pt-ST", symbol: "Db ", maxBudget: 670, step: 25, defaultVal: 335 },
        "SYP": { locale: "ar-SY", symbol: "LS ", maxBudget: 380000, step: 10000, defaultVal: 190000 },
        "SZL": { locale: "ss-SZ", symbol: "E ", maxBudget: 550, step: 25, defaultVal: 275 },
        "THB": { locale: "th-TH", symbol: "฿ ", maxBudget: 1000, step: 50, defaultVal: 500 },
        "TJS": { locale: "tg-TJ", symbol: "SM ", maxBudget: 320, step: 10, defaultVal: 160 },
        "TMT": { locale: "tk-TM", symbol: "m ", maxBudget: 105, step: 5, defaultVal: 50 },
        "TND": { locale: "ar-TN", symbol: "DT ", maxBudget: 90, step: 5, defaultVal: 45 },
        "TOP": { locale: "to-TO", symbol: "T$ ", maxBudget: 70, step: 2, defaultVal: 35 },
        "TRY": { locale: "tr-TR", symbol: "₺ ", maxBudget: 1000, step: 50, defaultVal: 500 },
        "TTD": { locale: "en-TT", symbol: "TT$ ", maxBudget: 200, step: 10, defaultVal: 100 },
        "TWD": { locale: "zh-TW", symbol: "NT$ ", maxBudget: 950, step: 50, defaultVal: 475 },
        "TZS": { locale: "sw-TZ", symbol: "TSh ", maxBudget: 78000, step: 2000, defaultVal: 39000 },
        "UAH": { locale: "uk-UA", symbol: "₴ ", maxBudget: 1200, step: 50, defaultVal: 600 },
        "UGX": { locale: "sw-UG", symbol: "USh ", maxBudget: 110000, step: 5000, defaultVal: 55000 },
        "USD": { locale: "en-US", symbol: "$", maxBudget: 30, step: 1, defaultVal: 15 },
        "UYU": { locale: "es-UY", symbol: "$U ", maxBudget: 1200, step: 50, defaultVal: 600 },
        "UZS": { locale: "uz-UZ", symbol: "so'm ", maxBudget: 380000, step: 10000, defaultVal: 190000 },
        "VES": { locale: "es-VE", symbol: "Bs.S ", maxBudget: 1100, step: 50, defaultVal: 550 },
        "VND": { locale: "vi-VN", symbol: "₫ ", maxBudget: 750000, step: 25000, defaultVal: 375000 },
        "VUV": { locale: "bi-VU", symbol: "VT ", maxBudget: 3500, step: 100, defaultVal: 1750 },
        "WST": { locale: "sm-WS", symbol: "WS$ ", maxBudget: 80, step: 5, defaultVal: 40 },
        "XAF": { locale: "fr-CM", symbol: "FCFA ", maxBudget: 18000, step: 500, defaultVal: 9000 },
        "XCD": { locale: "en-AG", symbol: "EC$ ", maxBudget: 80, step: 5, defaultVal: 40 },
        "XOF": { locale: "fr-SN", symbol: "CFA ", maxBudget: 18000, step: 500, defaultVal: 9000 },
        "XPF": { locale: "fr-PF", symbol: "CFP ", maxBudget: 3300, step: 100, defaultVal: 1650 },
        "YER": { locale: "ar-YE", symbol: "YR ", maxBudget: 7500, step: 250, defaultVal: 3750 },
        "ZAR": { locale: "af-ZA", symbol: "R ", maxBudget: 550, step: 25, defaultVal: 275 },
        "ZMW": { locale: "en-ZM", symbol: "ZK ", maxBudget: 780, step: 20, defaultVal: 390 },
        "ZWL": { locale: "en-ZW", symbol: "Z$ ", maxBudget: 9600, step: 500, defaultVal: 4800 }
    };
    let currentCurrency = "IDR";

    // --- NAVIGATION ROUTING ---
    const navDashboard = document.getElementById('navDashboard');
    const navQuiz = document.getElementById('navQuiz');
    const navAi = document.getElementById('navAi');
    const navLearn = document.getElementById('navLearn');
    const navRecommendations = document.getElementById('navRecommendations');
    const navDictionary = document.getElementById('navDictionary');
    const navProfile = document.getElementById('navProfile');

    const trackerCard = document.getElementById('trackerCard');
    const quizSection = document.getElementById('quizSection');
    const aiSection = document.getElementById('aiSection');
    const learnSection = document.getElementById('learnSection');
    const recommendationsSection = document.getElementById('recommendationsSection');
    const dictionarySection = document.getElementById('dictionarySection');
    const profileSection = document.getElementById('profileSection');

    function clearActiveTabs() {
        [navDashboard, navQuiz, navAi, navLearn, navRecommendations, navDictionary, navProfile].forEach(el => { if(el) el.classList.remove('active'); });
        [trackerCard, quizSection, aiSection, learnSection, recommendationsSection, dictionarySection, profileSection].forEach(el => { if(el) el.classList.add('hidden'); });
    }

    if (navDashboard) {
        navDashboard.addEventListener('click', (e) => {
            e.preventDefault(); clearActiveTabs();
            navDashboard.classList.add('active');
            if (trackerCard) trackerCard.classList.remove('hidden');
            calculateSkinTrajectory();
        });
    }
    if (navQuiz) {
        navQuiz.addEventListener('click', (e) => {
            e.preventDefault(); clearActiveTabs();
            navQuiz.classList.add('active');
            if (quizSection) quizSection.classList.remove('hidden');
            initializeQuizEngine();
        });
    }
    if (navAi) {
        navAi.addEventListener('click', (e) => {
            e.preventDefault(); clearActiveTabs();
            navAi.classList.add('active');
            if (aiSection) aiSection.classList.remove('hidden');
        });
    }
    if (navLearn) {
        navLearn.addEventListener('click', (e) => {
            e.preventDefault(); clearActiveTabs();
            navLearn.classList.add('active');
            if (learnSection) learnSection.classList.remove('hidden');
            renderCards("all");
        });
    }
    if (navRecommendations) {
        navRecommendations.addEventListener('click', (e) => {
            e.preventDefault(); clearActiveTabs();
            navRecommendations.classList.add('active');
            if (recommendationsSection) recommendationsSection.classList.remove('hidden');
            renderPeerRegistry("all");
        });
    }
    if (navDictionary) {
        navDictionary.addEventListener('click', (e) => {
            e.preventDefault(); clearActiveTabs();
            navDictionary.classList.add('active');
            if (dictionarySection) dictionarySection.classList.remove('hidden');
            renderDictionaryList("");
        });
    }
    if (navProfile) {
        navProfile.addEventListener('click', (e) => {
            e.preventDefault(); clearActiveTabs();
            navProfile.classList.add('active');
            if (profileSection) profileSection.classList.remove('hidden');
        });
    }

    // --- DARK MODE TOGGLE ---
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        const savedTheme = localStorage.getItem('dermaTheme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggleBtn.textContent = '☀️';
        }

        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('dermaTheme', 'light');
                themeToggleBtn.textContent = '🌙';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('dermaTheme', 'dark');
                themeToggleBtn.textContent = '☀️';
            }
        });
    }

    // --- TRACK MATRIX SUMMARY METRICS ---
    function updateHonestLocalMetrics(finalScore, trendsAvoidedCount, activeHarmfulTrends) {
        const itemsSavedCount = document.getElementById('itemsSavedCount');
        const optimizationDelta = document.getElementById('optimizationDelta');
        const summaryLabel = document.getElementById('impactSummaryText');
        const config = currencyMap[currentCurrency] || currencyMap["IDR"];

        if (itemsSavedCount) itemsSavedCount.textContent = trendsAvoidedCount;

        if (optimizationDelta) {
            optimizationDelta.textContent = `${finalScore}%`;
            optimizationDelta.style.color = finalScore < 50 ? "#d9534f" : "var(--brand-accent)";
        }

        if (summaryLabel) {
            if (activeHarmfulTrends > 0) {
                summaryLabel.textContent = `⚠️ Active Irritant Warning: You have checked ${activeHarmfulTrends} product(s) that can strip your skin barrier! Consider pausing them to allow recovery.`;
                summaryLabel.style.backgroundColor = "var(--status-alert-bg)";
                summaryLabel.style.color = "var(--status-alert-text)";
            } else if (trendsAvoidedCount > 0) {
                let estimatedSavings = trendsAvoidedCount * (config.maxBudget * 0.25);
                let savingsText = ` saving approximately ${formatGlobalCurrency(estimatedSavings, currentCurrency)}`;
                summaryLabel.textContent = `🎉 Barrier Protected: By leaving ${trendsAvoidedCount} harsh trend(s) unchecked, you protect your skin barrier${savingsText}!`;
                summaryLabel.style.backgroundColor = "rgba(89, 145, 47, 0.1)";
                summaryLabel.style.color = "var(--brand-primary)";
            } else {
                summaryLabel.textContent = `💡 Select the items you use daily above to view your barrier health trajectory.`;
                summaryLabel.style.backgroundColor = "var(--bg-main)";
                summaryLabel.style.color = "var(--color-text-main)";
            }
        }
    }

    // --- ROUTINE ENGINE LOGIC ---
    const budgetSlider = document.getElementById('budgetSlider');
    const budgetValue = document.getElementById('budgetValue');
    const reportContent = document.getElementById('reportContent');
    const protocolBox = document.getElementById('protocolBox');
    const amRoutineList = document.getElementById('amRoutineList');
    const pmRoutineList = document.getElementById('pmRoutineList');

    const selectors = ['chk-moisturizer', 'chk-cleanser', 'chk-sunscreen', 'chk-toner', 'chk-niacinamide', 'chk-actives', 'chk-lemon', 'chk-scrubs'];
    let dermaChart = null;

    function formatGlobalCurrency(amount, currencyCode) {
        if (!currencyCode || !currencyMap[currencyCode]) return `Rp ${amount}`;
        const config = currencyMap[currencyCode];
        return new Intl.NumberFormat(config.locale, {
            style: 'currency',
            currency: currencyCode,
            maximumFractionDigits: 0
        }).format(amount);
    }

    function calculateSkinTrajectory() {
        if (!budgetSlider) return;
        
        const budget = parseInt(budgetSlider.value);
        if (budgetValue) {
            budgetValue.textContent = formatGlobalCurrency(budget, currentCurrency);
        }

        const state = {};
        selectors.forEach(id => { 
            const el = document.getElementById(id); 
            state[id] = el ? el.checked : false; 
        });

        let activeHarmfulTrends = 0;
        let trendsAvoidedCount = 0;

        // Checked bad products = Active Irritants
        if (state['chk-lemon']) activeHarmfulTrends++;
        if (state['chk-scrubs']) activeHarmfulTrends++;

        // Unchecked bad products = Trends Avoided
        if (!state['chk-lemon']) trendsAvoidedCount++;
        if (!state['chk-scrubs']) trendsAvoidedCount++;

        const labels = ["Day 1", "Day 3", "Day 5", "Day 7", "Day 10", "Day 12", "Day 14"];
        let metrics = [50, 50, 50, 50, 50, 50, 50];
        let currentEvaluatedScore = 50;
        
        let amSteps = [];
        let pmSteps = [];
        let warningNote = "";

        if (state['chk-cleanser']) {
            pmSteps.push("Wash gently using your Low-pH Cleanser.");
        } else {
            pmSteps.push("Rinse face thoroughly with lukewarm water.");
        }

        if (state['chk-moisturizer']) {
            amSteps.push("Apply a thin layer of basic moisturizer / glycerin.");
            pmSteps.push("Apply moisturizer to damp skin after washing.");
        }

        if (state['chk-sunscreen']) {
            amSteps.push("Apply Broad-Spectrum Sunscreen (essential daily UV shield).");
        }

        if (state['chk-toner']) {
            amSteps.unshift("Optional: Pat gentle hydrating toner onto damp skin.");
        }

        if (state['chk-niacinamide']) {
            pmSteps.splice(1, 0, "Optional: Apply Niacinamide serum before moisturizer.");
        }

        if (state['chk-lemon'] || state['chk-scrubs']) {
            currentEvaluatedScore = Math.max(15, 50 - (activeHarmfulTrends * 20));
            metrics = [50, 40, 30, 22, 18, 16, currentEvaluatedScore];
            warningNote = "⚠️ IRRITANT ALERT: Lemon juice or physical scrubs introduce extreme acid or friction that can tear delicate surface skin. Stop using these items to let your skin barrier heal.";
        } else if (state['chk-moisturizer'] && state['chk-cleanser'] && state['chk-sunscreen']) {
            currentEvaluatedScore = 92;
            metrics = [50, 62, 72, 82, 88, 90, 92];
            warningNote = "✅ COMPLETE BASELINE ROUTINE: Gentle cleansing, hydration, and sunscreen work together for optimal barrier protection.";
        } else if (state['chk-moisturizer'] && state['chk-cleanser']) {
            currentEvaluatedScore = 75;
            metrics = [50, 58, 64, 70, 72, 74, 75];
            warningNote = "👍 GOOD MINIMALIST BASELINE: Essential cleanser and moisturizer loop configured. Add an affordable sunscreen to complete protection.";
        } else {
            currentEvaluatedScore = 50;
            metrics = [50, 50, 50, 50, 50, 50, 50];
            warningNote = "Select the products you currently use daily to generate your AM/PM routine guide.";
        }

        if (amSteps.length === 0) amSteps.push("Rinse face with clean lukewarm water.");
        if (pmSteps.length === 0) pmSteps.push("Rinse face thoroughly with clean water.");

        if (protocolBox) protocolBox.classList.remove('hidden');
        if (reportContent) {
            reportContent.textContent = warningNote;
            reportContent.style.borderColor = activeHarmfulTrends > 0 ? "var(--status-alert-border)" : "var(--border-subtle)";
        }
        
        if (amRoutineList) amRoutineList.innerHTML = amSteps.map(s => `<li>${s}</li>`).join('');
        if (pmRoutineList) pmRoutineList.innerHTML = pmSteps.map(s => `<li>${s}</li>`).join('');

        renderVisualThresholdChart(labels, metrics);
        updateHonestLocalMetrics(currentEvaluatedScore, trendsAvoidedCount, activeHarmfulTrends);

        // Telemetry logger connection
        const activeProducts = selectors.filter(id => document.getElementById(id)?.checked).join(', ');
        logRoutineToSheet(budget, trendsAvoidedCount, activeProducts || "None");
    }

    function renderVisualThresholdChart(labels, metrics) {
        const chartCanvas = document.getElementById('dermaChart');
        if (!chartCanvas) return;
        const ctx = chartCanvas.getContext('2d');
        if (dermaChart) { dermaChart.destroy(); }
        dermaChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{ 
                    label: 'Barrier Health Index (%)', 
                    data: metrics, 
                    borderColor: '#59912f', 
                    borderWidth: 2.5, 
                    pointBackgroundColor: '#c49a45', 
                    tension: 0.2, 
                    fill: false 
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }
        });
    }

    const currencySelector = document.getElementById('currencySelector');
    if (currencySelector && budgetSlider) {
        currencySelector.addEventListener('change', (e) => {
            currentCurrency = e.target.value;
            const config = currencyMap[currentCurrency] || currencyMap["IDR"];
            
            budgetSlider.max = config.maxBudget;
            budgetSlider.step = config.step;
            budgetSlider.value = config.defaultVal;
            
            calculateSkinTrajectory();
        });
    }

    if (budgetSlider) budgetSlider.addEventListener('input', calculateSkinTrajectory);
    selectors.forEach(id => { 
        const el = document.getElementById(id); 
        if (el) el.addEventListener('change', calculateSkinTrajectory);
    });

    const starterPackBtn = document.getElementById('starterPackBtn');
    if (starterPackBtn) {
        starterPackBtn.addEventListener('click', function() {
            const chkCleanser = document.getElementById('chk-cleanser');
            const chkMoisturizer = document.getElementById('chk-moisturizer');
            const chkSunscreen = document.getElementById('chk-sunscreen');
            
            if (chkCleanser) chkCleanser.checked = true;
            if (chkMoisturizer) chkMoisturizer.checked = true;
            if (chkSunscreen) chkSunscreen.checked = true;
            
            calculateSkinTrajectory();
            this.innerText = "✅ Starter Routine Applied!";
            setTimeout(() => { this.innerText = "✨ Apply 3-Step Starter Routine"; }, 2000);
        });
    }

    // --- SIMPLIFIED SKIN TYPE QUIZ ENGINE ---
    const quizData = [
        { q: "1. How does your face feel 1 hour after washing with plain water?", a: [ { text: "Tight, dry, or flaky all over", type: "base:Dry" }, { text: "Shiny, greasy, or slick all over", type: "base:Oily" }, { text: "Oily on forehead/nose, but dry on cheeks", type: "base:Combination" }, { text: "Comfortable and smooth", type: "base:Normal" } ] },
        { q: "2. How often does your skin sting, burn, or turn red when trying new products?", a: [ { text: "Frequently — my skin gets irritated easily", type: "react:Sensitive" }, { text: "Rarely — my skin handles products easily", type: "react:Resilient" } ] },
        { q: "3. Do you get frequent breakouts, pimples, or clogged pores?", a: [ { text: "Yes, I get regular blemishes in high-oil areas", type: "acne:true" }, { text: "No, pimples are rare for me", type: "acne:false" } ] },
        { q: "4. Does your skin feel tight underneath even if it looks shiny on top?", a: [ { text: "Yes, it feels pulled or dry underneath", type: "dehyd:true" }, { text: "No, my skin feels comfortable", type: "dehyd:false" } ] },
        { q: "5. What is your main skincare goal right now?", a: [ { text: "Prevent breakouts & control shine", type: "base:Oily" }, { text: "Fix dry, flaky, or tight skin", type: "base:Dry" }, { text: "Calm redness & irritation", type: "react:Sensitive" }, { text: "Maintain healthy skin on a budget", type: "base:Normal" } ] }
    ];

    let quizAnswers = []; let currentQuestionIndex = 0;

    function initializeQuizEngine() {
        quizAnswers = []; currentQuestionIndex = 0;
        const quizResultBox = document.getElementById('quizResultBox');
        const questionBox = document.getElementById('questionBox');
        if (quizResultBox) quizResultBox.classList.add('hidden');
        if (questionBox) questionBox.classList.remove('hidden');
        renderQuizQuestion();
    }

    function renderQuizQuestion() {
        const questionText = document.getElementById('questionText');
        const optionsContainer = document.getElementById('answerOptions');
        const progressTracker = document.getElementById('quizProgressTracker');
        const progressBar = document.getElementById('quizProgressBar');
        
        if (currentQuestionIndex >= quizData.length) { evaluateQuizResults(); return; }
        
        const stepNum = currentQuestionIndex + 1;
        if (progressTracker) progressTracker.textContent = `Step ${stepNum} of 5`;
        if (progressBar) progressBar.style.width = `${(stepNum / 5) * 100}%`;

        const currentQ = quizData[currentQuestionIndex];
        if (questionText) questionText.textContent = currentQ.q;
        if (optionsContainer) {
            optionsContainer.innerHTML = "";
            currentQ.a.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = "quiz-opt-btn"; btn.textContent = opt.text;
                btn.addEventListener('click', () => { quizAnswers.push(opt.type); currentQuestionIndex++; renderQuizQuestion(); });
                optionsContainer.appendChild(btn);
            });
        }
    }

    function evaluateQuizResults() {
        const questionBox = document.getElementById('questionBox');
        const resultBox = document.getElementById('quizResultBox');
        if (questionBox) questionBox.classList.add('hidden');
        if (resultBox) resultBox.classList.remove('hidden');

        let baseTypes = { Normal: 0, Oily: 0, Dry: 0, Combination: 0 };
        let reactTypes = { Sensitive: 0, Resilient: 0 };

        quizAnswers.forEach(ans => {
            if (ans.startsWith("base:")) baseTypes[ans.split(":")[1]]++;
            if (ans.startsWith("react:")) reactTypes[ans.split(":")[1]]++;
        });

        let determinedBase = Object.keys(baseTypes).reduce((a, b) => baseTypes[a] > baseTypes[b] ? a : b);
        let determinedReact = reactTypes.Sensitive >= reactTypes.Resilient ? "Sensitive" : "Resilient";

        userSkinProfile.baseType = determinedBase;
        userSkinProfile.reactivity = determinedReact;
        userSkinProfile.isCalculated = true;

        let typeStr = `${determinedBase} Skin (${determinedReact})`; 
        let descStr = `Your answers indicate a ${determinedBase.toLowerCase()} skin profile. Focus on gentle cleansing and lightweight hydration without over-stripping your skin barrier.`;

        const titleEl = document.getElementById('skinTypeTitle');
        const descEl = document.getElementById('skinTypeDescription');
        if (titleEl) titleEl.textContent = typeStr.toUpperCase();
        if (descEl) descEl.textContent = descStr;
    }

    const syncToRoutineBtn = document.getElementById('syncToRoutineBtn');
    if (syncToRoutineBtn) {
        syncToRoutineBtn.addEventListener('click', () => {
            if (navDashboard && trackerCard) {
                clearActiveTabs(); navDashboard.classList.add('active'); trackerCard.classList.remove('hidden');
                calculateSkinTrajectory();
                window.scrollTo({ top: document.getElementById('impactMatrix').offsetTop - 20, behavior: 'smooth' });
            }
        });
    }
    const resetQuizBtn = document.getElementById('resetQuizBtn');
    if (resetQuizBtn) resetQuizBtn.addEventListener('click', initializeQuizEngine);

    // --- DERMA AI SNAP ---
    window.handleImageSnap = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('imagePreview');
                const container = document.getElementById('imagePreviewContainer');
                if (preview && container) {
                    preview.src = e.target.result;
                    container.classList.remove('hidden');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    window.analyzeProductIngredients = function() {
        const input = document.getElementById('aiIngredientInput');
        const resultBox = document.getElementById('aiAnalysisResult');
        const resultTitle = document.getElementById('aiResultTitle');
        const resultBody = document.getElementById('aiResultBody');

        if (!input || !input.value.trim()) {
            alert("Please paste ingredients or select a product photo first.");
            return;
        }

        const text = input.value.toLowerCase();
        let warnings = [];
        let positives = [];

        if (text.includes("lemon") || text.includes("citric acid") || text.includes("scrub")) {
            warnings.push("Contains harsh acids or physical abrasive particles that can strip your skin barrier.");
        }
        if (text.includes("alcohol denat") || text.includes("denatured alcohol")) {
            warnings.push("Contains drying alcohol which can cause tightness or irritation.");
        }
        if (text.includes("glycerin") || text.includes("niacinamide") || text.includes("ceramide") || text.includes("hyaluronic")) {
            positives.push("Contains skin-identical moisturizing ingredients (Glycerin, Niacinamide, or Ceramides) that support barrier repair.");
        }

        if (resultBox && resultTitle && resultBody) {
            resultBox.classList.remove('hidden');
            resultTitle.textContent = warnings.length > 0 ? "⚠️ Safety Analysis: Use with Caution" : "✅ Safety Analysis: Barrier Friendly";
            
            let html = "";
            if (positives.length > 0) {
                html += `<p style="color: var(--brand-primary); margin-bottom: 0.5rem;"><strong>Benefits:</strong> ${positives.join(" ")}</p>`;
            }
            if (warnings.length > 0) {
                html += `<p style="color: var(--status-alert-text);"><strong>Potential Risks:</strong> ${warnings.join(" ")}</p>`;
            } else {
                html += `<p style="color: var(--brand-primary);">Formula appears clean and gentle for daily use!</p>`;
            }
            resultBody.innerHTML = html;
        }
    };

    // --- SCIENCE HUB DATA ---
    const scienceDatabase = [
        { id: 1, category: "myths", badge: "Trend Debunker", badgeClass: "badge-myth", title: "The DIY Lemon Juice Trend", description: "Applying raw lemon juice strips your natural acid mantle (~4.5 pH) due to its extreme acidity (~2.0 pH), inducing chemical irritation and hyperpigmentation.", actionText: "View PubChem Reference Data →", link: "https://pubchem.ncbi.nlm.nih.gov/compound/Citric-acid#section=Safety-and-Hazards" },
        { id: 2, category: "myths", badge: "Trend Debunker", badgeClass: "badge-myth", title: "Physical Scrubs vs. Friction", description: "Abrasives like crushed seed shells cause micro-scratches in vulnerable surface cells, disrupting moisture protection and causing water loss.", actionText: "Read NCBI Skin Friction Studies →", link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5608132/" },
        { id: 3, category: "classification", badge: "Product Category", badgeClass: "badge-class", title: "Cleansers: Low-pH Surfactants", description: "Traditional soaps feature alkaline pH profiles (>9.0) that strip structural skin components. Low-pH alternatives clean effectively without depleting native lipids.", actionText: "Read PMC Surfactant Formulation Science →", link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3088928/" },
        { id: 4, category: "classification", badge: "Product Category", badgeClass: "badge-class", title: "Moisturizers: Essential Types", description: "Humectants bind moisture inside epidermal layers, while occlusives form a physical surface layout that lowers Transepidermal Water Loss (TEWL).", actionText: "Read Harvard Health Dermatological Guide →", link: "https://www.health.harvard.edu/staying-healthy/the-hype-over-skin-care-ingredients" },
        { id: 5, category: "actives", badge: "Skincare Ingredient", badgeClass: "badge-science", title: "Niacinamide (Vitamin B3)", description: "Extensively researched molecule shown to boost ceramide production, lower baseline TEWL values, and balance surface sebum metrics.", actionText: "View PubMed Niacinamide Trial Data →", link: "https://pubmed.ncbi.nlm.nih.gov/12100180/" },
        { id: 6, category: "anatomy", badge: "Skin Biology", badgeClass: "badge-science", title: "The Skin Barrier Frame", description: "An architectural overview of the stratum corneum's 'brick and mortar' layout: corneocytes act as protective bricks, and specialized lipids act as mortar.", actionText: "Read JID Barrier Function Literature →", link: "https://www.jidonline.org/article/S0022-202X(15)34551-7/fulltext" }
    ];

    const databaseGrid = document.getElementById('databaseGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    function renderCards(categoryFilter) {
        if (!databaseGrid) return;
        databaseGrid.innerHTML = scienceDatabase.filter(item => categoryFilter === "all" || item.category === categoryFilter).map(item => `
            <div class="content-card tab-fade-animation">
                <span class="badge ${item.badgeClass}">${item.badge}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <a href="${item.link}" target="_blank" class="read-more" rel="noopener noreferrer">${item.actionText}</a>
            </div>
        `).join('');
    }

    filterBtns.forEach(btn => btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
        renderCards(btn.getAttribute('data-category'));
    }));

    // --- SHARED DIRECTORY DATA ---
    const peerRegistryDatabase = [
        { id: 1, skinType: "Oily", product: "Garnier Micellar Water Blue", cost: "Rp 35.000 / $3", ingredients: "Water, Hexylene Glycol, Glycerin, Disodium Cocoamphodiacetate", usage: "Pour onto cotton pad, wipe skin surface gently.", definition: "Oil-free, ultra-low cost surfactant solution that cleanses away sunscreen layers without clogging active pore vents." },
        { id: 2, skinType: "Dry", product: "The Ordinary Natural Moisturizing Factors", cost: "Rp 120.000 / $8", ingredients: "Caprylic Triglyceride, Amino Acids, Ceramides, Hyaluronic Acid", usage: "Apply a pea-sized dot over damp skin right after rinsing.", definition: "A dense, clean barrier matching compound setup to resolve cellular skin flaking without adding external fragrances." },
        { id: 3, skinType: "Sensitive", product: "Cetaphil Gentle Skin Cleanser", cost: "Rp 65.000 / $6", ingredients: "Water, Cetyl Alcohol, Propylene Glycol, Stearyl Alcohol", usage: "Massage lightly over wet face, rinse completely with lukewarm water.", definition: "Classic non-foaming, dermatologist-staple emulsion structure built to cleanse surface boundaries without disrupting pH scores." },
        { id: 4, skinType: "Normal", product: "Azarine Hydrasoothe Sunscreen Gel SPF 45", cost: "Rp 65.000 / $5", ingredients: "Water, Aloe Vera, Green Tea Extract, Propolis, Niacinamide", usage: "Smooth two complete finger lengths across the skin before sun exposure.", definition: "Incredibly lightweight, organic chemical filter matrix that leaves zero white residue tracks or heavy oily sheen layers." }
    ];

    const peerRegistryGrid = document.getElementById('peerRegistryGrid');
    const peerFilterBtns = document.querySelectorAll('.peer-filter-btn');

    function renderPeerRegistry(skinFilter) {
        if (!peerRegistryGrid) return;
        const filteredData = peerRegistryDatabase.filter(item => skinFilter === "all" || item.skinType === skinFilter);

        peerRegistryGrid.innerHTML = filteredData.map(item => `
            <div class="content-card tab-fade-animation" style="border-top: 3px solid var(--brand-accent);">
                <span class="badge ${item.skinType === 'Oily' ? 'badge-science' : item.skinType === 'Dry' ? 'badge-myth' : 'badge-class'}">${item.skinType} Skin</span>
                <h3 style="margin-top: 0.25rem; font-size: 1.15rem; color: var(--brand-primary);">${item.product}</h3>
                <p style="font-size: 0.85rem; font-weight: 700; color: var(--brand-accent); margin-bottom: 0.5rem;">Cost: ${item.cost}</p>
                <p style="font-size: 0.85rem; color: var(--color-text-main); line-height: 1.5; margin-bottom: 0.75rem;"><strong>Notes:</strong> "${item.definition}"</p>
                <div style="background: var(--bg-main); padding: 0.6rem; border-radius: 6px; font-size: 0.8rem; border: 1px solid var(--border-subtle);">
                    <p style="margin-bottom: 0.25rem;">🧪 <strong>Ingredients:</strong> ${item.ingredients}</p>
                    <p>⚙️ <strong>Directions:</strong> ${item.usage}</p>
                </div>
            </div>
        `).join('');
    }

    peerFilterBtns.forEach(btn => btn.addEventListener('click', () => {
        peerFilterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
        renderPeerRegistry(btn.getAttribute('data-skin'));
    }));

    // RESTORED HIGH-DENSITY DICTIONARY PRO DATA MATRIX (70+ Terms)
    const categories = ["Active Component", "Product Function", "Anatomy", "Biology"];
    const matrix = [
        ["Hyaluronic Acid", 0, "A moisture-binding molecule that holds up to 1000x its weight in water to plump the skin surface.", "Apply to damp skin to prevent drawing moisture outward."],
        ["Niacinamide", 0, "Vitamin B3 compound that strengthens the barrier, limits excess sebum production, and unifies tone.", "Mixes smoothly with most actives without causing flares."],
        ["Retinol", 0, "Vitamin A derivative that accelerates cell turnover and stimulates structural collagen paths.", "Use strictly at night and wear broad-spectrum protection by day."],
        ["Salicylic Acid", 0, "Oil-soluble Beta Hydroxy Acid (BHA) that cuts through sebum inside pore walls.", "Perfect spot solution for blackheads and clogged zones."],
        ["Glycolic Acid", 0, "Alpha Hydroxy Acid (AHA) with small molecular weight for fast surface micro-exfoliation.", "Can cause mild initial stinging on sensitive complexions."],
        ["Tocopherol", 0, "Vitamin E skin-identical lipid antioxidant providing structural lipid protection.", "Synergizes perfectly with Vitamin C to double free-radical defense."],
        ["Centella Asiatica", 0, "Botanical herb concentration famous for calming tissue and reducing visual surface scaling.", "Your primary weapon for treating an over-exfoliated skin barrier."],
        ["Squalane", 0, "Saturated, highly shelf-stable emollient oil mimicking native skin lipids.", "Biocompatible fluid that won't trigger standard oily breakouts."],
        ["Benzoyl Peroxide", 0, "Antimicrobial compound that sends oxygen into pore channels to destroy acne-causing bacteria.", "Can discolor colored linens; rinse off completely if using body washes."],
        ["Titanium Dioxide", 0, "Inert mineral active that remains on top of surface layers to deflect UV wavelengths.", "Highly stable and recommended for reactive or rosacea-prone paths."],
        ["Humectant", 1, "Water-loving ingredients drawing hydration up from deeper cells or humid external environments.", "Glycerin and Hyaluronic Acid are classic functional examples."],
        ["Emollient", 1, "Smoothing oils or fatty lipids that patch structural gaps between dry shedding cells.", "Restores immediate elasticity and silkiness to flaky surfaces."],
        ["Occlusive", 1, "Hydrophobic compounds building an invisible protective seal to curb moisture loss.", "Apply as your final nighttime step to lock in lighter serums."],
        ["Lotion", 1, "Lightweight fluid emulsions combining balanced ratios of oil and water phases.", "Absorbs cleanly without forming heavy waxy residue tracks."],
        ["Moisturizer", 1, "Topical mixtures structured to maintain stratum corneum hydration levels.", "Apply within minutes after cleaning to bind maximum surface water."],
        ["Epidermis", 2, "The stratified outermost biological block shielding against dehydration and external microbes.", "The primary zone where non-prescription cosmetic topical items react."],
        ["Stratum Corneum", 2, "The thin exterior brick-and-mortar skin matrix acting as your primary moisture barrier.", "Keep this layer shielded; avoiding harsh friction preserves it best."],
        ["Melanin", 3, "Natural color pigments synthesised by melanocytes to shield cellular DNA from radiation.", "Inflammation or picking pimples accelerates localized melanin spots."],
        ["Sebum", 3, "Native waxy oil secretions layout lubricating external structural layers.", "Balanced sebum acts as a built-in age shield; don't over-strip it."],
        ["Ceramides", 0, "Crucial structural lipids making up over 50% of the natural matrix linking skin cells.", "Look for these if your moisture shield feels raw or flaky."],
        ["Glycerin", 0, "A cost-effective, time-tested humectant that pulls hydration into surface layers.", "Extremely safe, non-reactive, and perfect for strict budget configurations."],
        ["Lactic Acid", 0, "An AHA derived from milk that removes surface buildup while acting as a natural humectant.", "Gentler exfoliation alternative than Glycolic Acid for dry skin types."],
        ["Azelaic Acid", 0, "Dicarboxylic compound that reduces cellular redness and calms persistent dark marks.", "Great secondary option for handling post-acne blemishes safely."],
        ["Allantoin", 0, "Soothing botanical derivative that minimizes irritation and protects vulnerable surface cells.", "Commonly added to standard basic cleansers to offset stripping reactions."],
        ["Zinc Oxide", 0, "Mineral UV barrier providing broad-spectrum coverage while naturally soothing skin surface heat.", "Excellent protective filter choice for reactive or acne-prone profiles."],
        ["Panthenol", 0, "Provitamin B5 active that converts into pantothenic acid to accelerate barrier repair.", "Binds water efficiently to improve overall layer elasticity scores."],
        ["Peptides", 0, "Short strings of foundational amino acids acting as messengers to support structural density.", "Helps maintain bounce and firmness when used consistently over time."],
        ["Ascorbic Acid", 0, "Pure Vitamin C molecule specializing in neutralizing pollution stresses and brightening tone.", "Highly vulnerable to air degradation; store away from direct sunlight."],
        ["Sulfur", 0, "Traditional mineral active that dries excess surface oil and lifts dead cells out of pores.", "Effective targeted spot treatment for localized oily breakouts."],
        ["Tea Tree Oil", 0, "Natural botanical essential oil possessing clean anti-microbial properties.", "Must be heavily diluted to prevent localized chemical skin irritation."],
        ["Zinc PCA", 0, "Trace mineral compound designed to trace and control daily sebum output pathways.", "Helps regulate oily skin shine without over-drying subsurface cell blocks."],
        ["Urea", 0, "Dual-action ingredient that softens hardened proteins while infusing high-level hydration.", "Low concentrations gently encourage shedding without needing harsh friction."],
        ["Coenzyme Q10", 0, "Cellular antioxidant compound defending structural matrices from premature degradation.", "Supports natural skin defense loops against daily oxidation events."],
        ["Alpha Arbutin", 0, "Hydroquinone derivative that limits localized pigment spots without harsh toxicity metrics.", "Safe daily option for brightening uneven tone or acne shadows."],
        ["Kojic Acid", 0, "Fungal-derived brightening active that targets enzymes responsible for dark spot clusters.", "Best used inside low-dose serum layers to keep skin comfortable."],
        ["Ferulic Acid", 0, "Plant-based antioxidant compound that structurally reinforces and stabilizes Vitamin C molecules.", "Boosts the shelf life and performance of water-based active fluids."],
        ["Bakuchiol", 0, "Plant alternative offering similar turnover logic as retinols without their drying side effects.", "Excellent nighttime option if your skin profile reacts poorly to Vitamin A."],
        ["Green Tea Extract", 0, "Polyphenol powerhouse that targets internal oxidation signs while soothing surface redness.", "Calms active breakouts and shields skin from urban pollution dynamics."],
        ["Resveratrol", 0, "Grape-derived antioxidant fluid that works overnight to boost native renewal cycles.", "Supports structural bounce when integrated into simple nighttime layers."],
        ["Madecassoside", 0, "Purified active extract taken from Centella Asiatica specializing in tissue comfort.", "Reduces systemic tightness when skin boundaries feel compromised."],
        ["Beta-Glucan", 0, "Oat-derived sugar compound that holds hydration significantly better than hyaluronic acid.", "Creates a smooth protective cushion layer ideal for highly sensitive types."],
        ["Licorice Root Extract", 0, "Natural botanical compound that interrupts dark spot formation pathways visibly.", "Soothes internal skin flushing while unifying overall skin tone distribution."],
        ["Adenosine", 0, "Yeast-derived compound that aids energy pathways to reinforce natural cell maintenance.", "Helps smooth micro-creases across high-movement facial dynamic regions."],
        ["PHA (Polyhydroxy Acid)", 0, "Next-gen chemical exfoliant with large molecular volume that stays exclusively on the top layer.", "Ideal surface refiner for ultra-sensitive or easily flushed complexions."],
        ["Argan Oil", 0, "Rich botanical lipid concentration dense with nourishing oleic and linoleic essential acids.", "Best utilized by dry skin profiles needing immediate lipid reinforcement."],
        ["Jojoba Oil", 0, "Liquid wax ester structurally identical to human sebum profiles.", "Tricks oily skin into producing less native oil while smoothing texture."],
        ["Rosehip Seed Oil", 0, "Dry botanical oil high in natural trans-retinoic acid variants and essential lipids.", "Nourishes flaky skin zones without leaving heavy suffocating oil tracks."],
        ["Witch Hazel", 0, "Traditional botanical astringent that creates immediate temporary skin tightening reactions.", "Can cause chronic irritation if formulated alongside volatile drying alcohol carriers."],
        ["Hydroquinone", 0, "Potent pigment-correcting active that temporarily dampens melanin factory output loops.", "Requires professional medical tracking; never self-medicate for extended phases."],
        ["Clindamycin", 0, "Prescription topical antibiotic engineered to arrest deep microbial blemish populations.", "Should only be integrated under strict guidance from a certified physician."],
        ["Adapalene", 0, "Third-generation topical retinoid structured specifically to target deep acne plug cycles.", "Apply sparingly over completely dry surfaces at night to lower peeling risks."],
        ["Tretinoin", 0, "Highly active retinoic acid active that bonds immediately with cellular receptors.", "Prescription-only powerhouse requiring constant barrier support and strict daily UV screening."],
        ["BHA (Beta Hydroxy Acid)", 1, "Lipid-loving chemical refiners capable of working inside oily pore channels.", "The definitive category name for ingredients like Salicylic Acid."],
        ["AHA (Alpha Hydroxy Acid)", 1, "Water-soluble chemical exfoliants that loosen binding links between dead surface cells.", "Includes Glycolic, Lactic, and Mandelic acid variants."],
        ["Micellar Water", 1, "Suspension of microscopic cleansing oil bubbles inside pure purified water.", "Captures oil-based sunscreen remnants without breaking basic barrier layers."],
        ["Surfactant", 1, "Cleansing agents designed to lower water tension to sweep grease away easily.", "Look for gentle, non-foaming options to bypass tight post-wash metrics."],
        ["Physical Exfoliant", 1, "Manual tools or granular scrubs designed to physically friction away dead cells.", "Avoid heavy jagged fragments which risk creating microscopic surface scratches."],
        ["Chemical Exfoliant", 1, "Topical organic acids that dissolve cellular bonds to encourage natural shedding.", "Much easier to control and scale safely compared to abrasive mechanical friction."],
        ["Sun Protection Factor", 1, "Relative scale measuring how long a filter shield protects against UVB burning.", "Always choose at least SPF 30 for baseline daily defensive routines."],
        ["UVA Radiation", 3, "Long UV wavelengths that penetrate deep into structural frames, destroying collagen blocks.", "Present year-round through cloud cover and window panes; requires broad-spectrum shields."],
        ["UVB Radiation", 3, "Short UV wavelengths responsible for surface sunburn events and immediate tissue damage.", "Directly countered by standard SPF metric evaluations daily."],
        ["Transepidermal Water Loss", 1, "The biological measurement of water escaping through the epidermis into the atmosphere.", "Minimizing TEWL using proper emollients is crucial for skin comfort."],
        ["Dermis", 2, "The thick deep structural layer housed beneath the outer epidermal shield.", "Contains blood supply loops, sweat glands, and structural collagen cables."],
        ["Sebaceous Gland", 2, "Microscopic skin organs tasked with synthesizing and secreting sebum lubricants.", "Concentrated heavily around the forehead, nose, and upper back zones."],
        ["Acid Mantle", 2, "Vulnerable low-pH protective film coating your outer cellular boundary layout.", "Maintained by native sweat and sebum to repel microbial invaders."],
        ["Corneocytes", 2, "Hardened, dead skin cells forming the brick blocks of the outer barrier shield.", "Regularly shed off invisibly when skin turnover is functioning healthily."],
        ["Lipid Matrix", 2, "The mortar fluid (ceramides, cholesterol, fatty acids) holding skin cells together.", "Essential for stopping water from escaping and blocking irritants out."],
        ["pH Scale", 3, "Logarithmic numeric range detailing whether a fluid mix is acidic or basic.", "Skin prefers a slightly acidic environment hovering around 4.5 to 5.5."]
    ];

    const dictionaryListContainer = document.getElementById('dictionaryListContainer');
    const dictionarySearchInput = document.getElementById('dictionarySearchInput');

    function renderDictionaryList(searchTerm = "") {
        if (!dictionaryListContainer) return;
        const cleanSearch = searchTerm.toLowerCase().trim();
        
        const filtered = matrix.filter(row => 
            row[0].toLowerCase().includes(cleanSearch) || 
            row[2].toLowerCase().includes(cleanSearch) ||
            categories[row[1]].toLowerCase().includes(cleanSearch)
        );

        if (filtered.length === 0) {
            dictionaryListContainer.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 2rem 0;">No vocabulary terms match your search query.</p>`;
            return;
        }

        dictionaryListContainer.innerHTML = filtered.map(row => `
            <div class="dict-card tab-fade-animation">
                <div class="dict-header">
                    <h3>${row[0]}</h3>
                    <span class="dict-tag">${categories[row[1]]}</span>
                </div>
                <p class="dict-def">${row[2]}</p>
                <div class="dict-protip"><strong>🧠 Pro Insight:</strong> ${row[3]}</div>
            </div>
        `).join('');
    }

    if (dictionarySearchInput) {
        dictionarySearchInput.addEventListener('input', (e) => {
            renderDictionaryList(e.target.value);
        });
    }

    // --- RESTORED PROFILE STATE & TELEMETRY ---
    const userID = getOrCreateUserID();
    const displayUserEl = document.getElementById('displayUserID');
    if (displayUserEl) displayUserEl.textContent = userID;

    const savedName = localStorage.getItem('dermaGrowUserName');
    const profileInput = document.getElementById('profileNameInput');
    if (savedName && profileInput) {
        profileInput.value = savedName;
    }
    updateProfileBadge(Boolean(savedName));

    calculateSkinTrajectory();
    renderCards("all");
    renderDictionaryList("");
});

// GLOBAL PROFILE & USER ID UTILITIES
function getOrCreateUserID() {
    let userID = localStorage.getItem('dermaGrowUserID');
    if (!userID) {
        userID = 'user_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('dermaGrowUserID', userID);
    }
    return userID;
}

function updateProfileBadge(isLinked) {
    const badge = document.getElementById('profileSyncBadge');
    if (badge) {
        if (isLinked) {
            badge.textContent = "Profile: Saved & Synced";
            badge.style.backgroundColor = "rgba(196, 154, 69, 0.15)";
            badge.style.color = "var(--brand-accent)";
        } else {
            badge.textContent = "Profile: Guest Mode";
            badge.style.backgroundColor = "var(--border-subtle)";
            badge.style.color = "var(--color-text-muted)";
        }
    }
}

function saveUserProfile() {
    const nameInput = document.getElementById('profileNameInput');
    const userName = nameInput ? nameInput.value.trim() : "";

    if (!userName) {
        alert("Please enter a name or alias.");
        return;
    }

    localStorage.setItem('dermaGrowUserName', userName);
    updateProfileBadge(true);
    logRoutineToSheet(0, 0, "Profile Saved / Synced");

    alert("Profile saved successfully! Your name is now linked to your session telemetry.");
}

function logRoutineToSheet(budget, trendsAvoided, selectedProducts) {
    const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxsJ2EIs0KmpovS3eWZDJc3XoKkHBII25QTTDfQ3KAU0OFNJzAFvAmnHXMSdAhmnqBi/exec";
    
    const profileInput = document.getElementById('profileNameInput');
    const inputVal = profileInput ? profileInput.value.trim() : "";
    const savedName = localStorage.getItem('dermaGrowUserName');
    
    const finalUserName = inputVal || savedName || "Guest";

    fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userID: getOrCreateUserID(),
            userName: finalUserName,
            timestamp: new Date().toISOString(),
            budget: budget,
            trendsAvoided: trendsAvoided,
            routine: selectedProducts
        })
    }).catch(err => console.log("Silent telemetry log failure"));
}

function refreshTip() {
    const tips = [
        "Your skin is a living organ, not a filter. Give it grace today.",
        "Consistency with a safe, simple routine beats an expensive 10-step routine every time.",
        "Pores and texture are completely natural human features, not flaws."
    ];
    const el = document.getElementById('dailyTip');
    if (el) el.textContent = tips[Math.floor(Math.random() * tips.length)];
}
