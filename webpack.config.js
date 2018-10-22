const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        'cli': path.resolve(__dirname, './src/cli.ts')
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader']
            },
            {
                test: /\.template$/,
                use: ['raw-loader']
            }
        ]
    },

    mode: 'production',

    target: 'node',

    resolve: {
        modules: [
            'node_modules'
        ],
        extensions: ['.ts', '.js']
    },

    plugins: [
        new webpack.BannerPlugin({
            banner: '#!/usr/bin/env node',
            raw: true
        })
    ]
};
