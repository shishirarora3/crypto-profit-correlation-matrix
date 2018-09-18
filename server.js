//target Profit margin
const TARGET_PROFIT = require("./config/target").TARGET_PROFIT_PERCENTAGE;
const finalConf = require("./config/endpoints");
const HELPERS = require('./helpers');
const _ = require("lodash");
let final = finalConf();
let BTC = 0;
const TAKE_OUT_OF_INDIA = "Take out of India";
const BRING_BACK_TO_INDIA = "Bring back to India";
const BITF_BTC_US = "BITF_BTC_US";

final.then(
    function (END_POINT_CONFIG) {
    const ENDPOINTS = END_POINT_CONFIG.ENDPOINTS;
    const cb = function () {
        Promise.all(ENDPOINTS.map(function (endPoint) {
            return HELPERS.fetch(endPoint);
        })).then(function (res) {
            var net_profit = 0;
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
                            if (buy.name === BITF_BTC_US) {
                                BTC=cp*buy.ff;
                            }
                            profit = _resBuy.name === _resSell.name ||
                            _resBuy.crypto !== _resSell.crypto ? -999 : HELPERS.profit(
                                TARGET_PROFIT,
                                _resBuy.conv,
                                sp * (_resSell.ff? _resSell.ff: BTC),
                                cp * (_resBuy.ff? _resBuy.ff: BTC)
                            );

                            if (+profit > +max_profit) {
                                max_profit = profit;
                                max_profit_message = "Buy at " + _resBuy.name +
                                    " for " + cp + " & sell at "
                                    + _resSell.name + " for " + sp
                            }
                            return profit;
                        });
                    }
                );
                net_profit = net_profit + +max_profit;
                if (type === TAKE_OUT_OF_INDIA && net_profit > (process.env.THRES || 2)) {
                    HELPERS.notify("Max Profit: " + max_profit + ", NET PROFIT: " + net_profit, max_profit_message, type);
                    console.log({max_profit, net_profit, max_profit_message, type});
                }else{
                    //HELPERS.notify("Max Profit: " + max_profit, max_profit_message, type);
                    console.log({max_profit, max_profit_message, type});
                }

            };

            profit_correlation_matrix(END_POINT_CONFIG.SELLS, END_POINT_CONFIG.BUYS, BRING_BACK_TO_INDIA);
            profit_correlation_matrix(END_POINT_CONFIG.BUYS, END_POINT_CONFIG.SELLS, TAKE_OUT_OF_INDIA);
        }).catch(function (error) {
            console.log(error);
        });
    };

        cb();
    setInterval(cb, 100000);
});






