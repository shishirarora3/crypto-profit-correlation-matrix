const notifier = require('node-notifier');
var cloudscraper = require('cloudscraper');



module.exports = {
    get: function (obj, path) {

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
    parseJSON: function(obj, url){
        try{
            return JSON.parse(obj);
        }catch(e)
        {
         console.log(e, url);
         }
     },
    fetch: function (url) {
        const that= this;
        return new Promise(function (resolve, rej) {
            cloudscraper.request(url, function (error, res, body) {
                if (error) {
                    console.log('Error occurred: '+JSON.stringify(url));
                    console.log(JSON.stringify(error));
                    rej(error);
                }
                resolve(that.parseJSON(body, url));
            });
        });
    },
    notify: function (title,message ) {
        notifier.notify({
            title: title,
            message: message || ""
        });
    },
    profit: function (TARGET_PROFIT, TRANSACTION_CHARGE, sell, buy) {
        var r = (sell - buy) * 100 / buy;
        var p = r - TRANSACTION_CHARGE;
        var profitFixed = p.toFixed(2);
        return profitFixed;
    },
    print : function (buys, endPoints, matrix) {

        return buys.reduce(function (previousValue, e) {
            return previousValue + e.name + '\t|\t';
        }, '\t\t') + '\n' + JSON.stringify(matrix)
            .replace(/[\[\]]{2}/g, '')
            .split(/\]\,\[/)
            .reduce(function (previousValue, currentValue, i) {
                return previousValue + currentValue + '\t|\n'
                    + (i < endPoints.length - 1 ? endPoints[i + 1].name : '') + '\t';
            }, endPoints[0].name + '\t')
            .replace(/\,/g, '\t\t|\t')
            .replace(/\"/g, "");
    }
};








