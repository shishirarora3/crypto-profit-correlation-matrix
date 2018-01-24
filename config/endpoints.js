const CEX_EP = function(crypto, fiat){
    const name = "CEX_"+crypto+"_"+fiat;
    return {
        url: "http://cex.io/api/ticker/"+crypto+"/"+fiat,
        name: name.slice(0,11),
        method: 'GET',
        encoding: "utf8"
    };
};

const ENDPOINTS_CONFIG = {
    CEX_XRP_EUR: CEX_EP("XRP", "EUR"),
    CEX_DASH_EUR: CEX_EP("DASH", "EUR"),
    CEX_BCH_EUR: CEX_EP("BCH", "EUR"),
    CEX_XRP_USD: CEX_EP("XRP", "USD"),
    CEX_DASH_USD: CEX_EP("DASH", "USD"),
    CEX_BCH_USD: CEX_EP("BCH", "USD"),
    //////////////////
    BITBNS_XRP: {
        url: "http://bitbns.com/order/getTickerAll",
        name: "BITBNS_XRP",
        method: 'GET',
        encoding: "utf8"
    },
    ///////
    COINOME_BCH: {
        url: "http://www.coinome.com/api/v1/ticker.json",
        name: "COINOME_BCH",
        method: 'GET',
        encoding: "utf8"
    },
    COINOME_DASH: {
        url: "http://www.coinome.com/api/v1/ticker.json",
        name: "COINOME_DAS",
        method: 'GET',
        encoding: "utf8"
    },
    //////
    KOINEX_BCH: {
        url: "http://koinex.in/api/dashboards/ticker",
        name: "KOINEX_BCH",
        method: 'GET',
        encoding: "utf8"
    },
    KOINEX_XRP: {
        url: "http://koinex.in/api/dashboards/ticker",
        name: "KOINEX_XRP",
        method: 'GET',
        encoding: "utf8"
    },
    KOINEX_LTC: {
        url: "http://koinex.in/api/dashboards/ticker",
        name: "KOINEX_LTC",
        method: 'GET',
        encoding: "utf8"
    },
};

const SELL_PRICE_PATH = ["ask","ask", "ask","ask", "ask", "ask",
    "[1].XRP.sellPrice",
    "BCH-INR.lowest_ask","DASH-INR.lowest_ask",
    "BCH","XRP","LTC"
];
const BUY_PRICE_PATH = ["bid","bid", "bid","bid", "bid","bid",
    "[1].XRP.buyPrice",
    "BCH-INR.highest_bid","DASH-INR.highest_bid",
    "BCH","XRP","LTC"
];

const TRANSACTION_CHARGES = [ 6.2, 6.2, 6.2, 6.2, 6.2, 6.2,
    0,
    0,0,
    0.25,0.25,0.25
];

const EURO_TO_INR = 78.33;
const USD_TO_INR = 63.83;
const CONVERSION_FACTORS = [ EURO_TO_INR, EURO_TO_INR,EURO_TO_INR, USD_TO_INR,USD_TO_INR,USD_TO_INR,
    1,
    1, 1,
    1,1,1
];


module.exports = {
    ENDPOINTS: [
        ENDPOINTS_CONFIG.CEX_XRP_EUR,
        ENDPOINTS_CONFIG.CEX_DASH_EUR,
        ENDPOINTS_CONFIG.CEX_BCH_EUR,
        ENDPOINTS_CONFIG.CEX_XRP_USD,
        ENDPOINTS_CONFIG.CEX_DASH_USD,
        ENDPOINTS_CONFIG.CEX_BCH_USD,

        ENDPOINTS_CONFIG.BITBNS_XRP,

        ENDPOINTS_CONFIG.COINOME_BCH,
        ENDPOINTS_CONFIG.COINOME_DASH,

        ENDPOINTS_CONFIG.KOINEX_BCH,
        ENDPOINTS_CONFIG.KOINEX_XRP,
        ENDPOINTS_CONFIG.KOINEX_LTC
    ],
    SELL_PRICE_PATH: SELL_PRICE_PATH,
    BUY_PRICE_PATH: BUY_PRICE_PATH,
    CONVERSION_FACTORS: CONVERSION_FACTORS,
    TRANSACTION_CHARGES: TRANSACTION_CHARGES
};