const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/lightApi',
        createProxyMiddleware({
            target: 'http://localhost:8100', 
            changeOrigin: true
        })
    );   
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8080', 
            changeOrigin: true
        })
    ); 
};
