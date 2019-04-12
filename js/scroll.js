

window.smoothScroll = (function (window, document, undefined) {

  'use strict';

  // Default settings
  // Private {object} variable
  let _defaults = {
    speed: 500,
    easing: 'easeInOutCubic',
    updateURL: false,
    callbackBefore: function () {},
    callbackAfter: function () {}
  };

  // Merge default settings with user options
  // Private method
  // Returns an {object}
  let _mergeObjects = function ( original, updates ) {
    for (var key in updates) {
      original[key] = updates[key];
    }
    return original;
  };

  // Calculate the easing pattern
  // Private method
  // Returns a decimal number
  let _easingPattern = function ( type, time ) {
    if ( type == 'easeInQuad' ) return time * time; // accelerating from zero velocity
    if ( type == 'easeOutQuad' ) return time * (2 - time); // decelerating to zero velocity
    if ( type == 'easeInOutQuad' ) return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
    if ( type == 'easeInCubic' ) return time * time * time; // accelerating from zero velocity
    if ( type == 'easeOutCubic' ) return (--time) * time * time + 1; // decelerating to zero velocity
    if ( type == 'easeInOutCubic' ) return time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
    if ( type == 'easeInQuart' ) return time * time * time * time; // accelerating from zero velocity
    if ( type == 'easeOutQuart' ) return 1 - (--time) * time * time * time; // decelerating to zero velocity
    if ( type == 'easeInOutQuart' ) return time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
    if ( type == 'easeInQuint' ) return time * time * time * time * time; // accelerating from zero velocity
    if ( type == 'easeOutQuint' ) return 1 + (--time) * time * time * time * time; // decelerating to zero velocity
    if ( type == 'easeInOutQuint' ) return time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
    return time; // no easing, no acceleration
  };

  // Calculate how far to scroll
  // Private method
  // Returns an integer
  let _getEndLocation = function ( anchor, headerHeight ) {
    let location = 0;
    if (anchor.offsetParent) {
      do {
        location += anchor.offsetTop;
        anchor = anchor.offsetParent;
      } while (anchor);
    }
    location = location - headerHeight;
    if ( location >= 0 ) {
      return location;
    } else {
      return 0;
    }
  };

  // Convert data-options attribute into an object of key/value pairs
  // Private method
  // Returns an {object}
  let _getDataOptions = function ( options ) {

    if ( options === null || options === undefined  ) {
      return {};
    } else {
      let settings = {}; // Create settings object
      options = options.split(';'); // Split into array of options

      // Create a key/value pair for each setting
      options.forEach( function(option) {
        option = option.trim();
        if ( option !== '' ) {
          option = option.split(':');
          settings[option[0]] = option[1].trim();
        }
      });

      return settings;
    }

  };

  // Update the URL
  // Private method
  // Runs functions
  let _updateURL = function ( anchor, url ) {
    if ( (url === true || url === 'true') && history.pushState ) {
      history.pushState( {pos:anchor.id}, '', anchor );
    }
  };

  // Start/stop the scrolling animation
  // Public method
  // Runs functions
  let animateScroll = function ( toggle, anchor, options, event ) {

    // Options and overrides
    options = _mergeObjects( _defaults, options || {} ); // Merge user options with defaults
    let overrides = _getDataOptions( toggle ? toggle.getAttribute('data-options') : null );
    let speed = overrides.speed || options.speed;
    let easing = overrides.easing || options.easing;
    let updateURL = overrides.updateURL || options.updateURL;

    // Selectors and letiables
    let headerHeight = 55;
    let startLocation = window.pageYOffset; // Current location on the page
    let endLocation = _getEndLocation( document.querySelector(anchor), headerHeight ); // Scroll to location
    let animationInterval; // interval timer
    let distance = endLocation - startLocation; // distance to travel
    let timeLapsed = 0;
    let percentage, position;

    // Prevent default click event
    if ( toggle && toggle.tagName === 'A' && event ) {
      event.preventDefault();
    }

    // Update URL
    _updateURL(anchor, updateURL);

    // Stop the scroll animation when it reaches its target (or the bottom/top of page)
    // Private method
    // Runs functions
    let _stopAnimateScroll = function (position, endLocation, animationInterval) {
      let currentLocation = window.pageYOffset;
      if ( position == endLocation || currentLocation == endLocation || ( (window.innerHeight + currentLocation) >= document.body.scrollHeight ) ) {
        clearInterval(animationInterval);
        options.callbackAfter( toggle, anchor ); // Run callbacks after animation complete
      }
    };

    // Loop scrolling animation
    // Private method
    // Runs functions
    let _loopAnimateScroll = function () {
      timeLapsed += 16;
      percentage = ( timeLapsed / speed );
      percentage = ( percentage > 1 ) ? 1 : percentage;
      position = startLocation + ( distance * _easingPattern(easing, percentage) );
      window.scrollTo( 0, Math.floor(position) );
      _stopAnimateScroll(position, endLocation, animationInterval);
    };

    // Set interval timer
    // Private method
    // Runs functions
    let _startAnimateScroll = function () {
      options.callbackBefore( toggle, anchor ); // Run callbacks before animating scroll
      animationInterval = setInterval(_loopAnimateScroll, 16);
    };

    // Reset position to fix weird iOS bug
    // https://github.com/cferdinandi/smooth-scroll/issues/45
    if ( window.pageYOffset === 0 ) {
      window.scrollTo( 0, 0 );
    }

    // Start scrolling animation
    _startAnimateScroll();

  };

  // Initialize Smooth Scroll
  // Public method
  // Runs functions
  let init = function ( options ) {

    // Feature test before initializing
    if ( 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach ) {

      // Selectors and letiables
      options = _mergeObjects( _defaults, options || {} ); // Merge user options with defaults
      let toggles = document.querySelectorAll('[data-scroll]'); // Get smooth scroll toggles

      // When a toggle is clicked, run the click handler
      Array.prototype.forEach.call(toggles, function (toggle, index) {
        toggle.addEventListener('click', animateScroll.bind( null, toggle, toggle.getAttribute('href'), options ), false);
      });

    }

  };

  // Return public methods
  return {
    init: init,
    animateScroll: animateScroll
  };

})(window, document);
