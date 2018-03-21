const _ = require("lodash");
let index = 0;
const ffMap = {
    EUR: 79.88,
    USD: 65.24,
    JPY: 0.58
};

const CEX_EP = function(crypto, fiat){
    const name = "C_"+crypto+"_"+fiat;
    const buy_eligible = false;
    const sell_eligible = true;
    return {
        url: "http://cex.io/api/ticker/"+crypto+"/"+fiat,
        name: name.slice(0,11),
        method: 'GET',
        encoding: "utf8",
        crypto: crypto,
        sell: "bid",
        buy: "ask",
        ff: ffMap[fiat],
        conv: 6.5,
        index: index++,
        buy_eligible: buy_eligible,
        sell_eligible: sell_eligible,
    };
};

const BITF_EP = function(crypto, fiat){
    const name = "BITF_"+crypto+"_"+fiat;
    const buy_eligible = false;
    const sell_eligible = true;
    return {
        url: "https://api.bitfinex.com/v2/ticker/t"+crypto+fiat,
        name: name.slice(0,11),
        method: 'GET',
        encoding: "utf8",
        crypto: crypto,
        sell: "[0]",
        buy:"[2]",
        ff: ffMap[fiat],
        conv: 6.5,
        buy_eligible: buy_eligible,
        sell_eligible: sell_eligible,
        index: index++
    };
};

const BITBNS_CONF = {
    BTC: 0,
    XRP: 1,
    NEO:2,
    GAS:3,
    ETH: 4,
    XLM: 5,
    LTC: 8,
    DASH: 10,
    DOGE: 11,
    BCH : 12,
    TRX:14
};
const BITBNS_EP = function(crypto){
    const name = "BITB_"+crypto;
    const buy_eligible = true;
    const sell_eligible = false;
    return {
        url: "http://bitbns.com/order/getTickerAll",
        name: name.slice(0,11),
        method: 'GET',
        encoding: "utf8",
        crypto: crypto,
        sell: "["+BITBNS_CONF[crypto]+"]."+crypto+".buyPrice",
        buy: "["+BITBNS_CONF[crypto]+"]."+crypto+".sellPrice",
        conv: 0.5,
        ff: 1,
        buy_eligible: buy_eligible,
        sell_eligible: sell_eligible,
        index: index++
    };
};

const ENDPOINTS_CONFIG = {

    CEX_XRP_EUR: CEX_EP("XRP", "EUR"),
    CEX_XLM_EUR: CEX_EP("XLM", "EUR"),
    CEX_BCH_EUR: CEX_EP("BCH", "EUR"),


    CEX_XRP_USD: CEX_EP("XRP", "USD"),
    CEX_BCH_USD: CEX_EP("BCH", "USD"),
    CEX_XLM_USD: CEX_EP("XLM", "USD"),



    BITF_XRP_USD: BITF_EP("XRP", "USD"),
    BITF_BCH_USD: BITF_EP("BCH", "USD"),
    BITF_NEO_USD: BITF_EP("NEO", "USD"),
    BITF_LTC_USD: BITF_EP("LTC", "USD"),
    BITF_ETH_USD: BITF_EP("ETH", "USD"),
    BITF_TRX_USD: BITF_EP("TRX", "USD"),
    BITF_DSH_USD: BITF_EP("DSH", "USD"),


    BITBNS_XRP: BITBNS_EP("XRP"),
    BITBNS_LTC: BITBNS_EP("LTC"),
    BITBNS_BCH: BITBNS_EP("BCH"),
    BITBNS_ETH: BITBNS_EP("ETH"),
    BITBNS_NEO: BITBNS_EP("NEO"),
    BITBNS_TRX: BITBNS_EP("TRX"),
    BITBNS_DASH: BITBNS_EP("DASH"),
    BITBNS_XLM: BITBNS_EP("XLM")
};







const ENDPOINTS = _.values(ENDPOINTS_CONFIG);


const SELLS = ENDPOINTS.filter(function(ep){
    return ep.sell_eligible;
});

const SELL_PRICE_PATH = SELLS.map(function(ep){
    return ep.sell;
});


const BUYS = ENDPOINTS.filter(function(ep){
    return ep.buy_eligible;
});

const BUY_PRICE_PATH = BUYS.map(function(ep){
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
    BUYS: BUYS,
    SELLS: SELLS,
    SELL_PRICE_PATH: SELL_PRICE_PATH,
    BUY_PRICE_PATH: BUY_PRICE_PATH,
    CONVERSION_FACTORS: CONVERSION_FACTORS,
    TRANSACTION_CHARGES: TRANSACTION_CHARGES
};

console.log(finalConf);

module.exports = finalConf;