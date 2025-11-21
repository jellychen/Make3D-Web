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

class ScriptCharsetPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap('CharsetPlugin', (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
                'CharsetPlugin',
                (data, cb) => {
                    data.assetTags.scripts.forEach((script) => {
                        script.attributes.charset = 'utf-8'; // 添加 charset 属性
                    });
                    cb(null, data);
                }
            );
        });
    }
}

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & 0xffffffff; // 强制为无符号 32 位整数
    }
    return hash;
}

module.exports = async() => {
    return {
        mode : 'development',
        resolve: {
            alias: {
                '@'             : resolve('src'),
                '@common'       : resolve('src/common'),
                '@assets'       : resolve('src/assets'),
                '@ux'           : resolve('src/core/ux'),
                '@core'         : resolve('src/core'),
                '@misc'         : resolve('src/misc'),
                '@editor'       : resolve('src/editor'),
                '@embed'        : resolve('src/embed'),
                '@xthree'       : resolve('src/core/xthree'),
            }
        },
    
        entry: {
            "404"                   :   './src/interactive/dcc/404/app.js',
            index                   :   './src/interactive/dcc/index/app.js',
            editor                  :   './src/interactive/dcc/editor/app.js',
            supabase_auth           :   './src/interactive/dcc/supabase/auth.js',
            supabase_auth_redirected:   './src/interactive/dcc/supabase/auth-redirected.js',
            refresh_vip             :   './src/interactive/dcc/refresh-vip/app.js',
            accreator               :   './src/interactive/dcc/accreator/app.js',
            mockups                 :   './src/interactive/dcc/mockups/app.js',
            keyshot                 :   './src/interactive/dcc/keyshot/app.js',
            repairman               :   './src/interactive/dcc/repairman/app.js',
        },
    
        output: {
            path: path.resolve(__dirname, 'dist/dcc'),
            filename: 'assets/[name].js?[chunkhash]',
            chunkFilename: 'assets/[name].js?[chunkhash]',
        },
    
        devServer: {
            server: {
                type: 'https',
                options: {
                    key: fs.readFileSync(path.join(__dirname, 'ca/localhost+1-key.pem')),
                    cert: fs.readFileSync(path.join(__dirname, 'ca/localhost+1.pem')),
                },
            },

            static : {
                directory: path.join(__dirname, 'static-assets'),
            },
    
            historyApiFallback: true,
            allowedHosts: 'all',
    
            open: false,
            host: 'localhost',
            compress: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Cross-Origin-Opener-Policy": "same-origin",
                "Cross-Origin-Embedder-Policy": "require-corp",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
            }
        },
    
        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        },
    
        
        plugins: [
            // 定义全局环境变量
            new webpack.DefinePlugin({
                __BUILD_PROJ__             : JSON.stringify("DCC"),
                __BUILD_PROJ_DCC__         : JSON.stringify(true),

                __MAX_CONCURRENCY__        : JSON.stringify(6),     // 强制只能使用不大于6个线程
            
                __BUILD_TIME__             : JSON.stringify(new Date().toISOString()),
                __API_BASE_URL__           : JSON.stringify("https://api.make3d.online"),
                __VERSION_H__              : version_h,
                __VERSION_L__              : version_l,

                __DEV_DEBUG__              : !isProduction,
                // __DEV_LOG_PERFORMANCE__ : !isProduction,
                __DEV_LOG_PERFORMANCE__    : false,
                __PRODUCTION_UI__          : true,
                __IF_WEBGPU_FORCE_WEBGL20__: true,
            }),

            // 拷贝
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'src/assets/draco/'),
                        to  : 'assets/draco/',
                    },
                ],
            }),
    
            // page
            // 404
            new HtmlWebpackPlugin({
                template: './html-tpl/dcc/404.html',
                chunks: ['404'],
                filename: '404.html',
                scriptLoading: 'blocking',
                inject: 'body',
                minify: {
                    collapseWhitespace: true,       // 干掉空格
                    removeComments: true,           // 干掉注释
                    removeAttributeQuotes: true,    // 干掉双引号
                    removeEmptyAttributes: true     // 干掉空属性
                },
            }), 
            
            // page
            // index.html
            new HtmlWebpackPlugin({
                title: 'Make3D',
                template: './html-tpl/dcc/index.html',
                chunks: ['index'],
                filename: 'index.html',
                meta: {
                    charset: 'UTF-8', // 设置字符编码
                },
                scriptLoading: 'blocking',
                inject: 'body',
                minify: {
                    collapseWhitespace: true,       // 干掉空格
                    removeComments: true,           // 干掉注释
                    removeAttributeQuotes: true,    // 干掉双引号
                    removeEmptyAttributes: true     // 干掉空属性
                }
            }),


            // page
            // editor.html == workbench.html
            new HtmlWebpackPlugin({
                title: 'Make3D',
                template: './html-tpl/dcc/workbench.html',
                chunks: ['editor'],
                filename: 'editor/index.html',
                scriptLoading: 'blocking',
                inject: 'body',
                minify: {
                    collapseWhitespace: true,       // 干掉空格
                    removeComments: true,           // 干掉注释
                    removeAttributeQuotes: true,    // 干掉双引号
                    removeEmptyAttributes: true     // 干掉空属性
                }
            }),

            // page
            // auth.html
            new HtmlWebpackPlugin({
                title: 'Make3D',
                template: './html-tpl/dcc/supabase-auth.html',
                chunks: ['supabase_auth'],
                filename: 'auth/index.html',
                scriptLoading: 'blocking',
                inject: 'body',
                minify: {
                    collapseWhitespace: true,       // 干掉空格
                    removeComments: true,           // 干掉注释
                    removeAttributeQuotes: true,    // 干掉双引号
                    removeEmptyAttributes: true     // 干掉空属性
                }
            }),

            // page
            // auth-redirected.html
            new HtmlWebpackPlugin({
                title: 'Make3D',
                template: './html-tpl/dcc/supabase-auth-redirected.html',
                chunks: ['supabase_auth_redirected'],
                filename: 'auth/redirected.html',
                scriptLoading: 'blocking',
                inject: 'body',
                minify: {
                    collapseWhitespace: true,       // 干掉空格
                    removeComments: true,           // 干掉注释
                    removeAttributeQuotes: true,    // 干掉双引号
                    removeEmptyAttributes: true     // 干掉空属性
                }
            }),

            // page
            // refresh_vip.html
            new HtmlWebpackPlugin({
                title: 'Make3D',
                template: './html-tpl/dcc/refresh_vip.html',
                chunks: ['refresh_vip'],
                filename: 'refreshvip/index.html',
                scriptLoading: 'blocking',
                inject: 'body',
                minify: {
                    collapseWhitespace: true,       // 干掉空格
                    removeComments: true,           // 干掉注释
                    removeAttributeQuotes: true,    // 干掉双引号
                    removeEmptyAttributes: true     // 干掉空属性
                }
            }),

            // page
            // keyshot.html
            new HtmlWebpackPlugin({
                title: 'Make3D',
                template: './html-tpl/dcc/keyshot.html',
                chunks: ['keyshot'],
                filename: 'keyshot/index.html',
                scriptLoading: 'blocking',
                inject: 'body',
                minify: {
                    collapseWhitespace: true,       // 干掉空格
                    removeComments: true,           // 干掉注释
                    removeAttributeQuotes: true,    // 干掉双引号
                    removeEmptyAttributes: true     // 干掉空属性
                }
            }),

            // page
            // accreator.html
            new HtmlWebpackPlugin({
                title: 'Make3D',
                template: './html-tpl/dcc/accreator.html',
                chunks: ['accreator'],
                filename: 'accreator/index.html',
                scriptLoading: 'blocking',
                inject: 'body',
                minify: {
                    collapseWhitespace: true,       // 干掉空格
                    removeComments: true,           // 干掉注释
                    removeAttributeQuotes: true,    // 干掉双引号
                    removeEmptyAttributes: true     // 干掉空属性
                }
            }),

            // page
            // mockups.html
            new HtmlWebpackPlugin({
                title: 'Make3D',
                template: './html-tpl/dcc/mockups.html',
                chunks: ['mockups'],
                filename: 'mockups/index.html',
                scriptLoading: 'blocking',
                inject: 'body',
                minify: {
                    collapseWhitespace: true,       // 干掉空格
                    removeComments: true,           // 干掉注释
                    removeAttributeQuotes: true,    // 干掉双引号
                    removeEmptyAttributes: true     // 干掉空属性
                }
            }),

            // page
            // repairman.html
            new HtmlWebpackPlugin({
                title: 'Make3D',
                template: './html-tpl/dcc/repairman.html',
                chunks: ['repairman'],
                filename: 'repairman/index.html',
                scriptLoading: 'blocking',
                inject: 'body',
                minify: {
                    collapseWhitespace: true,       // 干掉空格
                    removeComments: true,           // 干掉注释
                    removeAttributeQuotes: true,    // 干掉双引号
                    removeEmptyAttributes: true     // 干掉空属性
                }
            }),
    
            new SpriteLoaderPlugin(),
            new ScriptCharsetPlugin(),
        ],
    
    
        module: {
            rules: [
    
                {
                    test: /\.(js)$/,
                    include: /node_modules\/oidn-web/,
                    resolve: {
                      fullySpecified: false,
                    }
                },

                // js
                {
                    test: /\.(js)$/,
                    use: [
                        {
                            loader: 'ifdef-loader',
                            options: {
                                BUILD_FOR: 'web',
                            }
                        },
                    ]
                },
    
                // html
                {
                    test: /\.html$/i,
                    use: [
                        { 
                            loader: 'html-loader',
                            options: { 
                                minimize: {
                                    caseSensitive: true,
                                    collapseWhitespace: true,
                                    conservativeCollapse: true,
                                    keepClosingSlash: true,
                                    minifyCSS: true,
                                    minifyJS: true,
                                    removeComments: true,
                                    removeRedundantAttributes: true,
                                    removeScriptTypeAttributes: true,
                                    removeStyleLinkTypeAttributes: true,
                                }
                            } 
                        },
                    ]
                },
    
                // css
                {
                    test: /\.e.css$/, // 内嵌css
                    use: [
                        { 
                            loader: "style-loader", 
                            options: { 
                                injectType: "styleTag" 
                            } 
                        },
                        "css-loader",
                    ],
                },
    
                // html.css
                {
                    test: /\.html.css$/, // 组件的样式
                    use: [
                        { 
                            loader: 'css-loader' 
                        },
                    ]
                },
    
                // .worker.blob.js
                {
                    test: /\.worker.blob.js$/i,
                    type: 'asset/source'
                },
    
                // 图片
                {
                    test: /\.(png|jpg|gif|jpeg|webp)$/i,
                    type: 'asset',
                    generator: {
                        filename: 'assets/image/[hash][ext]'
                    }
                },
    
                // wasm
                {
                    test: /\.wasm$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'assets/wasm/[hash].[ext]',
                            },
                        }
                    ]
                },
    
                // license
                {
                    test: /\.license$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'assets/license/[hash].[ext]',
                            },
                        }
                    ]
                },

                // .mp4
                {
                    test: /\.mp4$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'assets/video/[hash].[ext]',
                            },
                        }
                    ]
                },
    
                // wasm js 的特殊性
                {
                    test: /(houdini-core|houdini-core-nmt|houdini-core.worker).js$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'assets/wasm/[hash].[ext]',
                            },
                        }
                    ]
                },

                // wasm js 的特殊性
                {
                    test: /(occt-core|occt-core-nmt|occt-core.worker).js$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'assets/wasm/[hash].[ext]',
                            },
                        }
                    ]
                },
    
                // 3d 模型格式: FBX
                {
                    test: /\.fbx$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'assets/3d/[hash].[ext]',
                            },
                        }
                    ]
                },
    
                // 3d 模型格式: obj
                {
                    test: /\.obj$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'assets/3d/[hash].[ext]',
                            },
                        }
                    ]
                },
    
                // 3d 图片格式: HDR
                {
                    test: /\.hdr$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'assets/hdrs/[hash].[ext]',
                            },
                        }
                    ]
                },
    
                // 字体 ttf
                {
                    test: /\.ttf$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/fonts/[hash][ext]'
                    }
                },
    
                // 字体 ttf
                {
                    test: /\.typeface.json$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/fonts/[hash][ext]'
                    }
                },
    
                // {
                //     test: /\.(js|jsx)$/i,
                //     loader: 'babel-loader',
                // },
    
                // {
                //     test: /\.svg$/,
                //     loader: 'svg-inline-loader'
                // },
    
                // svg 文件打包
                {
                    test: /\.svg$/,
                    loader: 'svg-sprite-loader',
                    options: {
                        extract: true,
                        spriteFilename: (svgPath) => { 
                            const hash = Math.abs(hashString(svgPath) % 16);

                            // dcc
                            if (svgPath.includes('dcc')) {
                                return `icons-dcc-${hash}-[hash:6].svg`;
                            }

                            // wg
                            if (svgPath.includes('wg')) {
                                return `icons-wg-${hash}-[hash:6].svg`;
                            }
                        },
                        publicPath: 'assets/sprites/',
                        symbolId: (filePath) => {
                            return filePath
                                    .replace(/\\/g, '/')    // 将反斜杠转换为正斜杠（Windows）
                                    .split('/')             // 分割路径
                                    .slice(-2)              // 获取最后两部分（目录和文件名）
                                    .join('.')              // 组合它们
                                    .replace('.svg', '');   // 去除扩展名
                        }
                    }
                },

                // wgsl神经网络的权重
                {
                    test: /\.wgsl$/i,
                    use: [
                        {
                            loader: 'raw-loader',
                        }
                    ]
                },

                // base64
                {
                    test: /\.base64$/i,
                    use: [
                        {
                            loader: 'raw-loader',
                        }
                    ]
                },
    
                // tza odin神经网络的权重
                {
                    test: /\.tza$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'assets/oidn/[hash].[ext]',
                            },
                        }
                    ]
                },
            ],
        },
    };
};
