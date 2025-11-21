// Generated using webpack-cli https://github.com/webpack/webpack-cli

const isProduction         = process.env.NODE_ENV == 'production';
const fs                   = require('fs');
const path                 = require('path');
const resolve              = dir => path.resolve(__dirname, dir);
const webpack              = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin    = require('html-webpack-plugin');
const SpriteLoaderPlugin   = require('svg-sprite-loader/plugin');
const CopyWebpackPlugin    = require('copy-webpack-plugin');
const stylesHandler        = 'style-loader';

//===============================================
const version_h = 0;
const version_l = 45;
//===============================================

module.exports = async() => {
    return {
        mode : 'development',
        target: 'electron-main',
        resolve: {
            alias: {
                '@'      : resolve('src'),
                '@common': resolve('src/common'),
                '@@'     : resolve('src/interactive/craft3d'),
            }
        },
    
        entry: {
            'index'          : './src/interactive/craft3d/index.js',
            'editor-preload' : './src/interactive/craft3d/interactive/editor/_preload.js',
        },
    
        output: {
            path: path.resolve(__dirname, 'dist/craft3d'),
            filename: '[name].js',
        },
    
        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        },
    
        
        plugins: [
            // 定义全局环境变量
            new webpack.DefinePlugin({
                __BUILD_PROJ__   : JSON.stringify("CRAFT3D"),
                __BUILD_PROJ_WG__: JSON.stringify(true),

                __BUILD_TIME__   : JSON.stringify(new Date().toISOString()),
                __VERSION_H__    : version_h,
                __VERSION_L__    : version_l,
            }),
        ],
    
        module: {
            rules: [
            ]
        },
    };
};
