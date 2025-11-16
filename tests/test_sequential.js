// Save as test_sequential.js
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
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });

        req.on('error', reject);
        req.write(JSON.stringify({ amount, currency: 'testCCY' }));
        req.end();
    });
}

(async function main() {
    const start = Date.now();
    const step = 0.000000001;
    for (let amount = 0.0; amount <= 0.0009999; amount += step) {
        amount = Number(amount.toFixed(9)); // Ensure precision
        const resp = await sendTrade(amount);
        const respBody = JSON.parse(resp.body);

        if (respBody.status === 'error') {
            console.log(`Error at amount: ${amount}, message: ${respBody.msg}`);
            break;
        }
        // Uncomment to log each trade result:
        console.log(`Amount: ${amount} -> ${respBody.status}`);
    }
    const end = Date.now();
    console.log(`Total time (sequential): ${end - start} ms`);
})();
