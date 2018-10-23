const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        'main': path.resolve(__dirname, './src/index.ts')
    },

    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.js'
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader']
            },
            {
                test: /\.html$/,
                use: 'raw-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    'raw-loader',
                    'sass-loader'
                ]
            }
        ]
    },

    resolve: {
        modules: [
            'node_modules'
        ],
        extensions: ['.ts', '.js']
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body'
        })
    ]
};
