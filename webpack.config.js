'use strict';

const ETP = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

let path = require('path');
let webpack = require('webpack');

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'dist')
}

const app = {
  port: 3000
};

const lintStylesOptions = {
  context: path.resolve(__dirname, `${PATHS.app}/scss`),
  syntax: 'scss',
  emitErrors: false
  // fix: true,
}

module.exports = {

  context: PATHS.app,
  node: {
    fs: 'empty'
  },
  entry: {
    vendor: [
      `${PATHS.app}/js/vendor.js`
    ],
    'index': [
      `${PATHS.app}/js/main.js`
      // `${PATHS.app}/scss/main.scss`
    ],
    'about': [
      `${PATHS.app}/js/about.js`
    ]
  },

  devtool: 'eval',

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
        test: /\.modernizrrc.js$/,
        use: [ 'modernizr-loader' ]
      },

      {
        test: /\.modernizrrc(\.json)?$/,
        use: [ 'modernizr-loader', 'json-loader' ]
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
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['file-loader?context=src/img/&name=img/[path][name].[ext]', { // images loader
          loader: 'image-webpack-loader',
          query: {
            mozjpeg: {
              progressive: true
            },
            gifsicle: {
              interlaced: false
            },
            optipng: {
              optimizationLevel: 4
            },
            pngquant: {
              quality: '75-90',
              speed: 3
            },
            svgo: {
              plugins: [
                {
                  removeViewBox: false
                },
                {
                  removeEmptyAttrs: false
                }
              ]
            },
            // Specifying webp here will create a WEBP version of your JPG/PNG images
            webp: {
              quality: 75
            }
          }
        }],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        exclude: path.join(__dirname, 'src/img'),
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
            publicPath: './'
          }
        }
      },

      {
        test: /\.(scss|css)$/,
        // exclude: /node_modules/,
        use: ['css-hot-loader'].concat(ETP.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                url: false,
                sourceMap: true
              }
            },
            {
              loader: 'resolve-url-loader'
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: './postcss.config.js'
                },
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
        )
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
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ],
    extensions: ['.js', '.es6'],
    alias: {
      modernizr$: path.resolve(__dirname, '.modernizrrc')
    }
  },

  devServer: {
    open: true,
    port: 8000,
    quiet: true,
    hot: true,
    compress: true,
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
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      filename: './js/[name].js'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`You application is running here http://localhost: ${app.port}`],
        notes: ['Webpack Dev Server is up and running']
      }
    }),
    new ETP('./css/[name].css', {allChunks: true}),
    new HtmlWebpackPlugin({
      template: 'index.pug',
      filename: 'index.html',
      chunks: ['index', 'vendor'],
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
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
    })
    // new StyleLintPlugin(lintStylesOptions)
  ]
};
