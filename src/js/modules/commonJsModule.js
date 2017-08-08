'use strict';

console.warn('CommonJs Module loading');

let Hello = require('../cjsModules/helloWorldModule');

let newHelloInstance = new Hello();

newHelloInstance.sayHello();
