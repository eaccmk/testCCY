// Save as test_parallel.js
const http = require('http');

function sendTrade(amount) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: '/trade',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            timeout: 1000,
        };
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({ amount, status: res.statusCode, body: data }));
        });
        req.on('error', () => reject(amount));
        req.write(JSON.stringify({ amount, currency: 'testCCY' }));
        req.end();
    });
}

async function main() {
    const start = Date.now();
    const step = 0.000000001;
    const maxAmount = 0.0009999;
    const batchSize = 500; // Tune for your CPU

    let foundError = false;
    let currentAmount = 0.0;
    while (currentAmount <= maxAmount && !foundError) {
        const trades = [];
        for (let i = 0; i < batchSize && currentAmount <= maxAmount; i++) {
            trades.push(sendTrade(Number(currentAmount.toFixed(9))));
            currentAmount += step;
        }
        const results = await Promise.all(trades.map(p => p.catch(e => ({ error: true, amount: e }))));
        for (const resp of results) {
            if (resp.error) {
                console.log(`Network error at amount: ${resp.amount}`);
                foundError = true;
                break;
            }
            const body = JSON.parse(resp.body);
            if (body.status === 'error') {
                console.log(`Error at amount: ${resp.amount}, message: ${body.msg}`);
                foundError = true;
                break;
            }
        }
    }
    const end = Date.now();
    console.log(`Total time (parallel): ${end - start} ms`);
}

main();
