import TweenMax from 'gsap/src/uncompressed/TweenMax';
import TimelineMax from 'gsap/src/uncompressed/TimeLineMax';
import ScrollMagic from 'scrollmagic';
import 'imports-loader?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
import 'imports-loader?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';

const controller = new ScrollMagic.Controller();

const introTween = new TimelineMax();

introTween
	.add(
		TweenMax.fromTo('.title1', 1, {scale: 1, autoAlpha: 0.3, y: -200}, {scale: 1, autoAlpha: 1, y: 100})
	);

const scene1 = new ScrollMagic.Scene({
	triggerElement: '.section--intro',
	triggerHook: 0,
	duration: '100%'
})
.setPin('.section--intro', {pushFollowers: false})
.setTween(introTween)
.addIndicators({
	name: 'intro'
})
.addTo(controller);

const scene2 = new ScrollMagic.Scene({
	triggerElement: '.section--content',
	triggerHook: 0,
})
// .setPin('.section--intro', {pushFollowers: false})
.addIndicators({
	name: 'second'
})
.addTo(controller);
