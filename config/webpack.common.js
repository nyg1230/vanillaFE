const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require('path');

const rootPath = path.resolve(__dirname, "../");
const outputDir = path.resolve(rootPath, "../dist/");

module.exports = {
    entry: {},
    resolve: {
        alias: {
            main: `${rootPath}/app/main/js/`,
            css: `${rootPath}/app/main/css/`
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
            },
            {
                test: /\.css$/,
                use: ["to-string-loader", "css-loader"],
                exclude: [/node_modules/]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[name].[id].css"
        }),
    ]
};
