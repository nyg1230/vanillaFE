const path = require('path');

const rootPath = path.resolve(__dirname, "../");
const outputDir = path.resolve(rootPath, "../dist/");

module.exports = {
    entry: {},
    resolve: {
        alias: {
            main: `${rootPath}/app/main/js/`
        },
        fallback: {
            fs: false,
            constants: false,
            os: false,
            https: false,
            http: false,
            querystring: false,
            url: false,
            vm: false,
            zlib: false,
            net: false,
            tls: false,
            child_process: false
        }
    },
    output: {
        path: outputDir,
        filename: (pathData) => {
            return "[name].bundle.js"
        },
        chunkFilename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/
            }
        ]
    }
};
