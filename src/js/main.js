console.log('Webpack has started!');

//Requiring the pug files for the HMR and Live reload
require('../index.pug');
require('../about.pug');

require('../scss/main.scss');

// require('../img/tips.png');

console.warn('Modular Programming.');

require('./modules/anonymClosure');
require('./modules/globalImport');
require('./modules/modulePattern');
require('./modules/revealingModulePattern');
require('./modules/commonJsModule');
