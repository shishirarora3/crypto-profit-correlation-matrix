const _ = require("lodash");
const CEX_EP = function(crypto, fiat){
    const name = "CEX_"+crypto+"_"+fiat;
    return {
        url: "http://cex.io/api/ticker/"+crypto+"/"+fiat,
        name: name.slice(0,11),
        method: 'GET',
        encoding: "utf8"
    };
};

const QUOINE_EP = function(crypto, fiat, id){
    const name = "QU_" + crypto + "_" + fiat;
    return {
        url: "https://api.quoine.com/products/"+id,
        name: name.slice(0,11),
        method: 'GET',
        encoding: "utf8"
    };
};

const BITBNS_EP = function(crypto){
    const name = "BITBNS_"+crypto;
    return {
        url: "http://bitbns.com/order/getTickerAll",
        name: name.slice(0,11),
        method: 'GET',
        encoding: "utf8"
    };
};

const COINOME_EP = function(crypto){
    const name = "COINOME_"+crypto;
    return {
        url: "http://www.coinome.com/api/v1/ticker.json",
        name: name.slice(0,11),
        method: 'GET',
        encoding: "utf8"
    };
};

const KOINEX_EP = function(crypto){
    const name = "KOINEX_"+crypto;
    return {
        url: "http://koinex.in/api/dashboards/ticker",
        name: name.slice(0,11),
        method: 'GET',
        encoding: "utf8"
    };
};


const ENDPOINTS_CONFIG = {
    QUOINE_XRP : QUOINE_EP("XRP","USD", 84),
    CEX_XRP_EUR: CEX_EP("XRP", "EUR"),
    CEX_DASH_EUR: CEX_EP("DASH", "EUR"),
    CEX_BCH_EUR: CEX_EP("BCH", "EUR"),
    CEX_XRP_USD: CEX_EP("XRP", "USD"),
    CEX_DASH_USD: CEX_EP("DASH", "USD"),
    CEX_BCH_USD: CEX_EP("BCH", "USD"),
    CEX_ETH_USD: CEX_EP("ETH", "USD"),
    //////////////////
    BITBNS_XRP: BITBNS_EP("XRP"),
    BITBNS_ETH: BITBNS_EP("ETH"),
    ///////
    COINOME_BCH: COINOME_EP("BCH"),
    COINOME_DASH: COINOME_EP("DASH"),
    //////

    /*KOINEX_BCH: KOINEX_EP("BCH"),
    KOINEX_XRP: KOINEX_EP("XRP"),
    KOINEX_ETH: KOINEX_EP("ETH"),*/
};

const SELL_PRICE_PATH = ["market_ask",
    "ask","ask", "ask","ask", "ask", "ask","ask",
    "[1].XRP.sellPrice","[4].ETH.sellPrice",
    "BCH-INR.lowest_ask","DASH-INR.lowest_ask",
    /*"BCH","XRP","ETH"*/
];
const BUY_PRICE_PATH = ["market_bid",
    "bid","bid", "bid","bid", "bid","bid","bid",
    "[1].XRP.buyPrice","[4].ETH.buyPrice",
    "BCH-INR.highest_bid","DASH-INR.highest_bid",
    /*"BCH","XRP","ETH"*/
];

const TRANSACTION_CHARGES = [
    6.2,
    6.2, 6.2, 6.2, 6.2, 6.2, 6.2,6.2,
    0,0,
    0,0,
    /*0.25,0.25,0.25*/
];

const EURO_TO_INR = 78.33;
const USD_TO_INR = 63.83;
const JPY_TO_INR= 0.58;
const SGD_TO_INR= 48.65;
const CONVERSION_FACTORS = [
    USD_TO_INR,
    EURO_TO_INR, EURO_TO_INR,EURO_TO_INR, USD_TO_INR,USD_TO_INR,USD_TO_INR,USD_TO_INR,
    1,1,
    1, 1,
    /*1,1,1*/
];


module.exports = {
    ENDPOINTS: _.values(ENDPOINTS_CONFIG),
    SELL_PRICE_PATH: SELL_PRICE_PATH,
    BUY_PRICE_PATH: BUY_PRICE_PATH,
    CONVERSION_FACTORS: CONVERSION_FACTORS,
    TRANSACTION_CHARGES: TRANSACTION_CHARGES
};