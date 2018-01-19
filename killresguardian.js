// ==UserScript==
// @id KillRESGuardian
// @name IITC Plugin: Kill RES Guardian
// @category Misc
// @version 1.0.0
// @namespace 
// @description RES Guardian 죽이기
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @grant none
// ==/UserScript==
// e72d05b6-4801-47c3-9f32-aa97f99ec8ad
// Wrapper function that will be stringified and injected
// into the document. Because of this, normal closure rules
// do not apply here.
function wrapper(plugin_info) {
  // Make sure that window.plugin exists. IITC defines it as a no-op function,
  // and other plugins assume the same.
  if(typeof window.plugin !== 'function') window.plugin = function() {};

  // Name of the IITC build for first-party plugins
  plugin_info.buildName = 'killresguardian';

  // Datetime-derived version of the plugin
  plugin_info.dateTimeVersion = '20171123103500';

  // ID/name of the plugin
  plugin_info.pluginId = 'killresguardian';

  // The entry point for this plugin.
  function setup() {
    window.addHook('publicChatDataAvailable', getAllData);

    var plextHistory = [];

    function getAllData() {
      var plexts = [];
      var plextsSortedByTimestamp;

      for (var x in chat._public.data) {
        plexts.push(chat._public.data[x]);
      }

      plextsSortedByTimestamp = _.sortBy(plexts, [function(o) {
        return o[0];
      }]);

      var html;
      var pattX = /\(\d*\.\d*/g;
      var pattY = /\d*\.\d*\)/g;

      for (var i = 0; i < plextsSortedByTimestamp.length; i++) {
        html = plextsSortedByTimestamp[i][2];

        if (html.includes('color:#0088FF') && html.includes('captured')) {
          var plext = {
            who: plextsSortedByTimestamp[i][3],
            when: new Date(plextsSortedByTimestamp[i][0]),
            X: html.match(pattX).toString().replace('(', ''),
            Y: html.match(pattY).toString().replace(')', '')
          };

          // console.log( 'who: ' + plextsSortedByTimestamp[i][3] );
          // console.log( 'when: ' + new Date(plextsSortedByTimestamp[i][0]) );
          // console.log( 'X: ' + html.match(pattX).toString().replace('(', '') );
          // console.log( 'Y: ' + html.match(pattY).toString().replace(')', '') );
          // console.log( 'portal: ' + html.split('help">')[1].split('</a>')[0] );

          var samePlext = false;

          for (var j = 0; j < plextHistory.length; j++) {
            if (_.isEqual(plextHistory[j], plext)) {
              samePlext = true;
              break;
            }
          }

          if (!samePlext) {
            plextHistory.push(plext);
          }

          // console.log(plextHistory);
        }
      }
    }
  }

  // Add an info property for IITC's plugin system
  setup.info = plugin_info;

  // Make sure window.bootPlugins exists and is an array
  if (!window.bootPlugins) window.bootPlugins = [];
  // Add our startup hook
  window.bootPlugins.push(setup);
  // If IITC has already booted, immediately run the 'setup' function
  if (window.iitcLoaded && typeof setup === 'function') setup();
}

// <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.4/lodash.min.js"></script>
var scriptLodash = document.createElement('script');

scriptLodash.setAttribute('src', 'https://cdn.jsdelivr.net/npm/lodash@4.17.4/lodash.min.js');
(document.body || document.head || document.documentElement).appendChild(scriptLodash);

// Create a script element to hold our content script
var script = document.createElement('script');
var info = {};

// GM_info is defined by the assorted monkey-themed browser extensions
// and holds information parsed from the script header.
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
  info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description
  };
}

// Create a text node and our IIFE inside of it
var textContent = document.createTextNode('('+ wrapper +')('+ JSON.stringify(info) +')');
// Add some content to the script element
script.appendChild(textContent);
// Finally, inject it... wherever.
(document.body || document.head || document.documentElement).appendChild(script);