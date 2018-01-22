const ENDPOINTS_CONFIG = {
    CEX_EUR: {hostname: "cex.io", path: "/api/ticker/XRP/EUR", name: "CEX_EUR"},
    CEX_USD: {hostname: "cex.io", path: "/api/ticker/XRP/USD", name: "CEX_USD"},
    BITBNS: {hostname: "bitbns.com", path: "/order/getTickerAll", name: "BITBNS"},
    KOINEX: {
        hostname: "koinex.in", path: "/api/dashboards/ticker",
//"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
        //"Accept": "application/json",
        //"Accept-Encoding": "gzip, deflate, br",
        //"Accept-Language": "en-US,en;q=0.9,ms;q=0.8",
        //"Origin": "https://koinex.in",
        //"Referer": "https://koinex.in/exchange/ripple",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
        "Cookie": "__cfduid=d88ba397e42c4270573b50a46e11bb7751510782180; ext_name=jaehkpjddfdgiiefcnhahapilbejohhj; _ga=GA1.2.806695738.1510782187; chatRole=standard; txnid=3aad5b02-e57e-4033-b18e-9a13f0dd7cab; exchange_type=RIPPLE; target_currency=ripple; _gid=GA1.2.606203349.1516481854; cf_clearance=407482883eb35384f5e47324282c607431230dea-1516579334-1800; AWSALB=lPPddkYUkXTeeyVP5LyFYaIBeQv4fKiEM7isjuYwbffbkvOxnUvOt+uhEv25vXEaEBh86gEJZr8ie68QKctmrN/yhpbZYI8NADeOnadcc+CC95id29WFYmTTW2V3; _koinex-frontend_session=bmxXNnR2V3J0RDBXUGJNMFB5SWluVVRsby9NdWdvTjFmbnZEbGNoclBIcjFuSGdpekR1QTBPNXZmMVpXcFBma2lkOHlwaEh4NUx3cXh2SU9iWmg5ejJEWmJPeHZycm1NNE1mN1NLUGtaaG1jOW53TDZkdTZvaHk1Y0lXU00yUmlVcG5kazlpc0hBcFlBR0tSNFI1SzVBPT0tLWxpc0xiU2J1M0QzbERrOWJJZlFtSEE9PQ%3D%3D--6a79f5adac67303e2e2d5dfc0135cbd0631bc3dc"
    }
};

const SELL_PRICE_PATH = ["ask", "ask", "[1].XRP.buyPrice"
    //"XRP"
];
const BUY_PRICE_PATH = ["bid", "bid", "[1].XRP.sellPrice"
    //"XRP"
];
const EURO_TO_INR = 78.33;
const USD_TO_INR = 63.83;
const CONVERSION_FACTORS = [USD_TO_INR, EURO_TO_INR, 1,
    1];


module.exports = {
    ENDPOINTS: [ENDPOINTS_CONFIG.CEX_USD, ENDPOINTS_CONFIG.CEX_EUR, ENDPOINTS_CONFIG.BITBNS],
    SELL_PRICE_PATH: SELL_PRICE_PATH,
    BUY_PRICE_PATH: BUY_PRICE_PATH,
    CONVERSION_FACTORS: CONVERSION_FACTORS
};