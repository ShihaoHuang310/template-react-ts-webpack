import { Configuration, DefinePlugin } from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"
import * as dotenv from "dotenv"
import WebpackBar from "webpackbar"
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")
const isDev = process.env.NODE_ENV === "development" // 是否是开发模式
console.log("NODE_ENV", process.env.NODE_ENV)
console.log("BASE_ENV", process.env.BASE_ENV)

// 加载配置文件
const envConfig = dotenv.config({
  path: path.resolve(__dirname, "../env/.env." + process.env.BASE_ENV)
})
// 样式匹配文件
const tsxRegex = /.(ts|tsx)$/
const cssRegex = /\.css$/
const sassRegex = /\.(scss|sass)$/
const lessRegex = /\.less$/
const stylRegex = /\.styl$/

const mediaRegex = /.(mp4|webm|ogg|mp3|wav|flac|aac)$/ // 匹配媒体文件
const imageRegex = /\.(png|jpe?g|gif|svg)$/i // 匹配图片文件
const fontRegex = /.(woff2?|eot|ttf|otf)$/ // 匹配字体文件
const styleLoadersArray = [
  isDev ? "style-loader" : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
  {
    loader: "css-loader",
    options: {
      modules: {
        localIdentName: "[path][name]__[local]--[hash:5]"
      }
    }
  },
  "postcss-loader"
]

const baseConfig: Configuration = {
  entry: path.join(__dirname, "../src/index.tsx"), // 入口文件
  // 打包出口文件
  output: {
    filename: "static/js/[name].[chunkhash:8].js", // 每个输出js的名称 加上[chunkhash:8]
    path: path.join(__dirname, "../dist"), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/", // 打包后文件的公共前缀路径
    // ... 这里自定义输出文件名的方式是，将某些资源发送到指定目录
    assetModuleFilename: "images/[hash][ext][query]"
  },
  // loader 配置
  module: {
    rules: [
      {
        test: tsxRegex, // 匹配.ts, tsx文件
        use: "babel-loader"
      },
      {
        test: cssRegex, //匹配 css 文件
        use: styleLoadersArray
      },
      {
        test: lessRegex,
        use: [
          ...styleLoadersArray,
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                // 如果要在less中写类型js的语法，需要加这一个配置
                javascriptEnabled: true,
                importLoaders: 2,
                // 可以加入modules: true，这样就不需要在less文件名加module了
                modules: true
              }
            }
          }
        ]
      },
      {
        test: sassRegex,
        use: [...styleLoadersArray, "sass-loader"]
      },
      {
        test: stylRegex,
        use: [...styleLoadersArray, "stylus-loader"]
      },
      // 处理图片
      {
        test: imageRegex,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024 // 小于10kb转base64
          }
        },
        generator: {
          filename: "static/images/[name].[contenthash:8][ext]" // 文件输出目录和命名
        }
      },
      //处理字体和媒体
      {
        test: fontRegex, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb转base64
          }
        },
        generator: {
          filename: "static/fonts/[name].[contenthash:8][ext]" // 文件输出目录和命名
        }
      },
      {
        test: mediaRegex, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb转base64
          }
        },
        generator: {
          filename: "static/media/[name].[contenthash:8][ext]" // 文件输出目录和命名
        }
      },
      //处理json资源
      {
        // 匹配json文件
        test: /\.json$/,
        type: "asset/resource", // 将json文件视为文件类型
        generator: {
          // 这里专门针对json文件的处理
          filename: "static/json/[name].[hash][ext][query]"
        }
      },
      {
        test: tsxRegex, // 匹配.ts, tsx文件
        exclude: /node_modules/,
        use: ["thread-loader", "babel-loader"]
      }
    ]
  },
  cache: {
    type: "filesystem" // 使用文件缓存
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".less", ".css"],
    // 别名需要配置两个地方，这里和 tsconfig.json
    alias: {
      "@": path.join(__dirname, "../src")
    }
    // modules: [path.resolve(__dirname, "../node_modules")], // 查找第三方模块只在本项目的node_modules中查找
  },
  // plugins 的配置
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack5-react-ts",
      filename: "index.html",
      // 复制 'index.html' 文件，并自动引入打包输出的所有资源（js/css）
      template: path.join(__dirname, "../public/index.html"),
      inject: true, // 自动注入静态资源
      hash: true,
      cache: false,
      // 压缩html资源
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true, //去空格
        removeComments: true, // 去注释
        minifyJS: true, // 在脚本元素和事件属性中缩小JavaScript(使用UglifyJS)
        minifyCSS: true // 缩小CSS样式元素和样式属性
      },
      nodeModules: path.resolve(__dirname, "../node_modules")
    }),
    new DefinePlugin({
      "process.env": JSON.stringify(envConfig.parsed),
      "process.env.BASE_ENV": JSON.stringify(process.env.BASE_ENV),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    new WebpackBar({
      color: "#85d", // 默认green，进度条颜色支持HEX
      basic: false, // 默认true，启用一个简单的日志报告器
      profile: false // 默认false，启用探查器。
    })
  ]
}

export default baseConfig
