const {spawn} = require('child_process');

//const child2 = spawn('ARBITRAGE=true node server.js');
const child = spawn('node server.js', {
    stdio: 'inherit',
    shell: true,
    env: {ARBITRAGE: true}
});


const child2 = spawn('node server.js', {
    stdio: 'inherit',
    shell: true
});






