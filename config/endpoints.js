const _ = require("lodash");

const ffMap = {
    EUR: 79.63,
    USD: 63.83,
    JPY: 0.58
}

const CEX_EP = function(crypto, fiat){
    const name = "C_"+crypto+"_"+fiat;
    return {
        url: "http://cex.io/api/ticker/"+crypto+"/"+fiat,
        name: name.slice(0,11),
        method: 'GET',
        encoding: "utf8",
        crypto: crypto,
        sell: "bid",
        buy: "ask",
        ff: ffMap[fiat],
        conv: 6.5
    };
};

const QUOINE_EP = function(crypto, fiat, id){
    const name = "Q_" + crypto + "_" + fiat;
    return {
        url: "https://api.quoine.com/products/"+id,
        name: name.slice(0,11),
        method: 'GET',
        encoding: "utf8",
        crypto: crypto,
        conv: 6.5,
        ff: ffMap[fiat],
        sell: "market_bid",
        buy: "market_ask"
    };
};

const BITBNS_CONF = {
    XRP: 1,
    ETH: 4,
    XLM: 5
};
const BITBNS_EP = function(crypto){
    const name = "BITB_"+crypto;
    return {
        url: "http://bitbns.com/order/getTickerAll",
        name: name.slice(0,11),
        method: 'GET',
        encoding: "utf8",
        crypto: crypto,
        sell: "["+BITBNS_CONF[crypto]+"]."+crypto+".buyPrice",
        buy: "["+BITBNS_CONF[crypto]+"]."+crypto+".sellPrice",
        conv: 0.5,
        ff: 1
    };
};

const COINOME_EP = function(crypto){
    const name = "CO_"+crypto;
    return {
        url: "http://www.coinome.com/api/v1/ticker.json",
        name: name.slice(0,11),
        method: 'GET',
        encoding: "utf8",
        crypto: crypto,
        sell: crypto+"-INR.highest_bid",
        buy: crypto+"-INR.lowest_ask",
        conv: 0.25,
        ff: 1
    };
};

const KOINEX_EP = function(crypto){
    const name = "KOIN_"+crypto;
    return {
        url: "http://koinex.in/api/dashboards/ticker",
        name: name.slice(0,11),
        method: 'GET',
        encoding: "utf8",
        crypto: crypto,
        sell: crypto,
        buy: crypto,
        conv: 0.25,
        ff: 1
    };
};


const ENDPOINTS_CONFIG = {
    QUOINE_XRP: QUOINE_EP("XRP", "USD", 84),

    CEX_XRP_EUR: CEX_EP("XRP", "EUR"),
    CEX_DASH_EUR: CEX_EP("DASH", "EUR"),
    CEX_BCH_EUR: CEX_EP("BCH", "EUR"),
    CEX_XLM_EUR: CEX_EP("XLM", "EUR"),
    CEX_ETH_EUR: CEX_EP("ETH", "EUR"),


    CEX_XRP_USD: CEX_EP("XRP", "USD"),
    CEX_DASH_USD: CEX_EP("DASH", "USD"),
    CEX_BCH_USD: CEX_EP("BCH", "USD"),
    CEX_ETH_USD: CEX_EP("ETH", "USD"),

    BITBNS_XRP: BITBNS_EP("XRP"),
    BITBNS_ETH: BITBNS_EP("ETH"),
    BITBNS_XLM: BITBNS_EP("XLM"),

    //COINOME_BCH: COINOME_EP("BCH"),
    //COINOME_DASH: COINOME_EP("DASH"),

    KOINEX_XRP: KOINEX_EP("XRP"),
    KOINEX_ETH: KOINEX_EP("ETH"),
    KOINEX_BCH: KOINEX_EP("BCH")
};







const ENDPOINTS = _.values(ENDPOINTS_CONFIG);
const SELL_PRICE_PATH = ENDPOINTS.map(function(ep){
    return ep.sell;
});
const BUY_PRICE_PATH = ENDPOINTS.map(function(ep){
    return ep.buy;
});

const CONVERSION_FACTORS = ENDPOINTS.map(function(ep){
    return ep.ff;
});

const TRANSACTION_CHARGES = ENDPOINTS.map(function(ep){
    return ep.conv;
});

const finalConf= {
    ENDPOINTS: ENDPOINTS,
    SELL_PRICE_PATH: SELL_PRICE_PATH,
    BUY_PRICE_PATH: BUY_PRICE_PATH,
    CONVERSION_FACTORS: CONVERSION_FACTORS,
    TRANSACTION_CHARGES: TRANSACTION_CHARGES
};

console.log(finalConf);

module.exports = finalConf;