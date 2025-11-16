# testCCY

Small project with a trade server and two test scripts (sequential and parallel).

Prerequisites
- Node.js (v14+ recommended)

Files
- `trade_server.js` - the server that accepts POST /trade
- `test_sequential.js` - sends trades sequentially
- `test_parallel.js` - sends trades in parallel

How to run

1. Install dependencies (if any):

```bash
# no dependencies required for the provided files, but run npm init if you want package.json
# if you add dependencies later, run:
# npm install
```

2. Start the server (in one terminal):

```bash
node trade_server.js
```

3. Run the sequential test (in another terminal):

```bash
node test_sequential.js
```

4. Run the parallel test:

```bash
node test_parallel.js
```

Notes
- Adjust server port in the test scripts if your server listens on a different port.
- The tests are simple Node.js scripts using the built-in `http` module; no test framework is required.
