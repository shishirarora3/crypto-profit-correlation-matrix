const https = require('https');
const notifier = require('node-notifier');
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
                    return res[e];
                },
                obj);
        //console.log(r);
        return r;
    },
    fetch: function (url) {
        return new Promise(function (resolve, rej) {
            https.get(url, function (res) {
                res.setEncoding('utf8');
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                console.log('res: ' + JSON.stringify(res.headers));
                res.on('data', function (chunk) {
                    //console.log(chunk);
                    var result = JSON.parse(chunk);
                    resolve(result);
                });
            }).end();
        });

    },
    profit: function (TARGET_PROFIT, sell, buy, message) {
        //console.log(sell, buy);
        var r = (sell - buy) * 100 / buy;
        var p = r.toFixed(2) + '%';
        if (r > TARGET_PROFIT) {
            notifier.notify({
                title: 'Profit: '+ p ,
                message: message || ""
            });
        }

        return p;
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


/**
 *  profit correllation matrix
 *             CEX-USD CEX-EUR KOINEX BITBNS
 *     CEX-USD   0
 *     CEX-EUR
 *     KOINEX
 *     BITBNS
 */





