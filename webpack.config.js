const path = require('path');

module.exports = {
    entry: {
        'cli': path.resolve(__dirname, './src/cli.ts')
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader']
            }
        ]
    },

    resolve: {
        modules: [
            'node_modules'
        ],
        extensions: ['.ts', '.js']
    }
};