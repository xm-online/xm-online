const PROXY_CONFIG = [
    {
        context: [
            "/v2",
            "/otp",
            "/management",
            "/api",
            "/uaa",
            "/config/v2",
            "/config/api",
            "/entity/v2",
            "/entity/api",
            "/dashboard/v2",
            "/dashboard/api",
            "/timeline/v2",
            "/timeline/api",
            "/balance/v2",
            "/balance/api",
            "/scheduler",
            "/websocket",
            "/swagger-ui",
            "/swagger-resources",
            "/wallet",
            "/zendesk",
            "/ldb",
            "/document/api",
            "/communication-bulk/ws"
        ],
        target: "http://xm.test.xm-online.com.ua",
        secure: false,
        changeOrigin: true,
        logLevel: "debug"
    }
];

module.exports = PROXY_CONFIG;
