//target Profit margin
const TARGET_PROFIT = require("./config/target").TARGET_PROFT_PERCENTAGE;
const END_POINT_CONFIG = require("./config/endpoints");
const HELPERS = require('./helpers');


const ENDPOINTS = END_POINT_CONFIG.ENDPOINTS;

setInterval(function () {
    Promise.all(ENDPOINTS.map(function (endPoint) {
        console.log(endPoint);
        return HELPERS.fetch(endPoint);
    })).then(function (res) {

        const profit_correlation_matrix = END_POINT_CONFIG.SELL_PRICE_PATH.map(
            function (sell, sellIndex) {
                return END_POINT_CONFIG.BUY_PRICE_PATH.map(function (buy, buyIndex) {
                    var sp,cp;
                    try{
                        sp = HELPERS.get(res[sellIndex], sell);
                        cp =  HELPERS.get(res[buyIndex], buy);
                    }catch (e){
                        console.error("buy", e);
                    }

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




