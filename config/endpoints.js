const _ = require("lodash");

const CHANGELLY_URL = "https://changelly.com/api/currencies";

const ffMap = {
    EUR: 80.19,
    USD: 64.99,
    JPY: 0.58
};

const getEP = function(exchange, crypto){
    const name = exchange.slice(0,4) + "_"+crypto.slice(0,3);
    return {
        url: "https://coinhero.in/exchanges/"+ exchange+ "/coins/ticker.json",
        method: 'GET',
        encoding: "utf8",
        crypto: crypto,
        sell: crypto+".price",
        buy: crypto+".price",
        conv: 0.5,
        ff: 1,
        name: _.toUpper(name)
    };
};
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

const EXCHANGE_CRYPTO_MAP = {
    bitbns: ["XRP", "XLM"],
    koinex: ["XRP"]
};


const ENDPOINTS_CONFIG_INT = {

    CEX_XRP_EUR: CEX_EP("XRP", "EUR"),
    CEX_XLM_EUR: CEX_EP("XLM", "EUR"),
    CEX_XLM_USD: CEX_EP("XLM", "USD"),

    CEX_XRP_USD: CEX_EP("XRP", "USD")

};


const ENDPOINTS_CONFIG = (function () {
    Object.keys(EXCHANGE_CRYPTO_MAP).forEach(function (k) {
        EXCHANGE_CRYPTO_MAP[k].forEach(function (cry) {
            ENDPOINTS_CONFIG_INT[k+"_"+cry]=getEP(k,cry);
        });
    });
    return ENDPOINTS_CONFIG_INT;
})();




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