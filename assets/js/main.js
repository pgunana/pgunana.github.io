/*
	Massively by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)',
		xxsmall: '(max-width: 360px)'
	});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				$bg = $('<div class="bg"></div>').appendTo($t),
				on, off;

			on = function() {

				$bg
					.removeClass('fixed')
					.css('transform', 'matrix(1,0,0,1,0,0)');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

					});

			};

			off = function() {

				$bg
					.addClass('fixed')
					.css('transform', 'none');

				$window
					.off('scroll._parallax');

			};
            

// Gallery.
			$('.gallery')
				.wrapInner('<div class="inner"></div>')
				.prepend(skel.vars.mobile ? '' : '<div class="forward"></div><div class="backward"></div>')
				.scrollex({
					top:		'30vh',
					bottom:		'30vh',
					delay:		50,
					initialize:	function() {
						$(this).addClass('is-inactive');
					},
					terminate:	function() {
						$(this).removeClass('is-inactive');
					},
					enter:		function() {
						$(this).removeClass('is-inactive');
					},
					leave:		function() {

						var $this = $(this);

						if ($this.hasClass('onscroll-bidirectional'))
							$this.addClass('is-inactive');

					}
				})
.children('.inner')
					//.css('overflow', 'hidden')
					.css('overflow-y', skel.vars.mobile ? 'visible' : 'hidden')
					.css('overflow-x', skel.vars.mobile ? 'scroll' : 'hidden')
					.scrollLeft(0);

			// Style #1.
				// ...

			// Style #2.
				$('.gallery')
					.on('wheel', '.inner', function(event) {

						var	$this = $(this),
							delta = (event.originalEvent.deltaX * 10);

						// Cap delta.
							if (delta > 0)
								delta = Math.min(25, delta);
							else if (delta < 0)
								delta = Math.max(-25, delta);

						// Scroll.
							$this.scrollLeft( $this.scrollLeft() + delta );

					})
					.on('mouseenter', '.forward, .backward', function(event) {

						var $this = $(this),
							$inner = $this.siblings('.inner'),
							direction = ($this.hasClass('forward') ? 1 : -1);

						// Clear move interval.
							clearInterval(this._gallery_moveIntervalId);

						// Start interval.
							this._gallery_moveIntervalId = setInterval(function() {
								$inner.scrollLeft( $inner.scrollLeft() + (5 * direction) );
							}, 10);

					})
					.on('mouseleave', '.forward, .backward', function(event) {

						// Clear move interval.
							clearInterval(this._gallery_moveIntervalId);

					});
			// Disable parallax on ..
				if (skel.vars.browser == 'ie'		// IE
				||	skel.vars.browser == 'edge'		// Edge
				||	window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
				||	skel.vars.mobile)				// Mobile devices
					off();

			// Enable everywhere else.
				else {

					skel.on('!large -large', on);
					skel.on('+large', off);

				}

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$wrapper = $('#wrapper'),
			$header = $('#header'),
			$nav = $('#nav'),
			$main = $('#main'),
			$navPanelToggle, $navPanel, $navPanelInner;

		// Disable animations/transitions until the page has loaded.
			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Scrolly.
			$('.scrolly').scrolly();

		// Background.
			$wrapper._parallax(0.925);

		// Nav Panel.

			// Toggle.
				$navPanelToggle = $(
					'<a href="#navPanel" id="navPanelToggle">Menu</a>'
				)
					.appendTo($wrapper);

				// Change toggle styling once we've scrolled past the header.
					$header.scrollex({
						bottom: '5vh',
						enter: function() {
							$navPanelToggle.removeClass('alt');
						},
						leave: function() {
							$navPanelToggle.addClass('alt');
						}
					});

			// Panel.
				$navPanel = $(
					'<div id="navPanel">' +
						'<nav>' +
						'</nav>' +
						'<a href="#navPanel" class="close"></a>' +
					'</div>'
				)
					.appendTo($body)
					.panel({
						delay: 500,
						hideOnClick: true,
						hideOnSwipe: true,
						resetScroll: true,
						resetForms: true,
						side: 'right',
						target: $body,
						visibleClass: 'is-navPanel-visible'
					});

				// Get inner.
					$navPanelInner = $navPanel.children('nav');

				// Move nav content on breakpoint change.
					var $navContent = $nav.children();

					skel.on('!medium -medium', function() {

						// NavPanel -> Nav.
							$navContent.appendTo($nav);

						// Flip icon classes.
							$nav.find('.icons, .icon')
								.removeClass('alt');

					});

					skel.on('+medium', function() {

						// Nav -> NavPanel.
						$navContent.appendTo($navPanelInner);

						// Flip icon classes.
							$navPanelInner.find('.icons, .icon')
								.addClass('alt');

					});

				// Hack: Disable transitions on WP.
					if (skel.vars.os == 'wp'
					&&	skel.vars.osVersion < 10)
						$navPanel
							.css('transition', 'none');

		// Intro.
			var $intro = $('#intro');

			if ($intro.length > 0) {

				// Hack: Fix flex min-height on IE.
					if (skel.vars.browser == 'ie') {
						$window.on('resize.ie-intro-fix', function() {

							var h = $intro.height();

							if (h > $window.height())
								$intro.css('height', 'auto');
							else
								$intro.css('height', h);

						}).trigger('resize.ie-intro-fix');
					}

				// Hide intro on scroll (> small).
					skel.on('!small -small', function() {

						$main.unscrollex();

						$main.scrollex({
							mode: 'bottom',
							top: '25vh',
							bottom: '-50vh',
							enter: function() {
								$intro.addClass('hidden');
							},
							leave: function() {
								$intro.removeClass('hidden');
							}
						});

					});

				// Hide intro on scroll (<= small).
					skel.on('+small', function() {

						$main.unscrollex();

						$main.scrollex({
							mode: 'middle',
							top: '15vh',
							bottom: '-15vh',
							enter: function() {
								$intro.addClass('hidden');
							},
							leave: function() {
								$intro.removeClass('hidden');
							}
						});

				});

			}
        

	});

})(jQuery);