module.exports = {
    context: {
        entryPoints: ["src/app.js"],
        bundle: true,
        sourcemap: true,
        logLevel: "info",
        // outfile: "dist/bundle/bundle.js",
        outdir: "dist/js",
    },
    serve: {
        port: 8000,
        servedir: "dist",
        // fallback: "dist/index.html",
    },
};