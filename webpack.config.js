var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var UglifyJsPlugin = require("uglifyjs-webpack-plugin");
/*var CopyWebpackPlugin = require("copy-webpack-plugin");
 var ImageminWebpackPlugin = require("imagemin-webpack-plugin").default;
 var imagemin = require("imagemin");
 var imageminMozjpeg = require("imagemin-mozjpeg");//jpe/jpg
 var imageminPngquant = require("imagemin-pngquant");//png
 var imageminOptipng = require("imagemin-optipng");//png
 var imageminGifsicle = require("imagemin-gifsicle");//gif
 var imageminSvgo = require("imagemin-svgo");//svg

 imagemin([__dirname + "/app/images/!*.{jpg,jpe,png,gif,svg}"], [__dirname + "/packing/images"], {
 plugins: [
 imageminMozjpeg({quality: 65}),
 imageminPngquant({
 quality: "65-90",//质量
 speed: 4 //速度
 }),
 imageminOptipng({optimizationLevel: 7}),
 imageminGifsicle({optimizationLevel: 3}),
 imageminSvgo({
 plugins: [
 {
 //viewBox尽可能删除属性（默认情况下禁用）
 removeViewBox: false
 },
 {
 //删除空属性
 removeEmptyAttrs: false
 }
 ]
 })
 ]
 });*/

process.traceDeprecation = true;

module.exports = {
    //入口文件
    entry: [
        // 为webpack-dev-server的环境打包好运行代码
        // 然后连接到指定服务器域名与端口
        "webpack-dev-server/client?http://localhost:8080",
        // 为热替换（HMR）打包好运行代码
        // only- 意味着只有成功更新运行代码才会执行热替换（HMR）
        "webpack/hot/only-dev-server",
        path.join(__dirname, "/app/js/app.js")
    ],
    //输出文件
    output: {
        path: __dirname + "/packing/",//将打包好的文件放在packing文件夹里面
        filename: "index.js",//打包好的文件名叫index.js
        publicPath: '/',
        sourceMapFilename: "index.map"
    },
    devtool: "source-map",
    //加载器
    module: {
        rules: [
            //压缩处理HTML文件
            {
                test: /\.html$/,//正则匹配后缀为.html的文件
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            minimize: true
                        }
                    }
                ]
            },
            //压缩处理CSS文件
            {
                test: /\.css$/,
                //将css文件提取出来独立成一个文件
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                importLoaders: 1
                            }
                        },
                        "postcss-loader"
                    ]
                })
            },
            /**
             * 处理JS文件
             * 1、loader使用include规定只需要处理的文件，比如babel-loader的这两个配置:
             * 只对项目目录下 app 目录里的代码进行babel编译。
             * 2、开启 babel-loader 缓存：babel编译过程很耗时，好在babel-loader提供缓存编译结果选项，
             * 在重启webpack时不需要创新编译而是复用缓存结果减少编译流程。
             * babel-loader缓存机制默认是关闭的，打开的配置如下：
             * */
            {
                test: /\.js$/,
                loader: "babel-loader"
            },
            //压缩处理JSON文件
            {
                test: /\.json$/,
                use: "json-loader"
            },
            //压缩处理图片
            {
                test: /\.(gif|jpe?g|png|svg)$/i,//正则匹配图片类型的文件
                //压缩图片使用的加载器和压缩后图片的存放位置
                // 小于10KB的图片会自动转成dataUrl
                use: [
                    "url-loader?limit=15000&name=/images/[name].[ext]",
                    {
                        loader: "img-loader",
                        options: {
                            enabled: process.env.NODE_ENV === 'production',
                            //enabled: true,
                            progressive: true,//是否增进
                            optimizationLevel: 7,//优化级别为7级
                            interlaced: false,//是否隔行扫描
                            // 处理jpe/jpg
                            mozjpeg: {
                                progressive: true,// 创建基线JPEG文件。
                                //压缩质量。最小和最大值是范围0（最差）到100（完美）的数字。
                                quality: 65,
                                arithmetic: true//是否使用算术编码
                            },
                            // 处理png
                            pngquant: {
                                quality: "65-90",//质量
                                speed: 4 //速度
                            },
                            // 处理svg
                            svgo: {
                                plugins: [
                                    //viewBox尽可能删除属性（默认情况下禁用）
                                    {removeViewBox: false},
                                    //删除空属性
                                    {removeEmptyAttrs: false},
                                    //将路径数据转换为相对或绝对值（以较短者为准），
                                    // 将一个段转换为另一个段，修剪无用的分隔符，智能舍入等等
                                    {convertPathData: true}
                                ]
                            },
                            optipng: {
                                optimizationLevel: 7
                            },
                            gifsicle: {
                                interlaced: false,
                                optimizationLevel: 3
                            }
                        }
                    }
                ]
            },
            //压缩处理字体
            {
                test: /\.(woff|eot|ttf)\??.*$/,//正则匹配字体类型的文件
                loader: "url-loader?limit=50000&name=/fonts/[name].[ext]"
            }
        ]
    },

    //静态服务器设置
    devServer: {
        //设置本地服务器加载所加载的页面的位置
        contentBase: __dirname + "/packing",
        // 对提供的所有内容启用gzip压缩
        compress: true,
        //使用热更新的标志
        hot: true,
        /**
         * 在开发服务器的两种不同模式之间切换(--inline, --iframe)。
         * 默认情况下，将使用内联模式启用应用程序。这意味着一个脚本
         * 将插入到您的包中以处理实时重新加载，并且构建消息将显示在浏览器控制台中。
         * */
        inline: true, //实时监控
        // 和上文output的"publicPath"值保持一致
        publicPath: '/'
    },
    //插件处理
    plugins: [

        //UglifyJS以最小化输出

        new UglifyJsPlugin({
            sourceMap: true
        }),


        //开启全局的模块热替换（HMR）
        new webpack.HotModuleReplacementPlugin(),

        // 当模块热替换（HMR）时在浏览器控制台输出对用户更友好的模块名字信息
        new webpack.NamedModulesPlugin(),


        new ExtractTextPlugin({
            //提取出来后的CSS文件名叫index.css,并放在css文件夹内
            filename: "css/index.css",
            //是否禁用插件
            disable: false,
            //从所有附加模块中抽取：ExtractTextPlugin.extract({})
            allChunks: true
        }),
        //生成一个新的HTML文件处理
        new HtmlWebpackPlugin({
            //1、html文件标题
            title: '红玫瑰商城',
            //2、生成后的HTML文件名叫index.html,并放在packing文件夹内
            filename: __dirname + "/packing/index.html",
            //3、根据指定的模板文件来生成index.html文件
            template: __dirname + '/app/app.html',
            //4、inject的作用是将script标签放在html文件的body底部
            inject: "body",
            //5、favicon的作用是给生成后的html文件生成一个图标,属性值是favicon文件所在的路径名
            favicon: __dirname + "/app/favicon.ico",
            //6、是否对html文件进行压缩
            minify: false,
            //7、是否给生成的css、js文件一个独特的hash值
            hash: true,
            //8、cache的作用是,只有在内容变化时才生成一个新的文件,默认值为true
            cache: true
        }),

        //html-loader高级选项
        new webpack.LoaderOptionsPlugin({
            options: {
                minimize: true,
                postcss: [
                    require("autoprefixer")
                ]
            }
        }),

        // 复制图像文件夹并优化所有图像
        /*        new CopyWebpackPlugin([{
         from: __dirname + "/app/images/",
         to: __dirname + "/packing/images"
         }]),
         new ImageminWebpackPlugin({test: /\.(jpe?g|png|gif|svg)$/i}),*/

        //声明全局的jquery
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};