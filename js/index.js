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
const imageNameTempl = 'COMBIWAY-';
const $bus = $('#bus');
const $people = $('#people');
const $tokenInfo = $('#token-info');
$menuItems.each(function(index, item) {
	// console.log(index * windowHeight);
	inactiveImage = $(item).css('background-image');
	// console.log(prevImage);
	
	// console.log(prevImage.indexOf(imageNameTempl));
	startPos = inactiveImage.indexOf(imageNameTempl) + imageNameTempl.length;
	inactiveImageIndex = inactiveImage.substr(startPos, 2);
	activeImageIndex = String(Number(inactiveImageIndex) + $menuItems.length); 
	activeImage = inactiveImage.replace(inactiveImageIndex, activeImageIndex);
	// console.log(prevImage.substr(startPos, 2));
	$(item).data({
		scrollPos: index * windowHeight,
		inactiveImage: inactiveImage,
		activeImage: activeImage
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


const managePageSwitch = (animate) => {	
	let $prevItem, $currentItem;
	$prevItem = $menuItems.eq(prevPage);
	
	// $prevItem.data('status', 'inactive')
	// .animate({
	// 	'background-position-x': 100,
	// 	'opacity': 0
	// }, 500, function() {
	// 	$(this).css({
	// 		'background-position-x': -100,
	// 		'background-image': $prevItem.data('inactiveImage')				
	// 	}).animate({
	// 		'background-position-x': 0,
	// 		'opacity': 1
	// 	}, 500);
	// });
	$currentItem = $menuItems.eq(currentPage);	
	if (animate) {
		$prevItem.data('status', 'inactive').removeClass('active-in').addClass('active-out');
		$currentItem.data('status', 'active').removeClass('active-out').addClass('active-in');
		// $currentItem.data('status', 'active');
		// .animate({
		// 	'background-position-x': 100,
		// 	'opacity': 0
		// }, 500, function() {
		// 	$(this).css({
		// 		'background-position-x': -100,
		// 		'background-image': $currentItem.data('activeImage')				
		// 	}).animate({
		// 		'background-position-x': 0,
		// 		'opacity': 1
		// 	}, 500);
		// });		
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
				$menuItems.css('transform', `rotateZ(${now * (-1)}deg)`);
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
		$menuItems.css('transform', `rotateZ(${to * (-1)}deg)`);
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
	// if ($(this).data('status') !== 'active') {
		// $(this).fadeOut(100).css('background-image', $(this).data('activeImage')).fadeIn(100);
		// $(this).css('background-image', $(this).data('activeImage'));		
	// }	
	if (!$(this).hasClass('active-in')) {	
		$(this).toggleClass('active-out active-in');
	}
});

$menuItems.on('mouseleave', function() {
	// if ($(this)[0] !== $menuItems.eq(currentPage)[0]) {
	if ($(this).data('status') !== 'active') {			
	// 	$(this).css('background-image', $(this).data('inactiveImage'));
	// }		
		$(this).toggleClass('active-out active-in');
	}	
});

$(function() {
	if ($(window).width() >= 1200) manageScrollPos(true);			
}); 
