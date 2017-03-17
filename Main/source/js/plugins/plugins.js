/**
 * business-qld
 * Plugins JS
 *
 * version: 0.0.1
 * file:    plugins.min.js
 * author:  Squiz Australia
 * modified: Fri Jan 13 2017 11:29:34 GMT+1000 (AEST)
 * @preserve
 */

/*
 * Table of Contents
 *
 * - Global
 * - Modules

 */

/*
--------------------
Global
--------------------
*/

// Fallback for inadvertant console statements
if (!window.console) {
    window.console = {
        log:   function(){},
        warn:  function(){},
        error: function(){}
    };
}

/*eslint no-unused-vars: 0*/
// Source: http://davidwalsh.name/javascript-debounce-function
function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            timeout = null;
            func.apply(context, args);
        }, wait);
    };
}

/*
--------------------
Modules
--------------------
*/

//# sourceMappingURL=plugins.min.js.map
