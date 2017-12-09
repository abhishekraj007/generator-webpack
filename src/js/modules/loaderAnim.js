'use strict'

console.log('Well did it work!')
// alert('IE 11 you suck')
document.addEventListener('DOMContentLoaded', function () {
  console.log('well')
  setTimeout(() => {
    document.querySelector('.loader--1').classList.add('active')
    document.querySelector('.loader--2').classList.add('active')
    document.querySelector('.loader--3').classList.add('active')
    document.querySelector('.loader--4').classList.add('active')
    document.querySelector('.loader--5').classList.add('active')
  }, 500)
});
