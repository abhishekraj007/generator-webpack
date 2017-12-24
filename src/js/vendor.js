// Requring plugins here
// import '../../node_modules/aos/src/sass/aos.scss';

import TweenMax from 'gsap/src/uncompressed/TweenMax';
import TimelineMax from 'gsap/src/uncompressed/TimeLineMax';
import ScrollMagic from 'scrollmagic';
import 'imports-loader?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
import 'imports-loader?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';

import 'bootstrap/dist/css/bootstrap.min.css';
// import 'popper.js';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

$(document).on('ready', function () {
  alert('Dom loaded');
});
