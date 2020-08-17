/* appearlazy.js 1.2.1 */
appear = (function(){
    'use strict';
    var scrollLastPos = null, scrollTimer = 0, scroll = {};
  
    function track(){
      var newPos = window.scrollY || window.pageYOffset;  // pageYOffset for IE9
      if ( scrollLastPos != null ){
        scroll.velocity = newPos - scrollLastPos;
        scroll.delta = (scroll.velocity >= 0) ? scroll.velocity : (-1 * scroll.velocity);
        // console.log('velocity:', scroll.velocity, 'delta:', scroll.delta);
      }
      scrollLastPos = newPos;
      if(scrollTimer){
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(function(){
        scrollLastPos = null;
      }, 30);
    }
    addEventListener('scroll', track, false);
  
    // determine if a given element (plus an additional "bounds" area around it) is in the viewport
    function viewable(el, bounds){
      var rect = el.getBoundingClientRect();
      return (
        (rect.top + rect.height) >= 0 &&
        (rect.left + rect.width) >= 0 &&
        (rect.bottom - rect.height) <= ( (window.innerHeight || document.documentElement.clientHeight) + bounds) &&
        (rect.right - rect.width) <= ( (window.innerWidth || document.documentElement.clientWidth) + bounds)
      );
    }
  
    return function(obj){
  
      return (function(obj){
        var initd = false, elements = [], elementsLength, reappear = [],
          appeared = 0, disappeared = 0, timer, deltaSet, opts = {}, done;
  
        // handle debouncing a function for better performance on scroll
        function debounce(fn, delay) {
          return function () {
            var self = this, args = arguments;
            clearTimeout(timer);
            // console.log('debounce()');
            timer = setTimeout(function () {
              fn.apply(self, args);
            }, delay);
          };
        }
  
        // called on scroll and resize event, so debounce the actual function that does
        // the heavy work of determining if an item is viewable and then "appearing" it
        function checkAppear() {
          if(scroll.delta < opts.delta.speed) {
            if(!deltaSet) {
              deltaSet = true;
              doCheckAppear();
              setTimeout(function(){
                deltaSet = false;
              }, opts.delta.timeout);
            }
          }
          (debounce(function() {
            doCheckAppear();
          }, opts.debounce)());
        }
  
        function begin() {
          // initial appear check before any scroll or resize event
          doCheckAppear();
  
          // add relevant listeners
          addEventListener('scroll', checkAppear, false);
          addEventListener('resize', checkAppear, false);
        }
  
        function end() {
          elements = [];
          if(timer) {
            clearTimeout(timer);
          }
          removeListeners();
        }
  
        function removeListeners() {
          console.log('remove listeners');
          removeEventListener('scroll', checkAppear, false);
          removeEventListener('resize', checkAppear, false);
        }
  
        function doCheckAppear() {
          if(done) {
            return;
          }
          // console.log('doCheckReappear()');
          elements.forEach(function(n, i){
            if(n && viewable(n, opts.bounds)) {
              // only act if the element is eligible to reappear
              if(reappear[i]) {
                // mark this element as not eligible to appear
                reappear[i] = false;
                // increment the count of appeared items
                appeared++;
                // console.log('appears:', appeared);
                // call the appear fn
                if(opts.appear) {
                  opts.appear(n);
                }
                // if not tracking reappears or disappears, need to remove node here
                if(!opts.disappear && !opts.reappear) {
                  // stop tracking this node, which is now viewable
                  elements[i] = null;
                }
              }
            } else {
              if(reappear[i] === false) {
                if(opts.disappear) {
                  opts.disappear(n);
                }
                // increment the dissappeared count
                disappeared++;
                console.log('disappears:', disappeared);
                // if not tracking reappears, need to remove node here
                if(!opts.reappear) {
                  // stop tracking this node, which is now viewable
                  elements[i] = null;
                }
              }
              // element is out of view and eligible to be appeared again
              reappear[i] = true;
            }
          });
  
          // remove listeners if all items have (re)appeared
          if(!opts.reappear && (!opts.appear || opts.appear && appeared === elementsLength) && (!opts.disappear || opts.disappear && disappeared === elementsLength)) {
            // ensure done is only called once (could be called from a trailing debounce/throttle)
            done = true;
            removeListeners();
            // all items have appeared, so call the done fn
            if(opts.done){
              opts.done();
            }
          }
        }
  
        function init() {
          // make sure we only init once
          if(initd) {
            return;
          }
          initd = true;
  
          // call the obj init fn
          if(opts.init) {
            opts.init();
          }
          // get the elements to work with
          var els;
          if(typeof opts.elements === 'function') {
            els = opts.elements();
          } else {
            els = opts.elements;
          }
          if(els) {
            //  put elements into an array object to work with
            elementsLength = els.length;
            for(var i = 0; i < elementsLength; i += 1) {
              elements.push(els[i]);
              reappear.push(true);
            }
            begin();
          }
        }
  
        return function(obj) {
          obj = obj || {};
  
          // assign the fn to execute when a node is visible
          opts = {
            // a function to be run when the dom is ready (allows for any setup work)
            init: obj.init,
            // either an array of elements or a function that will return an htmlCollection
            elements: obj.elements,
            // function to call when an element is "viewable", will be passed the element to work with
            appear: obj.appear,
            // function to call when an element is no longer "viewable", will be passed the element to work with
            disappear: obj.disappear,
            // function to call when all the elements have "appeared"
            done: obj.done,
            // keep tracking the elements
            reappear: obj.reappear,
            // the extra border around an element to make it viewable outside of the true viewport
            bounds: obj.bounds || 0,
            // the debounce timeout
            debounce: obj.debounce || 50,
            // appear.js will also check for items on continuous slow scrolling
            // you can controll how slow the scrolling should be  (deltaSpeed)
            // and when it will check again (deltaTimeout) after it has inspected the dom/viewport;
            delta: {
              speed: obj.deltaSpeed || 50,
              timeout: obj.deltaTimeout || 500
            }
          };
  
          // add an event listener to init when dom is ready
          addEventListener('DOMContentLoaded', init, false);
  
          // http://stackoverflow.com/questions/9900311/how-do-i-target-only-internet-explorer-10-for-certain-situations-like-internet-e/13971998#13971998
          var isIE10 = false;
          if (Function('/*@cc_on return document.documentMode===10@*/')()){
            isIE10 = true;
          }
          var completeOrLoaded = document.readyState === 'complete' || document.readyState === 'loaded';
  
          // call init if document is ready to be worked with and we missed the event
          if (isIE10) {
            if (completeOrLoaded) {
              init();
            }
          } else {
            if (completeOrLoaded || document.readyState === 'interactive') {
              init();
            }
          }
  
          return {
            // manually fire check for visibility of tracked elements
            trigger: function trigger(){
              doCheckAppear();
            },
            // pause tracking of elements
            pause: function pause(){
              removeListeners();
            },
            // resume tracking of elements after a pause
            resume: function resume(){
              begin();
            },
            // provide a means to stop monitoring all elements
            destroy: function destroy() {
              end();
            }
          };
  
        };
      }()(obj));
    };
  }());
  
  appear(
    (function() {
      'use strict';
      var nodes = [];
  
      function addClass(el) {
        if (el.classList) {
          el.classList.add('appeared');
        } else {
          // IE9 compat
          el.className += ' ' + 'appeared';
        }
      }
  
      // set the image src or background attribute
      function doReveal(el) {
        var orig = el.getAttribute('src') || false;
  
        el.addEventListener('error', function handler(e) {
          // on error put back the original image if available (usually a placeholder)
          console.log('error loading image', e);
          if (orig) {
            el.setAttribute('src', orig);
          }
          el.removeEventListener('error', handler); // hate this.
        });
  
        var src = el.getAttribute('data-src');
        if (src) {
          el.setAttribute('src', src);
          addClass(el);
          return;
        }
        src = el.getAttribute('data-bkg');
        if (src) {
          el.style.backgroundImage = 'url("' + src + '")';
          addClass(el);
          return;
        }
      }
  
      // find what element to work with, as we support containers of images
      function reveal(el) {
        if (el.hasChildNodes()) {
          // dealing with a container try and find children
          var els = el.querySelectorAll('[data-src], [data-bkg]');
          var elsl = els.length;
          if (elsl === 0) {
            // node has children, but none have the attributes, so reveal
            // the node itself (use case: div with a background)
            doReveal(el);
          } else {
            for (var j = 0; j < elsl; j++) {
              doReveal(els[j]);
            }
          }
        } else {
          doReveal(el);
        }
      }
  
      // reveal an image after a specified timeout
      function delayAppear(el, delay) {
        setTimeout(function() {
          reveal(el);
        }, delay);
      }
  
      return {
        // function executed when dom is interactive
        init: function init() {
          // find all elements with the class "appear"
          var els = document.getElementsByClassName('appear');
          var elsl = els.length;
          //  put html elements into an array object to work with
          for (var i = 0; i < elsl; i += 1) {
            // some images are revealed on a simple timeout, instead of
            // viewport appears. These delays appears must have
            // the appear class on them directly
            var delay = els[i].getAttribute('data-delay');
            if (delay) {
              delayAppear(els[i], delay);
            } else {
              nodes.push(els[i]);
            }
          }
        },
        elements: nodes,
        // function to run when an element is determined to be in view
        appear: reveal,
        // larger bounds area for reveal images
        bounds: 200
      };
  
    }())
  );