export default {
    pwa: {
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            swSrc: "./src/service-worker.js"
        }
    }
}