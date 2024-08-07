const path = require('path');

module.exports = {
    mode: 'production', // development
    entry: './src/index.js',
    output: {
        filename: 'race-game-library.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'RaceGameLibrary',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    }
};
