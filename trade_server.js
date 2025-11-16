// Run this server in one terminal before starting the client/test-scripts

const http = require('http');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/trade') {
        let data = '';
        req.on('data', chunk => (data += chunk));
        req.on('end', () => {
            try {
                const body = JSON.parse(data);
                const { amount, currency } = body;
                if (currency !== 'testCCY' || typeof amount !== 'number') {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ status: 'error', msg: 'Invalid input' }));
                }
                //  else if (amount === 0.000003766) {
                //     res.statusCode = 500;
                //     res.end(JSON.stringify({ status: 'error', msg: 'Critical error' }));
                // } else if (amount <= 0 || amount > 0.000003999) {
                //     res.statusCode = 400;
                //     res.end(JSON.stringify({ status: 'rejected', msg: 'Out of bounds' }));
                // } 
                else {
                    res.statusCode = 200;
                    res.end(JSON.stringify({ status: 'executed', trade: { amount, currency } }));
                }
            } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ status: 'error', msg: 'Bad request' }));
            }
        });
    } else {
        res.statusCode = 404;
        res.end();
    }
});
server.listen(3001, () => console.log("Mock crypto server running at http://localhost:3001"));
