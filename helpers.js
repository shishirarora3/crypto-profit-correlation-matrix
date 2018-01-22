const https = require('https');
const notifier = require('node-notifier');
var cloudscraper = require('cloudscraper');

cloudscraper.get('http://website.com/', function(error, response, body) {
    if (error) {
        console.log('Error occurred');
    } else {
        console.log(body, response);
    }
});

module.exports = {
    get: function (obj, path) {
        console.log(obj,path);
        var r = path
            .split(/[\.\[\]]/)
            .filter(function (e) {
                return e !== "";
            })
            .reduce(
                function (res, e) {
                    return res?res[e]: res;
                },
                obj);
        return r;
    },
    fetch: function (url) {
        return new Promise(function (resolve, rej) {
            cloudscraper.request(url, function (error, res, body) {
                if (error) {
                    console.log('Error occurred');
                    console.log(JSON.stringify(error));
                    rej(error);
                }
                resolve(JSON.parse(body));
            });
        });

    },
    profit: function (TARGET_PROFIT, TRANSACTION_CHARGE, sell, buy, message) {
        console.log(sell, buy);
        var r = (sell - buy) * 100 / buy;
        var p = r - TRANSACTION_CHARGE;
        var profitFixed = p.toFixed(2);
        if (p > TARGET_PROFIT) {
            notifier.notify({
                title: 'Profit: '+ profitFixed +'%',
                message: message || ""
            });
        }

        return profitFixed;
    },
    print : function (endPoints, matrix) {

        return endPoints.reduce(function (previousValue, e) {
            return previousValue + e.name + '\t|\t';
        }, '\t\t') + '\n' + JSON.stringify(matrix)
            .replace(/[\[\]]{2}/g, '')
            .split(/\]\,\[/)
            .reduce(function (previousValue, currentValue, i) {
                return previousValue + currentValue + '\t|\n'
                    + (i < endPoints.length - 1 ? endPoints[i + 1].name : '') + '\t';
            }, endPoints[0].name + '\t')
            .replace(/\,/g, '\t|\t')
            .replace(/\"/g, "");
    }
};








