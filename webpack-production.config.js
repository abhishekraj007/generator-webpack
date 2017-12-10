'use strict'

const ETP = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const HtmlCriticalPlugin = require('html-critical-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    main: './src/js/main.js'
  },
  output: {
    filename: './js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        include: path.join(__dirname, 'src'),
        use: [
          {
            loader: 'html-loader'
          },
          {
            loader: 'pug-html-loader?pretty&exports=false'
          }
        ]
      },
      {
        test: /\.html$/,
        include: path.join(__dirname, 'src'),
        use: {
          loader: 'html-loader',
          options: {
            minimize: false
          }
        }
      },
      {
        test: /\.(jpg|jpeg|gif|png|svg)$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src/img'),
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
            publicPath: '../'
          }
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        exclude: path.join(__dirname, 'src/img'),
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
            publicPath: '../'
          }
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ETP.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
              // options: {
              //   sourceMap: true,
              //   importLoaders: 3
              // }
            },
            {
              loader: 'resolve-url-loader'
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['env', 'es2015', 'es2015-ie']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.es6']
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.LoaderOptionsPlugin({
      // Options...
      options: {
        resolveUrlLoader: {
          keepQuery: true,
          sourceMap: true
        }
      }
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 8,
        mangle: false,
        sourceMap: true,
        exclude: /\/node_modules/
      }
    }),
    new ETP('./css/style.css', {allChunks: true}),
    new CopyWebpackPlugin([
      {
        from: './src/img',
        to: './img'
      }
    ]),
    new HtmlWebpackPlugin({
      template: './src/index.pug',
      filename: 'index.html',
      title: 'Factor',
      cache: true,
      minify: {
        html5: true,
        minifyCSS: true,
        collapseWhitespace: false
      }
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    })
    // new HtmlCriticalPlugin({
    //   base: path.join(path.resolve(__dirname), 'dist/'),
    //   src: 'index.html',
    //   dest: 'index.html',
    //   inline: true,
    //   minify: true,
    //   extract: true,
    //   width: 375,
    //   height: 565,
    //   penthouse: {
    //     blockJSRequests: false
    //   }
    // })
  ]
}
