import './modules/loaderAnim'
import Vivus from 'vivus/dist/vivus.min.js';

console.log('All hail Webpack 3!')

// Requiring the pug files for the HMR and Live reload
// require('../index.pug')
// require('../about.pug')

require('../scss/main.scss')

console.warn('Modular Programming.')

require('./modules/anonymClosure')
require('./modules/globalImport')
require('./modules/modulePattern')
require('./modules/revealingModulePattern')
require('./modules/commonJsModule')

let myLine = new Vivus('Layer_1', {duration: 200});

myLine.play();
