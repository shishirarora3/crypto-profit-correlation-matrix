const notifier = require('node-notifier');
var cloudscraper = require('cloudscraper');

/*function cmd_exec(cmd, args, cb_stdout, cb_end) {
    var spawn = require('child_process').spawn,
        child = spawn(cmd, args),
        me = this;
    me.exit = 0;  // Send a cb to set 1 when cmd exits
    me.stdout = "";
    child.stdout.on('data', function (data) { cb_stdout(me, data) });
    child.stdout.on('end', function () { cb_end(me) });
}
foo = new cmd_exec('netstat', ['-rn'],
    function (me, data) {me.stdout += data.toString();},
    function (me) {me.exit = 1;}
);
function log_console() {
    console.log(foo.stdout);
}
setTimeout(
    // wait 0.25 seconds and print the output
    log_console,
    250);*/


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
            message: message || "",
            wait: true,
            subtitle: "arbitrage",
            sound:`Basso`
        },
        function(err, response) {
            // Response is response from notification
            console.log({title, message});
        });
    },
    profit: function (TARGET_PROFIT, TRANSACTION_CHARGE, sell, buy) {
        var r = (sell - buy) * 100 / buy;
        var p = r - TRANSACTION_CHARGE; //6.5
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








