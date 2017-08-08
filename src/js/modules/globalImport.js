'use strict';

console.warn('Global import is loading');

let jquery = require('jquery');

(function ($) {
  let name = 'Varun';
  console.log(name);

  $(document).ready(function () {
    console.log('Global Import loaded.');
    console.log('Jquery doc loaded :D');
  });
}(jquery));
