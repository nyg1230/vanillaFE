const path = require('path');
const cssModulesPlugin = require('esbuild-plugin-css-modules');
const esbuild = require("esbuild");

module.exports = {
    context: {
        entryPoints: ["src/js/index.js", "src/css/main.css"],
        bundle: true,
        sourcemap: true,
        logLevel: "info",
        // outfile: "dist/bundle/bundle.js",
        outdir: "dist",
        banner: {
            js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`,
        },
        alias: {
            "src/js": "js"
        },
        loader: {
            ".css": "text"
        },
        minify: true
    },
    serve: {
        port: 8000,
        servedir: "dist",
        // fallback: "dist/index.html",
    },
    sync: {
        entryPoints: ["src/css/main.css"],
        bundle: true,
        outdir: "dist/css",
        // outfile: "dist/css/_bundle.css",
        minify: true
    }
};