const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1'
];

module.exports = {
  plugins: [
    // require('precss'),
    // require('autoprefixer')({browsers: AUTOPREFIXER_BROWSERS}),
    require('postcss-cssnext')({browsers: AUTOPREFIXER_BROWSERS}),
    require('postcss-custom-media'),
    require('postcss-nesting'),
    require('postcss-flexbugs-fixes'),
    require('postcss-fixes')({ preset: 'safe' })
  ]
}
;
