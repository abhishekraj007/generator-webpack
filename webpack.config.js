'use strict';

const ETP = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

var isProd = (process.env.NODE_ENV === 'production');

let path = require('path');
let webpack = require('webpack');

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build')
}

const lintStylesOptions = {
  context: path.resolve(__dirname, `${PATHS.app}/scss`),
  syntax: 'scss',
  emitErrors: false
  // fix: true,
}

module.exports = {

  context: PATHS.app,

  entry: {
    // app: './src/js/main.js',
    main: `${PATHS.app}/js/main.js`
    // index: `${PATHS.app}/index.pug`
  },

  devtool: 'inline-source-map',

  output: {
    filename: './js/[name].bundle.js',
    path: PATHS.build
  },

  module: {

    rules: [

      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            emitWarning: true,
            formatter: require('eslint-friendly-formatter')
          }
        }
      },

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
        test: /\.(jpg|jpeg|gif|png|svg|webp)$/,
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
          options: {
            presets: ['env', 'es2015', 'es2015-ie']
          }
        }
      }

    ]
  },

  resolve: {
    extensions: ['.js', '.es6']
  },

  devServer: {
    open: true,
    port: 8000,
    quiet: true,
    hot: true,
    stats: 'errors-only',
    contentBase: './src',
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/
    },
    // Enable history API fallback so HTML5 History API based
    // routing works. Good for complex setups.
    historyApiFallback: true,
    overlay: {
      errors: true,
      warnings: true
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': process.env.NODE_ENV
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['You application is running here http://localhost:3000'],
        notes: ['Webpack Dev Server is up and running']
      },
      onErrors: function (severity, errors) {
        // You can listen to errors transformed and prioritized by the plugin
        // severity can be 'error' or 'warning'
        console.log(errors);
      }
    }),
    new ETP('./css/style.css', {allChunks: true}),
    new HtmlWebpackPlugin({
      template: 'index.pug',
      filename: 'index.html',
      title: 'Factor',
      cache: true,
      minify: {
        html5: true,
        minifyCSS: true,
        collapseWhitespace: false
      }
    })
    // new StyleLintPlugin(lintStylesOptions)
  ]
};
