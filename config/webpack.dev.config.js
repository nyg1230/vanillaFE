const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const staticPath = "/app/js/"

module.exports = {
    mode: "development",
    entry: '/app/js/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        client: {
            progress: true,
            overlay: true
        },
        hot: true,
        host: "0.0.0.0",
        port: 8080,
        static: {
            directory: `${staticPath}`
        },
    },
    devtool: "inline-source-map",
    plugins: [
        new HtmlWebpackPlugin({
            template: `${__dirname}/../app/index.html`,
        }),
    ],
};
