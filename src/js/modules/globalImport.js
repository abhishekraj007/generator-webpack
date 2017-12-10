'use strict';

import $ from 'jquery';

console.warn('Global import is loading');

(function () {
  let name = 'Varun';
  console.log(name);

  $(document).ready(function () {
    console.log('Global Import loaded.');
    console.log('Jquery doc loaded :D');
  });
}());
