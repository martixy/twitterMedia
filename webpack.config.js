//Note: ESM (ES6 modules, i.e. import/export) in config requires using "--config-register esm" param for webpack
import path from 'path'
import fs from 'fs'
import pj2us from 'pj2us-transformer';
import CopyWebpackPlugin from 'copy-webpack-plugin'
import EventHooksPlugin from 'event-hooks-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const defaultConf = {
    name: 'default',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CleanWebpackPlugin(),
        new EventHooksPlugin({
            compile: () => {
                console.log('Copying config.');
                if (!fs.existsSync(path.resolve(__dirname, 'config/config.json'))) {
                    fs.copyFileSync(
                        path.resolve(__dirname, 'config/config.json.dist'),
                        path.resolve(__dirname, 'config/config.json')
                    )
                } else {
                    console.log('config.json exists, skipping copy.');
                }
            }
        }),
        new CopyWebpackPlugin([ {
        from: 'package.json',
        to: path.resolve(__dirname, 'dist') + '/local.user.js',
        transform: function(content, resourcePath) {
            return pj2us(content, path.resolve(__dirname, 'dist/main.js'));
        }
        }], { })
    ]
}

export default defaultConf
