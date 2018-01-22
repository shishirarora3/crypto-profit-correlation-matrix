//target Profit margin
const TARGET_PROFIT = require("./config").TARGET_PROFT_PERCENTAGE;
const END_POINT_CONFIG = require("./endpoints");
const HELPERS = require('./helpers');


const ENDPOINTS = END_POINT_CONFIG.ENDPOINTS;

setInterval(function () {
    Promise.all(ENDPOINTS.map(function (endPoint) {
        return HELPERS.fetch(endPoint)
    })).then(function (res) {

        const profit_correlation_matrix = END_POINT_CONFIG.SELL_PRICE_PATH.map(
            function (sell, sellIndex) {
                return END_POINT_CONFIG.BUY_PRICE_PATH.map(function (buy, buyIndex) {
                    var sp = HELPERS.get(res[sellIndex], sell);
                    var cp =  HELPERS.get(res[buyIndex], buy);
                    return HELPERS.profit(
                        TARGET_PROFIT,
                        sp * END_POINT_CONFIG.CONVERSION_FACTORS[sellIndex],
                        cp * END_POINT_CONFIG.CONVERSION_FACTORS[buyIndex],
                        "Buy at "+ ENDPOINTS[buyIndex].name +
                        " for "+  cp + " & sell at "
                        + ENDPOINTS[sellIndex].name + " for "+ sp
                    );
                });
            }
        );
        console.log(HELPERS.print(ENDPOINTS, profit_correlation_matrix))
    }).catch(function (error) {
        console.log(error);
    });
}, 5000);




