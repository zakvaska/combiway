// $(document).scrollTop(6600);
let i = 0;
let startPos = 0,
	currentPage = 0,
	prevPage = -100,
	calculatedPage = 0,
	scrollTop = 0,
	scrollRatio = 0,
	oldAngle = 24,
	currentAngle = 0,
	newAngle = 0;
let inactiveImage,
	inactiveImageIndex,
	activeImage,
	activeImageIndex;
const windowHeight = $(window).height();
//multiply by 2 because the last scroll does not have a corresponding icon
const scrollHeight = $(document).height() - windowHeight * 2;			
const startAngle = 24;
const fullRotationAngle = 48;
const iconsNumber = 7;
const $revolver = $('#scroll-spy-menu');
const $token = $('#token');
const $menuItems = $('.circle-menu-item');
const $bus = $('#bus');
const $people = $('#people');
const $tokenInfo = $('#token-info');
$menuItems.each(function(index, item) {	
	$(item).data({		
		scrollPos: index * windowHeight,
		inactiveImage: $(this).find('.inactive-img'),
		activeImage: $(this).find('.active-img')
	});
		
	console.log($(item).data());		
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

// const $path = $('g[role="menuitem"]:nth-child(666) > path');
// $path.css('fill', 'white');

const managePageSwitch = (animate) => {	
	let $prevItem, $currentItem;
	$prevItem = $menuItems.eq(prevPage);
	
	$currentItem = $menuItems.eq(currentPage);
	if (animate) {
		if ($prevItem.length > 0) $prevItem.removeClass('active').data('status', 'inactive')
								// .css('transform', $prevItem.css('transform').replace(' scale(1.2)', ''))
								.data('activeImage').removeClass('active-in').addClass('active-out');		
		// $currentItem.css('transform', $currentItem.css('transform').concat(' scale(1.2)'))
		if ($currentItem.length > 0) $currentItem.addClass('active').data('status', 'active').data('activeImage').removeClass('active-out').addClass('active-in');
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
const rotateMenu = (from, to, animate) => {		
	if (animate) {							
		// we use a pseudo object for the animation
		// (starts from `0` to `angle`), you can name it as you want		
		$({deg: from}).animate({deg: to}, {
			duration: 2000 * scrollRatio,
			// delay: 1000,
			// easing: 'ease-in-out',
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
				managePageSwitch(true);
			}
		});									
		$revolver.animate({
			opacity: 1					
			}, {
			duration: 2000 //* scrollRatio					
		});	
	} else {
		$revolver.css('transform', `rotateZ(${to}deg)`);		
		$menuItems.each(function(index, item) {
			$(item).data('inactiveImage').css('transform', `rotateZ(${to * (-1)}deg)`);
			$(item).data('activeImage').css('transform', `rotateZ(${to * (-1)}deg)`);
		});
	}
};

const getAngle = (scrollTop) => {
			
	// console.log(windowHeight);				
	scrollRatio = (scrollTop / scrollHeight);
	
	// let prev = prevPage;
	// let current = currentPage;
	
	// `0scroll   -> 24deg`
	// `0.5scroll -> 0deg`
	// `1 scroll  -> -24deg`		
	return fullRotationAngle * scrollRatio * (-1) + startAngle;
};

const manageScrollPos = (initialLoad, animateIconSwitch) => {
	scrollTop = $(window).scrollTop();
	newAngle = getAngle(scrollTop);
	rotateMenu(oldAngle, newAngle, initialLoad);	
	// 0...docHeight * 0.5 - 1 -> 0
	// docHeight * 0.5...docHeight * 1.5 - 1 -> 1
	// docHeight * 1.5...docHeight * 2.5 - 1 -> 2
	calculatedPage = Math.round(scrollTop / windowHeight);

	// if (initialLoad && calculatedPage === currentPage) {
	// 	managePageSwitch(true);
	// }
	if (calculatedPage !== currentPage) {
		if (!initialLoad) prevPage = currentPage;
		currentPage = calculatedPage;
		// console.log('switch');
		managePageSwitch(true);
	}
};

if ($(window).width() > 1200) {
	$(document).on('scroll', function() {		
		manageScrollPos(false);
	});
}


$menuItems.on('click', function() {
	
	$(window).scrollTop($(this).data('scrollPos'));
});

$menuItems.on('mouseenter', function() {
	if ($(this).data('status') !== 'active') {
		$(this).data('activeImage').toggleClass('active-out active-in');
	}	
});

$menuItems.on('mouseleave', function() {
	if ($(this).data('status') !== 'active') {				
		$(this).data('activeImage').toggleClass('active-out active-in');
	}	
});

$(function() {
	if ($(window).width() >= 1200) manageScrollPos(true);			
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
