'use strict';

const ETP = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const ManifestPlugin = require('webpack-manifest-plugin');
// var ImageMinPlugin = require('imagemin-webpack-plugin').default;
// const HtmlCriticalPlugin = require('html-critical-webpack-plugin');
// const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin');


const isProduction = process.env.NODE_ENV === 'production';

console.log(`Running webpack in the ${isProduction ? 'production' : 'development'} mode`);

const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const PurifyCSSPlugin = require('purifycss-webpack');

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
  emitErrors: false,
//   fix: true,
}

module.exports = {

  context: PATHS.app,
  // node: {
  //   fs: 'empty'
  // },
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

  devtool: isProduction ?  'source-map' : 'eval',

  output: {
    filename: './js/[name].bundle.js',
	sourceMapFilename: '[file].map',
	chunkFilename: '[name].bundle.js',
    path: PATHS.build
  },

  module: {

    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre'
			},
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
		exclude: /node_modules/,
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
        use: [
			{
				loader: 'babel-loader',
				options: {
					presets: ['env', 'es2015', 'es2015-ie']
				}
			},
			{
				loader: 'eslint-loader',
				options: {
				  emitWarning: true,
				  formatter: require('eslint-friendly-formatter')
				}
			}
		]
      }

    ]
  },

  resolve: {
    // modules: [
    //   path.join(__dirname, 'src'),
    //   'node_modules'
    // ],
    extensions: ['.js', '.es6'],
    alias: {
      modernizr$: path.resolve(__dirname, '.modernizrrc')
    }
  },


  //External CDN Libs
  externals: {
    jquery: 'jQuery',
    // aos: 'AOS'
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

  //Plugins Config
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     'NODE_ENV': process.env.NODE_ENV
    //   }
    // }),
    new webpack.LoaderOptionsPlugin({
      // Options...
      options: {
        resolveUrlLoader: {
          keepQuery: true
          // sourceMap: true
        }
      }
    }),
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery'
    // }),
    new ETP('./css/[name].css', { allChunks: true }),
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
    new HtmlWebpackPlugin({
      template: 'about.pug',
      filename: 'about.html',
      chunks: ['about', 'vendor'],
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
      'process.env.NODE_ENV': '"production"',
    })
    // new StyleLintPlugin(lintStylesOptions)
  ]
  .concat(
    isProduction
    ?
    //If Production run these
    [
      new CleanWebpackPlugin(['dist']),
      new UglifyJsPlugin({
        uglifyOptions: {
          ie8: false,
          ecma: 8,
          mangle: false,
          sourceMap: true,
          exclude: /\/node_modules/
        }
      }),
      new CopyWebpackPlugin([
        {
          from: './img',
          to: './img'
        },
        {
          from: './fonts',
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
      // new ManifestPlugin({
      //   fileName: 'manifest.json'
      // }),
      // new DynamicCdnWebpackPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.optimize\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
      }),
      new PurifyCSSPlugin({
        // Give paths to parse for rules. These should be absolute!
        paths: glob.sync(path.join(__dirname, 'src/**/*.pug'))
      }),
      new BundleAnalyzerPlugin({
        // Can be `server`, `static` or `disabled`.
        // In `server` mode analyzer will start HTTP server to show bundle report.
        // In `static` mode single HTML file with bundle report will be generated.
        // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
        analyzerMode: 'static',
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
    //If not production then run these
    :
    [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [`You application is running here http://localhost: ${app.port}`],
          notes: ['Webpack Dev Server is up and running']
        }
      })
      // Force writing the HTML files to disk when running in the development mode
      // (otherwise, webpack-dev-server won’t serve the app)
      // new HtmlWebpackHarddiskPlugin(),
    ]
  )
};
