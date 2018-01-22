const ENDPOINTS_CONFIG = {
    CEX_EUR: {url: "http://cex.io/api/ticker/XRP/EUR", name: "CEX_EUR",method: 'GET',
        encoding: "utf8"},
    CEX_USD: {url: "http://cex.io/api/ticker/XRP/USD", name: "CEX_USD",method: 'GET',
        encoding: "utf8"},
    BITBNS: {url: "http://bitbns.com/order/getTickerAll", name: "BITBNS",method: 'GET',
        encoding: "utf8"},
    KOINEX: {
        url: "http://koinex.in/api/dashboards/ticker",
         name: "KOINEX",
        method: 'GET',
        encoding: "utf8"
    }

};

const SELL_PRICE_PATH = ["ask", "ask", "[1].XRP.sellPrice",
    "XRP"
];
const BUY_PRICE_PATH = ["bid", "bid", "[1].XRP.buyPrice",
    "XRP"
];

const TRANSACTION_CHARGES = [6.2, 6.2, 0,  0.25
];

const EURO_TO_INR = 78.33;
const USD_TO_INR = 63.83;
const CONVERSION_FACTORS = [USD_TO_INR, EURO_TO_INR, 1,
    1];


module.exports = {
    ENDPOINTS: [
        ENDPOINTS_CONFIG.CEX_USD,
        ENDPOINTS_CONFIG.CEX_EUR,
        ENDPOINTS_CONFIG.BITBNS,
        ENDPOINTS_CONFIG.KOINEX
    ],
    SELL_PRICE_PATH: SELL_PRICE_PATH,
    BUY_PRICE_PATH: BUY_PRICE_PATH,
    CONVERSION_FACTORS: CONVERSION_FACTORS,
    TRANSACTION_CHARGES: TRANSACTION_CHARGES
};