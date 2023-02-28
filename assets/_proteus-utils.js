'use strict';

let variation;

const initExperiment = (exp_id, iteration = "v0.01", force_activate_variation) => {
  let exp_handle = exp_id.replace("-", "").toLowerCase();

  if(force_activate_variation){
    variation = force_activate_variation;
  } else {
    if(getParam("qa").indexOf(exp_handle) > -1){
      variation = getParam("qa").replace(exp_handle, "");
    } else {
      variation = window.sessionStorage.getItem(exp_id);
    }
  }

  let exp_tag = exp_handle + variation;
  document.documentElement.classList.add(exp_tag);
  console.log(`init ${exp_id}${variation} -- ${iteration}`);

  return variation;
};

function waitForElement(selector) {
  return new Promise(function(resolve, reject) {
    var element = document.querySelector(selector);

    if(element) {
      resolve(element);
      return;
    }

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        var nodes = Array.from(mutation.addedNodes);
        for(var node of nodes) {
          if(node.matches && node.matches(selector)) {
            observer.disconnect();
            resolve(node);
            return;
          }
        };
      });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
}

// shim layer with setTimeout fallback
const requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 3000 / 60);
    };
})();

function waitUntil(test) {
  return new Promise(function(resolve){
    (function poll() {
      if (!test()) return requestAnimFrame(poll, 50);
      return resolve();
    })();
  });
};

const observeSelector = (selector, callback, options = {timeout: null, once: false, onTimeout: null}) => {
  const processed = {};

  if (options.timeout || options.onTimeout){
    console.log('------------------------------------------------------------------------------------------------------------------------------');
    console.log('[BMKBM] WARNING: observeSelector options timeout and onTimeout are not yet implemented.');
    console.log('------------------------------------------------------------------------------------------------------------------------------');
  }

  let obs;
  const obsCallback = () => {
    let elements = document.querySelectorAll(selector);
    if (elements.length) {
      for (let i = 0; i < elements.length; i++) {
        let el = elements[i];
        if (!processed[el]) {
          processed[el] = true;
          callback(el);
          if (options.once){
            obs.disconnect();
            return;
          }
        }
      }
    }
  };
  obsCallback();

  obs = new MutationObserver(obsCallback);
  obs.observe(document, {
    attributes: true,
    childList: true,
    subtree: true
  });
};

//-----------

const getParam = (name, optSearch) => {
  'use strict';
  optSearch = optSearch || location.search;
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
    results = regex.exec(optSearch);
  return results === null ?
    '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

//-----------

const loadScript = (url, optCallback) => {
  'use strict';
  const ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = url;
  if (typeof optCallback === 'function') {
    ga.onload = optCallback;
  }
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
};

//------

const get_cart_json = () => {
  // console.log(`get_cart_json()`);
  return $.ajax({
    type: 'GET',
    url: '/cart.js',
    dataType: 'json',
    success: function(data) {
      // return data;
    }
  });
};

const cart_add_item = (var_id, qty) => {
  console.log(`cart_add_item(${var_id}, ${qty})`);
  $.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: {quantity: qty, id: var_id},
    dataType: 'json'
  });
};

const cart_change = (key, qty) => {
  console.log(`cart_change(${key}, ${qty})`);
  $.ajax({
    type: 'POST',
    url: '/cart/change.js',
    data: {quantity: qty, id: key},
    dataType: 'json'
  });
};
