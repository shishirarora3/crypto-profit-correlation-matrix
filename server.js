const https = require('https');


const CEX_EUR = {hostname: "cex.io", path: "/api/ticker/XRP/EUR", name: "CEX_EUR"};
const CEX_USD = {hostname: "cex.io", path: "/api/ticker/XRP/USD", name: "CEX_USD"};
const BITBNS = {hostname: "bitbns.com", path: "/order/getTickerAll", name: "BITBNS"};
const KOINEX = {
    hostname: "koinex.in", path: "/api/dashboards/ticker",
//"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
    //"Accept": "application/json",
    //"Accept-Encoding": "gzip, deflate, br",
    //"Accept-Language": "en-US,en;q=0.9,ms;q=0.8",
    //"Origin": "https://koinex.in",
    //"Referer": "https://koinex.in/exchange/ripple",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
    "Cookie": "__cfduid=d88ba397e42c4270573b50a46e11bb7751510782180; ext_name=jaehkpjddfdgiiefcnhahapilbejohhj; _ga=GA1.2.806695738.1510782187; chatRole=standard; txnid=3aad5b02-e57e-4033-b18e-9a13f0dd7cab; exchange_type=RIPPLE; target_currency=ripple; _gid=GA1.2.606203349.1516481854; cf_clearance=407482883eb35384f5e47324282c607431230dea-1516579334-1800; AWSALB=lPPddkYUkXTeeyVP5LyFYaIBeQv4fKiEM7isjuYwbffbkvOxnUvOt+uhEv25vXEaEBh86gEJZr8ie68QKctmrN/yhpbZYI8NADeOnadcc+CC95id29WFYmTTW2V3; _koinex-frontend_session=bmxXNnR2V3J0RDBXUGJNMFB5SWluVVRsby9NdWdvTjFmbnZEbGNoclBIcjFuSGdpekR1QTBPNXZmMVpXcFBma2lkOHlwaEh4NUx3cXh2SU9iWmg5ejJEWmJPeHZycm1NNE1mN1NLUGtaaG1jOW53TDZkdTZvaHk1Y0lXU00yUmlVcG5kazlpc0hBcFlBR0tSNFI1SzVBPT0tLWxpc0xiU2J1M0QzbERrOWJJZlFtSEE9PQ%3D%3D--6a79f5adac67303e2e2d5dfc0135cbd0631bc3dc"
};

const endPoints = [
    CEX_USD,
    CEX_EUR,
    BITBNS,
    //KOINEX
];
const SELL_PRICE_PATH = ["ask", "ask", "[1].XRP.buyPrice",
    //"XRP"
];
const BUY_PRICE_PATH = ["bid", "bid", "[1].XRP.sellPrice",
    //"XRP"
];
const EURO_TO_INR = 78.33;
const USD_TO_INR = 63.83;
const CONVERSION_FACTORS = [USD_TO_INR, EURO_TO_INR, 1,
    1];


const get = function (obj, path) {
    //console.log(obj,path);
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
};
const fetch = function (url) {
    return new Promise(function (resolve, rej) {
        https.get(url, function (res) {
            res.setEncoding('utf8');
            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
            //console.log('res: ' + JSON.stringify(res.headers));
            res.on('data', function (chunk) {
                //console.log(chunk);
                var result = JSON.parse(chunk);
                resolve(result);
            });
        }).end();
    });

};

const profit = function (sell, buy) {
    //console.log(sell, buy);
    var r = (sell - buy) * 100 / buy;
    return r.toFixed(2)+'%';
};


/**
 *  profit correllation matrix
 *             CEX-USD CEX-EUR KOINEX BITBNS
 *     CEX-USD   0
 *     CEX-EUR
 *     KOINEX
 *     BITBNS
 */


const print = function (matrix) {

    return endPoints.reduce(function (previousValue, e) {
        return previousValue + e.name + '\t|\t';
    }, '\t\t')+ '\n' + JSON.stringify(matrix)
        .replace(/[\[\]]{2}/g, '')
        .split(/\]\,\[/)
        .reduce(function (previousValue, currentValue, i) {
            return  previousValue + currentValue + '\t|\n'
                + (i<endPoints.length - 1 ? endPoints[i+1].name : '') + '\t';
        },endPoints[0].name+'\t')
        .replace(/\,/g, '\t|\t')
        .replace(/\"/g,"");
};

setInterval(function(){
    Promise.all(endPoints.map(function (endPoint) {
        return fetch(endPoint)
    })).then(function (res) {

        const profit_correlation_matrix = SELL_PRICE_PATH.map(
            function (sell, sellIndex) {
                return BUY_PRICE_PATH.map(function (buy, buyIndex) {
                    return profit(get(res[sellIndex], sell) * CONVERSION_FACTORS[sellIndex],
                        get(res[buyIndex], buy) * CONVERSION_FACTORS[buyIndex]
                    );
                });
            }
        );
        console.log(print(profit_correlation_matrix))
    }).catch(function (error) {
        console.log(error);
    });
},5000);




