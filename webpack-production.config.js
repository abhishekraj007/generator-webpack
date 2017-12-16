'use strict';

const ETP = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// const HtmlCriticalPlugin = require('html-critical-webpack-plugin');
// var ImageMinPlugin = require('imagemin-webpack-plugin').default;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const ManifestPlugin = require('webpack-manifest-plugin');
// const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin');

const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const PurifyCSSPlugin = require('purifycss-webpack');

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build')
};

module.exports = {

  entry: {
    vendor: [
      `${PATHS.app}/js/vendor.js`
    ],
    'index': [
      `${PATHS.app}/js/main.js`
    ]
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
        test: /\.(scss|css)$/,
        // exclude: /node_modules/,
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
    new ETP('./css/[name].css', { allChunks: true }),
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
    // new ImageMinPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    // new ImageMinPlugin({
    //   test: /\.png$/i,
    //   optipng: {
    //     optimizationLevel: 6
    //   }
    // }),
    // new ImageMinPlugin({
    //   minFileSize: 10000, // Only apply this one to files over 10kb
    //   jpegtran: { progressive: true }
    // }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      filename: './js/[name].js'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.pug',
      filename: 'index.html',
      chunks: ['vendor', 'index'],
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
    }),
    new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync(path.join(__dirname, 'src/*.pug'))
    }),
    new BundleAnalyzerPlugin({
      // Can be `server`, `static` or `disabled`.
      // In `server` mode analyzer will start HTTP server to show bundle report.
      // In `static` mode single HTML file with bundle report will be generated.
      // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
      analyzerMode: 'server',
      // Host that will be used in `server` mode to start HTTP server.
      analyzerHost: '127.0.0.1',
      // Port that will be used in `server` mode to start HTTP server.
      analyzerPort: 8888,
      // Path to bundle report file that will be generated in `static` mode.
      // Relative to bundles output directory.
      reportFilename: 'report.html',
      // Module sizes to show in report by default.
      // Should be one of `stat`, `parsed` or `gzip`.
      // See "Definitions" section for more information.
      defaultSizes: 'parsed',
      // Automatically open report in default browser
      openAnalyzer: true,
      // If `true`, Webpack Stats JSON file will be generated in bundles output directory
      generateStatsFile: false,
      // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
      // Relative to bundles output directory.
      statsFilename: 'stats.json',
      // Options for `stats.toJson()` method.
      // For example you can exclude sources of your modules from stats file with `source: false` option.
      // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
      statsOptions: null,
      // Log level. Can be 'info', 'warn', 'error' or 'silent'.
      logLevel: 'info'
    })
    // new HtmlCriticalPlugin({
    //   base: path.join(path.resolve(__dirname), 'dist/'),
    //   src: 'index.html',
    //   dest: 'index.html',
    //   inline: true,
    //   minify: true,
    //   extract: true,
    //   width: 320,
    //   height: 567,
    //   penthouse: {
    //     blockJSRequests: false
    //   }
    // })
  ]
}
