import TweenMax from 'gsap/src/uncompressed/TweenMax';
import TimelineMax from 'gsap/src/uncompressed/TimeLineMax';
import ScrollMagic from 'scrollmagic';
import 'imports-loader?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
import 'imports-loader?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';

const controller = new ScrollMagic.Controller();

const parallaxTween = new TimelineMax();

parallaxTween
	.from('.bcg', 1, {y: '-30%', ease: Power0.easeNone})
	.from('content-wrapper',1, {y: '0%', ease: Power0.easeNone});

const scene = new ScrollMagic.Scene({
	triggerElement: '.section--parallax',
	triggerHook: 1,
	duration: '100%'
})
.setTween(parallaxTween)
.addIndicators({
	name: 'parallax',
})
.addTo(controller);
