//target Profit margin
const TARGET_PROFIT = require("./config/target").TARGET_PROFIT_PERCENTAGE;
const finalConf = require("./config/endpoints");
const HELPERS = require('./helpers');
const _ = require("lodash");

finalConf().then(function (END_POINT_CONFIG) {
    const ENDPOINTS = END_POINT_CONFIG.ENDPOINTS;
    const TRANSACTION_CHARGES = END_POINT_CONFIG.TRANSACTION_CHARGES;
    const cb = function () {
        Promise.all(ENDPOINTS.map(function (endPoint) {
            return HELPERS.fetch(endPoint);
        })).then(function (res) {
    
            var profit_correlation_matrix = function (from, to, type) {
                var max_profit = -999;
                var max_profit_message = "NA";
                from.map(
                    function (sell) {
                        var sellIndex = sell.index;
                        return to.map(function (buy) {
                            var buyIndex = buy.index;
                            var sp, cp, profit;
                            var _resSell = res[sellIndex];
                            var _resBuy = res[buyIndex];
                    
                            sp = HELPERS.get(_resSell, sell.sell);
                            cp = HELPERS.get(_resBuy, buy.buy);
                            if (_.isNaN(+sp) || _.isNaN(+cp)) {
                                return 0;
                            }
                            profit = ENDPOINTS[buyIndex].name === ENDPOINTS[sellIndex].name ||
                            ENDPOINTS[buyIndex].crypto !== ENDPOINTS[sellIndex].crypto ? -999 : HELPERS.profit(
                                TARGET_PROFIT,
                                TRANSACTION_CHARGES[buyIndex],
                                sp * END_POINT_CONFIG.CONVERSION_FACTORS[sellIndex],
                                cp * END_POINT_CONFIG.CONVERSION_FACTORS[buyIndex]
                            );
                    
                            if (+profit > +max_profit) {
                                max_profit = profit;
                                max_profit_message = "Buy at " + ENDPOINTS[buyIndex].name +
                                    " for " + cp + " & sell at "
                                    + ENDPOINTS[sellIndex].name + " for " + sp
                            }
                            return profit;
                        });
                    }
                );
                if(process.env.THRES){
                    max_profit > process.env.THRES && HELPERS.notify("Max Profit: " + max_profit, max_profit_message, type);
                }else{
                    HELPERS.notify("Max Profit: " + max_profit, max_profit_message, type);
                }

                
                console.log({max_profit, max_profit_message, type});
            };
            profit_correlation_matrix(END_POINT_CONFIG.SELLS, END_POINT_CONFIG.BUYS, "Bring back to India");
            profit_correlation_matrix(END_POINT_CONFIG.BUYS, END_POINT_CONFIG.SELLS, "Take out of India");
        }).catch(function (error) {
            console.log(error);
        });
    };
    
    cb();
    setInterval(cb, 100000);
});






