// $(document).scrollTop(6600);
let i = 0;
let startPos = 0,
	currentPage = 0,
	prevPage = 0,
	calculatedPage = 0,
	scrollTop = 0,
	scrollRatio = 0,
	initialAngle = 0,	
	currentAngle = 0,
	newAngle = 0,
	initialLoad = true,
	currentScroll = 0;
let inactiveImage,
	inactiveImageIndex,
	activeImage,
	activeImageIndex;
const windowWidth = $(window).width();
const windowHeight = $(window).height();
//multiply by 2 because the last scroll does not have a corresponding icon
const scrollHeight = $(document).height() - windowHeight * 2;
const anglePitch = 8;
const maxAngleOffset = 24;
const fullRotationAngle = 48;
const iconsNumber = 7;
const $revolver = $('#scroll-spy-menu');
// $revolver.css('transform', 'rotateZ(0deg)');
// console.log($revolver.css('transform'));
const $token = $('#token');
const $menuItems = $('.circle-menu-item');
const $bus = $('#bus');
const $people = $('#people');
const $tokenInfo = $('#token-info');
const $fullPage = $('#full-page');
$menuItems.each(function(index, item) {	
	$(item).data({		
		index: index,
		scrollPos: index * windowHeight,		
		angle: (index * anglePitch - maxAngleOffset) * (-1),
		inactiveImage: $(this).find('.inactive-img'),
		activeImage: $(this).find('.active-img')
	});
		
	// console.log($(item).data());		
});
$token.data({
	currentScale: 1,
	scale0: 1,
	top0: '14vh',
	left0: 666,
	scale1: 0.4,
	top1: '115vh',
	left1: 610
})

let scroll = true;
let options = {
	root: null,
	rootMargin: '0px',
	threshold: 0.5
};
// const options = {};

const lethargy = new Lethargy();

const manageIntersection = (entries, observer) => {
	// console.log('intersection');
	entries.forEach(entry => {
		
		if (entry.isIntersecting && scroll === true) {
			console.log(entry);
			// manageScrollPos($(entry.target).data('index'));
			const index = $(entry.target).data('index');	
			

			goToSection($menuItems.eq(index), false);
			currentScroll = $menuItems.eq(index).data('scrollPos') * (-1);
			$fullPage.addClass('active');
		}
	});
};

const observer = new IntersectionObserver(manageIntersection, options);

const sections = document.querySelectorAll('section');

// const $path = $('g[role="menuitem"]:nth-child(666) > path');
// $path.css('fill', 'white');

const managePageSwitch = (animate, prevPage, page) => {	
	console.log(prevPage, page);
	console.log('manage');
	let $prevItem, $currentItem;
	$prevItem = $menuItems.eq(prevPage);	
	$currentItem = $menuItems.eq(page);
	// console.log($prevItem);
	// console.log($currentItem);
	// console.log(currentPage);
	
	if (animate) {
		if ($prevItem.length > 0) $prevItem.removeClass('active')
								// .css('transform', $prevItem.css('transform').replace(' scale(1.2)', ''))
								.data('activeImage').removeClass('active-in').addClass('active-out');		
		// $currentItem.css('transform', $currentItem.css('transform').concat(' scale(1.2)'))
		if ($currentItem.length > 0) $currentItem.addClass('active').data('activeImage').removeClass('active-out').addClass('active-in');
	} else {
		$currentItem.css('background-image', $currentItem.data('activeImage'));			
	}
	
	// console.log(currentPage);
	if (currentPage === 0) {
		$token.css('z-index', '0');
		$token.stop().animate({
			top: $token.data('top0'),
			// left: $token.data('left0')
		}, {
			duration: 2000,
			// step: function(now) {
				
			// }
			} 
		);
		// $({scale: $token.data('scale1')}).animate({
		$({scale: $token.data('currentScale')}).animate({
			scale: $token.data('scale0')
		}, {
			duration: 2000,
			step: function(now) {
				$token.css('transform', `translateX(-50%) scale(${now})`);
				$token.data('currentScale', now);
				// console.log(now);
				// console.log($(this).data('currentScale'));
			},
			complete: function() {
				// console.log($token.offset());
			}
		});
	}
	if (currentPage === 1) {
		// console.log($token.offset());
		$token.css('z-index', '1');
		$token.stop().animate({
			// position: 'absolute',
			top: $token.data('top1'),
			// left: $token.data('left1')
		}, {
			duration: 2000,
			complete: function() {
				$people.animate({opacity: 1}, 1000);					
				$tokenInfo.animate({opacity: 1}, 1000);
			}
		});
		$({scale: $token.data('currentScale')}).animate({
			scale: $token.data('scale1')
		}, {
			duration: 2000,
			step: function(now) {
				// console.log(this);
				$token.css('transform', `translateX(-50%) scale(${now})`);
				$token.data('currentScale', now);
				// console.log(now);
				// console.log($token.data('currentScale'));
			},
			complete: function() {
				// $bus.removeClass('departing-bus').addClass('arriving-bus');
			}
		});
	}
	if (currentPage === 2) {
		// $bus.removeClass('arriving-bus').addClass('departing-bus');
	}
};

const scrollTo = (to) => {
	
	$.when(
		$({pos: currentScroll}).animate({pos: to}, {		
						
			step: function(now) {
				// console.log(now);
				// console.log($fullPage);
				$fullPage.css('transform', `translateY(${now}px)`);
			},		
			
			easing: 'easeInOutSine',
			delay: 0,
			duration: 750,
			done: function() {
				// manageScrollPos(false);
				console.log('scroll complete');
				currentScroll = to;
	
							
			},
			fail: function() {
				console.log('fail');
			}
		})
		.promise().done(function() {
			console.log('promise done');
		})
		).done(function() {
			console.log('when done');
		});
}

const goToSection = (menuItem, animate) => {	
	console.log(menuItem);
	// console.log(prevPage);
	let to = menuItem.data('scrollPos') * (-1);
	
	if (animate === undefined) {
		scrollTo(to);
	} else {
		$fullPage.css('transform', `translateY(${to}px)`);
	}
	

	manageScrollPos(menuItem.data('index'));
	
};

const handleScroll = (event) => {	
					
	console.log('scroll');
	let nextPage, newScrollPos;
	if (Math.sign(event.originalEvent.deltaY) === 1) {
		// goToSection($menuItems.eq(currentPage + 1));
		nextPage = currentPage + 1;							
	} else {
		// goToSection($menuItems.eq(currentPage - 1));
		nextPage = currentPage - 1;						
	}
	
	// 7 icons + 1 last page without icon
	if (nextPage >= 0 && nextPage <= iconsNumber) {
		newScrollPos = (nextPage) * windowHeight * (-1);
		scrollTo(newScrollPos);
		manageScrollPos(nextPage);
	}								
};

const debouncedScrollHandler = debounce(handleScroll, 1000, {
	leading: true,
	trailing: false,
	'maxWait': 1000
});


const rotateMenu = (from, to, animate, initial, prevPage, page) => {	
	console.log(prevPage);	
	console.log(page);
	if (animate) {	
		console.log('rotate anim');	
		
		if (initial) {
			
			$revolver.animate({
				opacity: 1					
				}, {
				duration: 1000, //* scrollRatio								
			});
			// we use a pseudo object for the animation
			// (starts from `0` to `angle`), you can name it as you want						
			$({deg: from}).delay(1000).animate({deg: to}, {
				//animation duration depends on the difference between initial 
				//position (0deg => 500ms) and position when animation ends (24deg => 2000ms)
				duration: 1500 * (Math.abs(to) / maxAngleOffset) + 500,
				// duration: 2000,	
				// easing: 'easeInOutElastic',
				// easing: 'easeInOutQuint',
				easing: 'easeInOutBack',
				start: () => {
					$menuItems
					// .delay(10000)
					.each(function() {
						$(this).data('activeImage').removeClass('active').addClass('active-out');
					});
				},
				step: function(now) {
					// in the step-callback (that is fired each step of the animation),
					// you can use the `now` paramter which contains the current
					// animation-position (`0` up to `angle`)								
					$revolver.css('transform', `rotateZ(${now}deg)`);								
					$menuItems.each(function(index, item) {
						$(item).data('inactiveImage').css('transform', `rotateZ(${now * (-1)}deg)`);
						$(item).data('activeImage').css('transform', `rotateZ(${now * (-1)}deg)`);
					});
				},
				complete: function() {
					managePageSwitch(true, prevPage, page);		
					$menuItems.on('click', function() {												
						goToSection($(this));
						
					});
					
					// $fullPage.on('mousewheel', debouncedScrollHandler);
					$(window).bind('mousewheel DOMMouseScroll wheel MozMousePixelScroll', function(e){
						e.preventDefault()
						e.stopPropagation();
						if(lethargy.check(e) !== false) {
							debouncedScrollHandler(e);
						}
					});
					
					// $(document.body).css('overflow-y', 'scroll');
					currentAngle = to;					
				}
			});	
		} else {
			currentAngle = to;
			// $revolver.queue('fx', []);
			console.log(from, to);
			$({deg: from}).animate({deg: to}, {
				//animation duration depends on the difference between initial 
				//position (0deg => 500ms) and position when animation ends (24deg => 2000ms)
				// duration: 1500 * (Math.abs(to - from) / fullRotationAngle) + 500,
				duration: 750,	
				// easing: 'easeInOutElastic',
				easing: 'easeInOutQuint',
				// easing: 'easeInOutBounce',
				start: () => {
					$menuItems
					// .delay(10000)
					.each(function() {
						$(this).data('activeImage').removeClass('active').addClass('active-out');
					});
				},
				step: function(now) {
					// in the step-callback (that is fired each step of the animation),
					// you can use the `now` paramter which contains the current
					// animation-position (`0` up to `angle`)								
					$revolver.css('transform', `rotateZ(${now}deg)`);								
					$menuItems.each(function(index, item) {
						$(item).data('inactiveImage').css('transform', `rotateZ(${now * (-1)}deg)`);
						$(item).data('activeImage').css('transform', `rotateZ(${now * (-1)}deg)`);
					});
				},
				complete: function() {
					console.log(prevPage, page);
					managePageSwitch(true, prevPage, page);												
				}
			});
		}				
			
	} else {
		$revolver.css('transform', `rotateZ(${to}deg)`);		
		$menuItems.each(function(index, item) {
			$(item).data('inactiveImage').css('transform', `rotateZ(${to * (-1)}deg)`);
			$(item).data('activeImage').css('transform', `rotateZ(${to * (-1)}deg)`);
		});
	}
};

const getAngle = (page) => {
	// 0 -> 24deg
	// 3 -> 0deg
	// 6 -> -24deg
	return ((page * (-anglePitch)) + maxAngleOffset);
	
};

const manageScrollPos = (page) => {
	console.log(page);
	if (initialLoad) {		
		initialLoad = false;
		currentPage = page;
		newAngle = getAngle(page);
		prevPage = currentPage;
		rotateMenu(initialAngle, newAngle, true, true, prevPage, page);
		sections.forEach((section, index) => {
			observer.unobserve(section);
			$(section).data('index', index);
		});
		console.log(prevPage, currentPage);
	} else {
		console.log(currentPage, page);
		
		prevPage = currentPage;
		var prev = prevPage;
		currentPage = page;

		rotateMenu(currentAngle, $menuItems.eq(page).data('angle'), true, false, prev, page);
				
	}		
};


$menuItems.on('mouseenter', function() {
	if (!$(this).hasClass('active')) {
		$(this).data('activeImage').toggleClass('active-out active-in');
	}	
});

$menuItems.on('mouseleave', function() {
	if (!$(this).hasClass('active')) {				
		$(this).data('activeImage').toggleClass('active-out active-in');
	}	
});

$(function() {	
	// window.scrollTo(0);
	document.location = "#";

	sections.forEach((section, index) => {
		observer.observe(section);
		$(section).data('index', index);
	});
	
	// if ($(window).width() >= 1200) manageScrollPos($(entry.target).data('index'));
}); 

// particlesJS.load('particles-js', '../assets/particles.json');
particlesJS("particles-js", {
	"particles": {
	  "number": {
		"value": 50,
		"density": {
		  "enable": true,
		  "value_area": 800
		}
	  },
	  "color": {
		"value": "#355568"
	  },
	  "shape": {
		"type": "circle",
		"stroke": {
		  "width": 0,
		  "color": "#000000"
		},
		"polygon": {
		  "nb_sides": 5
		},
		"image": {
		  "src": "img/github.svg",
		  "width": 100,
		  "height": 100
		}
	  },
	  "opacity": {
		"value": 0.5,
		"random": false,
		"anim": {
		  "enable": false,
		  "speed": 1,
		  "opacity_min": 0.1,
		  "sync": false
		}
	  },
	  "size": {
		"value": 3,
		"random": true,
		"anim": {
		  "enable": false,
		  "speed": 40,
		  "size_min": 0.1,
		  "sync": false
		}
	  },
	  "line_linked": {
		"enable": true,
		"distance": 150,
		"color": "#355568",
		"opacity": 0.4,
		"width": 1
	  },
	  "move": {
		"enable": true,
		"speed": 3,
		"direction": "none",
		"random": false,
		"straight": false,
		"out_mode": "out",
		"bounce": false,
		"attract": {
		  "enable": false,
		  "rotateX": 600,
		  "rotateY": 1200
		}
	  }
	},
	"interactivity": {
	  "detect_on": "canvas",
	  "events": {
		"onhover": {
		  "enable": false,
		  "mode": "grab"
		},
		"onclick": {
		  "enable": false,
		  "mode": "push"
		},
		"resize": true
	  },
	  "modes": {
		"grab": {
		  "distance": 140,
		  "line_linked": {
			"opacity": 1
		  }
		},
		"bubble": {
		  "distance": 400,
		  "size": 40,
		  "duration": 2,
		  "opacity": 8,
		  "speed": 3
		},
		"repulse": {
		  "distance": 200,
		  "duration": 0.4
		},
		"push": {
		  "particles_nb": 4
		},
		"remove": {
		  "particles_nb": 2
		}
	  }
	},
	"retina_detect": true
  });
