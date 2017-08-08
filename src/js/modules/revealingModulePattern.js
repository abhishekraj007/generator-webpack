'use strict';

console.warn('Revealing Module Pattern Loaded');

let myGradesCalculate = (function () {
  let grades = [10, 90, 75, 60, 55, 88, 85, 92];

  let average = function () {
    let total = grades.reduce(function (ac, item) {
      return ac + item;
    }, 0);

    return 'Your average grade is ' + total / grades.length + '.';
  };

  let failing = function () {
    let totalFailed = grades.filter(function (item) {
      return item < 50;
    });

    return 'You failed ' + totalFailed.length + ' times.';
  };

  return {
    average: average,
    failing: failing
  };
}());

console.info(myGradesCalculate.average());
console.info(myGradesCalculate.failing());
