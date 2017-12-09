'use strict';

function helloWorld () {
  this.sayHello = function () {
    console.log('Hello world loaded via common js style, isn"t that just great :D !');
  };
}

module.exports = helloWorld;
