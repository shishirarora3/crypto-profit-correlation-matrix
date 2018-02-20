const _ = require("lodash");

const CHANGELLY_URL = "https://changelly.com/api/currencies";

const ffMap = {
    EUR: 79.63,
    USD: 63.83,
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
    bitbns: ["XRP", "ETH", "XLM"],
    koinex: ["XRP", "ETH", "BCH"],
    zebpay: ["XRP", "BCH"],
    coinome: ["BCH", "DASH"],
    coindelta: ["XRP", "ETH", "BCH"]
};


const ENDPOINTS_CONFIG_INT = {
    QUOINE_XRP: QUOINE_EP("XRP", "USD", 84),

    CEX_XRP_EUR: CEX_EP("XRP", "EUR"),
    CEX_DASH_EUR: CEX_EP("DASH", "EUR"),
    CEX_BCH_EUR: CEX_EP("BCH", "EUR"),
    CEX_XLM_EUR: CEX_EP("XLM", "EUR"),
    CEX_ETH_EUR: CEX_EP("ETH", "EUR"),
    CEX_XRP_USD: CEX_EP("XRP", "USD"),
    CEX_DASH_USD: CEX_EP("DASH", "USD"),
    CEX_BCH_USD: CEX_EP("BCH", "USD"),
    CEX_ETH_USD: CEX_EP("ETH", "USD")

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