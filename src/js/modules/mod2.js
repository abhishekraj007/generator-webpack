'use strict';

console.log('Module 2 loaded');

const obj = { };

[obj.a, obj.b] = ['varun', '26'];

console.log(obj);

let add = function (a, b) {
  return a + b;
};

console.log('sum is ' + add(10, 22));
console.log('sum is ' + add(10, 42));
