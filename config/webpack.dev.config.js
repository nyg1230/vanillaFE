const path = require('path');
const WM = require("webpack-merge");
const common = require("./webpack.common.js");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootPath = path.resolve(__dirname, "../");
const appPath = `${rootPath}/src`;
const staticPath = `${appPath}/main`;

module.exports = (env, options) => {
    const config = WM.merge(common, {
        mode: "development",
        entry: `${staticPath}/app.js`,
        output: {
            filename: "[name].[chunkhash].js",
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
            devMiddleware: {
                publicPath: "/"
            }
        },
        module: {
            rules: []
        },
        devtool: "inline-source-map",
        plugins: [
            new HtmlWebpackPlugin({
                title: "Development",
                filename: "index.html",
                publicPath: "./",
                base: "/",
                template: `${appPath}/index.html`,
                showErrors: true
            }),
        ]

    });

    return config;
};
