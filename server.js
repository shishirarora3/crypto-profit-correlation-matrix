//target Profit margin
const TARGET_PROFIT = require("./config/target").TARGET_PROFIT_PERCENTAGE;
const END_POINT_CONFIG = require("./config/endpoints");
const HELPERS = require('./helpers');


const ENDPOINTS = END_POINT_CONFIG.ENDPOINTS;
const TRANSACTION_CHARGES = END_POINT_CONFIG.TRANSACTION_CHARGES;


const cb = function(){
    Promise.all(ENDPOINTS.map(function (endPoint) {
        return HELPERS.fetch(endPoint);
    })).then(function (res) {
        var max_profit = 0;
        var max_profit_message = "NA";
        const profit_correlation_matrix = END_POINT_CONFIG.SELL_PRICE_PATH.map(
            function (sell, sellIndex) {
                return END_POINT_CONFIG.BUY_PRICE_PATH.map(function (buy, buyIndex) {
                    var sp,cp,profit;
                    var _resSell = res[sellIndex];
                    var _resBuy = res[buyIndex];

                    sp = HELPERS.get(_resSell, sell);
                    cp =  HELPERS.get(_resBuy, buy);
                    /*if(buy === "[5].XLM.sellPrice"){
                        console.log(sp, cp, buyIndex)
                    }*/
                    profit =  ENDPOINTS[buyIndex].name === ENDPOINTS[sellIndex].name ||
                    ENDPOINTS[buyIndex].crypto !== ENDPOINTS[sellIndex].crypto ? (0).toFixed(2) : HELPERS.profit(
                        TARGET_PROFIT,
                        TRANSACTION_CHARGES[buyIndex],
                        sp * END_POINT_CONFIG.CONVERSION_FACTORS[sellIndex],
                        cp * END_POINT_CONFIG.CONVERSION_FACTORS[buyIndex]
                    );

                    if( profit>max_profit ){
                        max_profit = profit;
                        max_profit_message = "Buy at "+ ENDPOINTS[buyIndex].name +
                            " for "+  cp + " & sell at "
                            + ENDPOINTS[sellIndex].name + " for "+ sp
                    }
                    return profit;
                });
            }
        );
        HELPERS.notify("Max Profit: " + max_profit, max_profit_message);
        console.log(HELPERS.print(ENDPOINTS, profit_correlation_matrix))
    }).catch(function (error) {
        console.log(error);
    });
};

cb();
setInterval(cb, 100000);




