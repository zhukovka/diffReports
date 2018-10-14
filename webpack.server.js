const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        server: './src/server.ts',
    },

    target: 'node',

    externals: [nodeExternals()],

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    }
};