const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    devtool: 'none',
    // entry: {
    //     index: "./src/index.js" //入口文件，若不配置webpack4将自动查找src目录下的index.js文件
    // },
    output: {
        filename: "js/[name].bundle.[hash].js",//输出文件名，[name]表示入口文件js名
        path: path.join(__dirname, "dist")//输出文件路径
    },
    module: { // 处理对应模块
        
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    "presets": [
                        [
                          "@babel/preset-env",
                          {
                            "targets": {
                              "esmodules": true,
                            //   "browsers": "not ie <= 8"
                                "ie": 9
                            },
                            
                          }
                        ]
                        // "@babel/preset-es2015"
                      ]
                  }
                }
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]//处理css
            },
            {
                test:/\.jpg$/,
                use:[{
                    loader:'url-loader?limit=8192',
                    options:{
                        name: '[name]___[hash:7].[ext]',
                        outputPath:'assets/',//输出到images文件夹
                        limit:1  //是把小于500B的文件打成Base64的格式，写入JS
                    }
                }]
            },
            {
                test:/\.(png|gif)$/,
                use:[{
                    loader:'url-loader?limit=8192',

                    options:{
                        name: '[name]___[hash:7].[ext]',
                        outputPath:'assets/',//输出到images文件夹
                        limit:60960  //是把小于500B的文件打成Base64的格式，写入JS
                    }
                }]
            },

            {
                test:/\.(mp4|mp3|ts|ttf)$/,
                use:[{
                    loader:'url-loader',
                    options:{
                        name: '[name]___[hash:7].[ext]',
                        limit:1,
                        outputPath:'assets/',//输出到images文件夹
                    }
                }]
            },
            {
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        removeComments: true,
                        removeAttributeQuotes: false,
                        interpolate: true,
                        collapseWhitespace: true
                    }
                }]
            }
        ]
    },
    plugins: [// 对应的插件
        new HtmlWebpackPlugin({ //配置
            filename: 'index.html',//输出文件名
            template: './index.html',//以当前目录下的index.html文件为模板生成dist/index.html文件
        }),
        // new HtmlWebpackPlugin({ //配置
        //     filename: 'redirect.html',//输出文件名
        //     template: './redirect.html',//以当前目录下的index.html文件为模板生成dist/index.html文件
        // }),
        // new HtmlWebpackPlugin({ //配置
        //     filename: 'pagex.html',//输出文件名
        //     template: './pagex.html',//以当前目录下的index.html文件为模板生成dist/index.html文件
        // }),
        // new CleanWebpackPlugin(['dist']),
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin([
            {from :'js', to: "js"}
        ])
        // new CopyWebpackPlugin([
        //     {from :'sources', to: "sources"}
        // ])
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    output: {
                        comments: false
                    }
                }
            })
        ],

        splitChunks: {
            cacheGroups: {
                main: {  // 抽离自己写的公共代码
                    chunks: "initial",
                    name: "js/main", // 打包后的文件名，任意命名
                    minChunks: 2,//最小引用2次
                    minSize: 0 // 只要超出0字节就生成一个新包
                },
                vendor: {   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',  // 打包后的文件名，任意命名
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10
                },
            }
        }
    },
    devServer: {//配置此静态文件服务器，可以用来预览打包后项目
        inline:true,//打包后加入一个websocket客户端
        hot:true,//热加载
        contentBase: path.resolve(__dirname, 'dist'),//开发服务运行时的文件根目录
        host: '0.0.0.0',//主机地址
        port: 9090,//端口号
        compress: true//开发服务器是否启动gzip等压缩
    }
}
