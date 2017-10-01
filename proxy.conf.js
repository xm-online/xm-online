const PROXY_CONFIG = [
    {
        context: [
            "/management",
            "/uaa",
            "/api",
            "/v2",
            "/config/api",
            "/config/v2",
            "/entity/api",
            "/entity/v2",
            "/dashboard/api",
            "/dashboard/v2",
            "/timeline/api",
            "/timeline/v2",
            "/websocket",
            "/swagger-ui",
            "/swagger-resources"
        ],
        target: "http://localhost:8080",
        secure: false,
        changeOrigin: true,
        logLevel: "debug"
    }
];

module.exports = PROXY_CONFIG;
