'use strict';

const ETP = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// const HtmlCriticalPlugin = require('html-critical-webpack-plugin');
// const ManifestPlugin = require('webpack-manifest-plugin');
// const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin');
var ImageMinPlugin = require('imagemin-webpack-plugin').default;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const path = require('path');
const webpack = require('webpack');

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build')
};

module.exports = {

  entry: {
    // vendor: ['jquery'],
    index: `${PATHS.app}/js/main.js`,
    about: `${PATHS.app}/js/about.js`
  },

  devtool: 'source-map',

  output: {
    filename: './js/[name].bundle.js',
    sourceMapFilename: '[file].map',
    path: path.resolve(__dirname, 'dist')
  },

  module: {

    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre'
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

      // {
      //   test: /\.(jpg|jpeg|gif|png|svg)$/,
      //   exclude: /node_modules/,
      //   include: path.join(__dirname, 'src/img'),
      //   use: {
      //     loader: 'url-loader',
      //     options: {
      //       name: 'img/[name].[ext]',
      //       publicPath: '../'
      //     }
      //   }
      // },

      {
        test: /\.(jpg|jpeg|gif|png|svg)$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src/img'),
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
            publicPath: './'
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
            publicPath: './'
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
              loader: 'css-loader',
              options: {
                url: false,
                sourceMap: true,
                importLoaders: 3
              }
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
          keepQuery: true
          // sourceMap: true
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
    new ETP('./css/style.css', { allChunks: true }),
    new CopyWebpackPlugin([
      {
        from: './src/img',
        to: './img'
      },
      {
        from: './src/fonts',
        to: './fonts'
      }
    ]),
    new ImageMinPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    new ImageMinPlugin({
      test: /\.png$/i,
      optipng: {
        optimizationLevel: 6
      }
    }),
    new ImageMinPlugin({
      minFileSize: 10000, // Only apply this one to files over 10kb
      jpegtran: { progressive: true }
    }),
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery'
    // }),
    new HtmlWebpackPlugin({
      template: './src/index.pug',
      filename: 'index.html',
      chunks: ['index'],
      cache: true,
      minify: {
        html5: true,
        minifyCSS: true,
        collapseWhitespace: false
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/about.pug',
      filename: 'about.html',
      chunks: ['about'],
      cache: true,
      minify: {
        html5: true,
        minifyCSS: true,
        collapseWhitespace: false
      }
    }),
    // new ManifestPlugin({
    //   fileName: 'manifest.json'
    // }),
    // new DynamicCdnWebpackPlugin(),
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
