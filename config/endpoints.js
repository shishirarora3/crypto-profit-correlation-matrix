const _ = require("lodash");
const HELPERS = require('../helpers');


let index = 0;
let ffMap = {};
let BITBNS_CONF = {};


const finalConf = function (rej, res) {
    
    return Promise.all(
        [
            HELPERS.fetch({
                url: "http://free.currencyconverterapi.com/api/v3/convert?q=EUR_INR&compact=ultra",
                method: 'GET',
                encoding: "utf8"
            }),
            HELPERS.fetch({
                    url: "http://free.currencyconverterapi.com/api/v3/convert?q=USD_INR&compact=ultra",
                    method: 'GET',
                    encoding: "utf8"
                }
            ),
            HELPERS.fetch({
                url: "http://bitbns.com/order/getTickerAll",
                method: 'GET',
                encoding: "utf8"
            }),
            HELPERS.fetch({
                url: "https://api.bitfinex.com/v1/symbols",
                method: 'GET',
                encoding: "utf8"
            })
        ]
    ).then(function (res) {
        ffMap.EUR = res[0].EUR_INR;
        ffMap.USD = res[1].USD_INR;
        const bitbnsCryptos = [];
        BITBNS_CONF = _.reduce(res[2], function (result, entry, index) {
            if(process.env.FILTER){
                console.log("filtering........", "XRP", "XLM", "NEO", "GAS", "BTC", "ETH", "ONT", "BCH", "XVG", "ADA");
                if(_.includes(["XRP", "XLM", "NEO", "GAS", "BTC", "ETH", "ONT", "BCH", "XVG", "ADA"], _.keys(entry)[0])){
                    result[_.keys(entry)[0]] = index;
                    bitbnsCryptos.push(_.keys(entry)[0]);
                }
            }else{
                result[_.keys(entry)[0]] = index;
                bitbnsCryptos.push(_.keys(entry)[0]);
            }
            return result;
        }, {});
        
        const bitfCryptos = res[3].filter(function (pair) {
            return pair.endsWith("usd");
        }).map(function (pair) {
            return pair.replace("usd", "").toUpperCase();
        });
        
        const BITF_EP = function (crypto, fiat) {
            const name = "BITF_" + crypto + "_" + fiat;
            const buy_eligible = true;
            return {
                url: "https://api.bitfinex.com/v2/ticker/t" + crypto + fiat,
                name: name.slice(0, 11),
                method: 'GET',
                encoding: "utf8",
                crypto: crypto,
                sell: "[0]",
                buy: "[2]",
                ff: ffMap[fiat],
                conv: 0,
                buy_eligible: buy_eligible,
                sell_eligible: !buy_eligible,
                index: index++
            };
        };
        
        
        const BITBNS_EP = function (crypto) {
            const name = "BITB_" + crypto;
            const buy_eligible = false;
            return {
                url: "http://bitbns.com/order/getTickerAll",
                name: name.slice(0, 11),
                method: 'GET',
                encoding: "utf8",
                crypto: crypto,
                sell: "[" + BITBNS_CONF[crypto] + "]." + crypto + ".buyPrice",
                buy: "[" + BITBNS_CONF[crypto] + "]." + crypto + ".sellPrice",
                conv: 0,
                ff: 1,
                buy_eligible: buy_eligible,
                sell_eligible: !buy_eligible,
                index: index++
            };
        };
        
        let ENDPOINTS_CONFIG = {};
        
        ENDPOINTS_CONFIG = _.assign(ENDPOINTS_CONFIG, _.reduce(bitbnsCryptos, function (r, crypto) {
                r[`BITBNS_${crypto}`] = BITBNS_EP(crypto);
                return r;
            }, {}),
            _.reduce(bitfCryptos, function (r, crypto) {
                r[`BITF_${crypto}_USD`] = BITF_EP(crypto, "USD");
                return r;
            }, {})
        );
        const ENDPOINTS = _.values(ENDPOINTS_CONFIG);
        
        
        const SELLS = ENDPOINTS.filter(function (ep) {
            return ep.sell_eligible;
        });
        
        const SELL_PRICE_PATH = SELLS.map(function (ep) {
            return ep.sell;
        });
        
        
        const BUYS = ENDPOINTS.filter(function (ep) {
            return ep.buy_eligible;
        });
        
        const BUY_PRICE_PATH = BUYS.map(function (ep) {
            return ep.buy;
        });
        
        const CONVERSION_FACTORS = ENDPOINTS.map(function (ep) {
            return ep.ff;
        });
        
        const TRANSACTION_CHARGES = ENDPOINTS.map(function (ep) {
            return ep.conv;
        });
        
        return {
            ENDPOINTS: ENDPOINTS,
            BUYS: BUYS,
            SELLS: SELLS,
            SELL_PRICE_PATH: SELL_PRICE_PATH,
            BUY_PRICE_PATH: BUY_PRICE_PATH,
            CONVERSION_FACTORS: CONVERSION_FACTORS,
            TRANSACTION_CHARGES: TRANSACTION_CHARGES
        }
    }).catch(function (err) {
        console.error(err);
    });
    
    
};


module.exports = finalConf;