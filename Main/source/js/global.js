/*global jQuery*/
/**
 * business-qld
 * Global JS
 *
 * version: 0.0.1
 * file:    global.js
 * author:  Squiz Australia
 * change log:
 *     Fri Oct 21 2016 09:11:50 GMT+1000 (AEST) - First revision
 */

/*
 * Table of Contents
 *
 * - Global
 * - Modules

 */
'use strict';
/*
--------------------
Global
--------------------
*/
//  Declare JS Enabled.
$('body').removeClass('no-js').addClass('js-enabled');

var busq = {
	fn: {},
	vars: {}
};

// Setting the Regions within Queensland as used by Business Queensland
busq.vars.regions = ['All', 'Central Queensland', 'Central West Queensland',
                    'Darling Downs', 'Far North Queensland', 'North Queensland',
                    'North West Queensland', 'South East Queensland',
                    'South West Queensland', 'Wide Bay-Burnett'];

// Setting a global check to identify which viewport is active
var responsive = $('#responsive').css('z-index');


/*
--------------------
Modules
--------------------
*/

(function($){
    'use strict';

    if($('.content__tile-form-datepicker').length > 0){
        $('.content__tile-form-datepicker').datepicker();
    }
}(jQuery));


(function($){
    'use strict';

    busq.fn.reSize = debounce(function(){
	    busq.fn.determineWidth();

	    if( $('.landing-accordion').length > 0){
	        busq.fn.resetLandingAccordion();
	    }
    },250);

    $(window).resize(function () {
	    busq.fn.reSize();
	});

    // determine width - 0 = mobile, 1 = tablet, 2 = desktop
    busq.fn.determineWidth = function(){
        var element = document.getElementById('resChecker');
        var z;
        var style;
        if (typeof (lteIE8) === "undefined") {
            if (typeof (window.getComputedStyle) === "undefined") {
                z = parseInt(element.currentStyle['z-index']);
            } else{
                style = window.getComputedStyle(element, "");
                z = parseInt(style.getPropertyValue('z-index'));
            }
        } else {
            // ie8 or lower so set to desktop only
            z = 3;
        }
        return z;
    }

    busq.fn.discoverShowRegionQuestion = function(event){
        var target = $('#q3143_q4_0');
        var question = $('.discover-question--region');

        if(target.prop('checked')){
            question.slideDown(400);
        } else {
            question.slideUp(400);
        }
    };

    busq.fn.captureABLIS = function(){
        var industryField = $('#q3143_q1');
        var ablisDataField = $('#ablisdata');
        var industries = ablisDataField.val();

        industryField.attr('value', industries);
    };

    busq.fn.captureSubmissionData = function(event){
        busq.fn.captureABLIS();
        busq.fn.saveDiscoverChoices();
    };

    $('body').on('change', '.discover-question--location input', busq.fn.discoverShowRegionQuestion);
    $('body').on('submit', '.discover__form form', busq.fn.captureSubmissionData);
}(jQuery));

(function($){
    'use strict';

    /* Form overrides */

    // Style changes for Matrix Custom Forms default output
    busq.fn.formOverrides = function(){
        var selectFields = $('select[multiple=multiple]');
        var dayFields = $('[id$=_value_d]');
        var monthFields = $('[id$=_value_m]');
        var yearFields = $('[id$=_value_y]');
        var hourFields = $('[id$=_value_h]');
        var minuteFields = $('[id$=_value_i]');
        var secondFields = $('[id$=_value_s]');

        // Remove select arrow from multiselect input
        if(selectFields.length > 0){
            selectFields.each(function(key, val){
                $(val).parents('.sq-form-question').addClass('sq-form-question-select-multiple');
            });
        }

        // Wrap date elements in containers
        var dateClassInput = 'sq-form-question-date';
        var dateClassSelect = 'sq-form-question-date sq-form-question-date-select';

        if(dayFields.length > 0){
            dayFields.each(function(key, val){
                if($(val).is('input')){
                    $(val).prev().addBack().wrapAll('<div class="' + dateClassInput + '"/>');
                } else {
                    $(val).prev().addBack().wrapAll('<div class="' + dateClassSelect + '"/>');
                }

                $(val).wrap('<div class="sq-form-question-answer" />');
            });
        }

        if(monthFields.length > 0){
            monthFields.each(function(key, val){
                if($(val).is('input')){
                    $(val).prev().addBack().wrapAll('<div class="' + dateClassInput + '"/>');
                } else {
                    $(val).prev().addBack().wrapAll('<div class="' + dateClassSelect + '"/>');
                }

                $(val).wrap('<div class="sq-form-question-answer" />');
            });
        }

        if(yearFields.length > 0){
            yearFields.each(function(key, val){
                if($(val).is('input')){
                    $(val).prev().addBack().wrapAll('<div class="' + dateClassInput + '"/>');
                } else {
                    $(val).prev().addBack().wrapAll('<div class="' + dateClassSelect + ' sq-form-question-date-select-year"/>');
                }

                $(val).wrap('<div class="sq-form-question-answer" />');

                // Add clearing div for d/m/y h/m/s format
                $(val).parents('.sq-form-question-date-select-year').after('<div class="date-separator"></div>');
            });
        }

        if(hourFields.length > 0){
            hourFields.each(function(key, val){
                if($(val).is('input')){
                    $(val).prev().addBack().wrapAll('<div class="' + dateClassInput + '"/>');
                } else {
                    $(val).prev().addBack().wrapAll('<div class="' + dateClassSelect + '"/>');
                }

                $(val).wrap('<div class="sq-form-question-answer" />');
            });
        }

        if(minuteFields.length > 0){
            minuteFields.each(function(key, val){
                if($(val).is('input')){
                    $(val).prev().addBack().wrapAll('<div class="' + dateClassInput + '"/>');
                } else {
                    $(val).prev().addBack().wrapAll('<div class="' + dateClassSelect + '"/>');
                }

                $(val).wrap('<div class="sq-form-question-answer" />');
            });
        }

        if(secondFields.length > 0){
            secondFields.each(function(key, val){
                if($(val).is('input')){
                    $(val).prev().addBack().wrapAll('<div class="' + dateClassInput + '"/>');
                } else {
                    $(val).prev().addBack().wrapAll('<div class="' + dateClassSelect + '"/>');
                }

                $(val).wrap('<div class="sq-form-question-answer" />');
            });
        }
    };

    // Load the feedback form
    busq.fn.feedbackFormModal = function() {
        $('.feedbackModal').click(function() {
            var targeturl = $(this).data('targeturl');
            var modalWrapper = $('#feedbackForm').find('.modal-body');
            modalWrapper.load(targeturl, function() {
                modalWrapper.addClass('in');
            });
        });
    };


    if($('form').length > 0){
        busq.fn.formOverrides();
    }



    busq.fn.feedbackFormModal();
}(jQuery));
(function($){
    'use strict';


}(jQuery));
(function($){
    'use strict';


}(jQuery));
(function($){
    'use strict';

    // Pause and play the carousel
    busq.fn.toggleCarouselState = function(event){
        var target = $(event.target);
        var carousel = $('#busq-carousel');

        if(target.hasClass('fa-pause')){
            carousel.carousel("pause");
            target.removeClass('fa-pause');
            target.addClass('fa-play');
        } else {
            carousel.carousel("cycle");
            target.removeClass('fa-play');
            target.addClass('fa-pause');
        }

        return false;
    }

    $('body').on('click', '.carousel__state', busq.fn.toggleCarouselState);
}(jQuery));
(function($){
    'use strict';


}(jQuery));
(function($){
    'use strict';


}(jQuery));
(function($){
    'use strict';

    // Toggle the main navigation's submenus
    busq.fn.footerMenuToggle = function(event){
        var target = $(event.target);
        var wrapper = target.parents('.footer__navigation-list-item');
        var submenu = wrapper.find('ul');

        // If on mobile
        if($('#responsive').css('z-index') === '1'){
            // If there is a submenu, deactivate the link
            if(submenu.length !== 0){
                // Show or hide mobile menu with active class
                if(wrapper.hasClass('active--footer-navigation')){
                    submenu.slideUp(200);
                    wrapper.removeClass('active--footer-navigation');
                } else {
                    submenu.slideDown(200);
                    wrapper.addClass('active--footer-navigation');
                }

                return false;
            }
        }
    };

    // Separate content into multiple lists
    busq.fn.splitListContent = function(element, number, extras){
        var wrapper = $(element);
        var sublist = wrapper.find('ul');
        var items = sublist.children();
        var itemsRemaining = items.length;
        var listsRemaining = number;
        var listCounter = 0;
        var itemsPerList = 0;

        var listClass;
        var itemCounter;
        var item;
        var dynamicListsWrapper;
        var dynamicLists;

        // Set up the container for the new lists
        wrapper.append($('<div class="dynamic-lists__wrapper"></div>'));
        wrapper.attr('data-dynamic-lists', number);

        // Preserve the class of the list
        listClass = sublist.attr('class');

        // Iterate over the number of columns
        while(listsRemaining > 0){
            // Create a new list
            dynamicListsWrapper = wrapper.find('.dynamic-lists__wrapper');
            dynamicListsWrapper.append($('<ul class="' + listClass + ' ' + extras + ' list--' + listCounter + '"></ul>'));

            // Set up the counters
            itemsPerList = Math.ceil(itemsRemaining / listsRemaining);
            itemCounter = 0;

            // Populate the dynamic list
            while(itemCounter < itemsPerList){
                item = $(items.eq(itemCounter));
                item.appendTo(dynamicListsWrapper.find('.list--' + listCounter));
                itemCounter++;
            }

            // Update the stored list reference for the next iteration
            sublist = wrapper.find('> ul');
            items = sublist.children();
            itemsRemaining = items.length;
            listsRemaining--;
            listCounter++;
        }

        // Replace the original list with the new lists
        dynamicLists = wrapper.find('.dynamic-lists__wrapper').detach();
        wrapper.find('ul').remove();
        wrapper.append(dynamicLists.html());
    };

    // Split out footer lists into multiples
    if($('.footer__navigation-list').length > 0){
        busq.fn.splitListContent('.footer__navigation-list-item.col-md-6 .footer__navigation-links', 2, 'col-md-6');
    }

    // QLD Government Other Languages switcher
    var b = ['<span lang="ar" xml:lang="ar">العربية</span>', '<span lang="el" xml:lang="el">Ελληνικά</span>', '<span lang="pl" xml:lang="pl">Polski</span>', '<span lang="bs" xml:lang="bs">Bosanksi</span>', '<span lang="id" xml:lang="id">Bahasa Indonesia</span>', '<span lang="ru" xml:lang="ru">Русский</span>', '<span lang="zh" xml:lang="zh">中文</span>', '<span lang="it" xml:lang="it">Italiano</span>', '<span lang="sr" xml:lang="sr">српски</span>', '<span lang="hr" xml:lang="hr">Hrvatski</span>', '<span lang="ja" xml:lang="ja">日本語</span>', '<span lang="es" xml:lang="es">Español</span>', '<span lang="fr" xml:lang="fr">Français</span>', '<span lang="ko" xml:lang="ko">한국어</span>', '<span lang="tl" xml:lang="tl">Tagalog</span>', '<span lang="de" xml:lang="de">Deutsch</span>', '<span lang="fa" xml:lang="fa">فارسی</span>', '<span lang="vi" xml:lang="vi">Tiếng Việt</span>'],
        c = function c() {
        $('#other-languages a').empty().append(b[Math.floor(Math.random() * b.length)] + ' (Other languages)'), setTimeout(c, 5e3);
    };
    c();

    $('body').on('click', '.footer__navigation-title a', busq.fn.footerMenuToggle);
}(jQuery));
(function($){
    'use strict';


}(jQuery));
(function($){
    'use strict';

    // Toggle the mobile search and hide mobile menu
    busq.fn.mobileSearchToggle = function(event){
        responsive = $('#responsive').css('z-index');

        // If you're on a mobile or tablet viewport
        if(responsive !== '3'){
            var target = $(event.target);
            var wrapper = $('.header__navigation');
            var form = $('.header__mobile-search');
            var menu = $('.header__navigation--list');

            // Show or hide mobile search with active class
            if(wrapper.hasClass('active--mobile-search')){
                form.slideUp(200);
                wrapper.removeClass('active--mobile-search');
            } else {
                form.slideDown(200);
                wrapper.addClass('active--mobile-search');
            }

            // Hide menu if it is showing
            if(wrapper.hasClass('active--mobile-navigation')){
                menu.slideUp(150);
                wrapper.removeClass('active--mobile-navigation');
            }

            return false;
        }
    };

    // Toggle the mobile menu and hide mobile search
    busq.fn.mobileMenuToggle = function(event){
        var target = $(event.target);
        var wrapper = $('.header__navigation');
        var menu = $('.header__navigation--list');
        var form = $('.header__mobile-search');

        // Show or hide mobile menu with active class
        if(wrapper.hasClass('active--mobile-navigation')){
            menu.slideUp(200);
            wrapper.removeClass('active--mobile-navigation');
        } else {
            menu.slideDown(200);
            wrapper.addClass('active--mobile-navigation');
        }

        // Hide search form if it is showing
        if(wrapper.hasClass('active--mobile-search')){
            form.slideUp(150);
            wrapper.removeClass('active--mobile-search');
        }

        return false;
    };

    // Toggle the main navigation's submenus
    busq.fn.mobileSubmenuToggle = function(event){
        var target = $(event.target);
        var wrapper = target.parent();
        var submenu = wrapper.find('ul');
        responsive = $('#responsive').css('z-index');

        // If there is a submenu, deactivate the link
        // If you're on a mobile viewport
        if(submenu.length !== 0 && responsive !== '3'){
            // Show or hide mobile menu with active class
            if(wrapper.hasClass('active--mobile-submenu')){
                submenu.slideUp(200);
                wrapper.removeClass('active--mobile-submenu');
            } else {
                submenu.slideDown(200);
                wrapper.addClass('active--mobile-submenu');
            }

            return false;
        }
    };

    $('body').on('click', '.header__mobile-icon--search a', busq.fn.mobileSearchToggle);
    $('body').on('click', '.header__mobile-icon--menu a', busq.fn.mobileMenuToggle);

    $('body').on('click', '.header__navigation--list-item a', busq.fn.mobileSubmenuToggle);
}(jQuery));
(function($){
    'use strict';

    // Move left navigation to the bottom of the content on mobile
    // Move it back if needed off mobile
    busq.fn.arrangeSideNavigation = function(){
        var leftNav = $('.content__navigation').detach();

        responsive = $('#responsive').css('z-index');

        // If on mobile or tablet
        if(responsive !== '3'){
            $('.content-wrapper').append(leftNav);
        } else {
            $('.content-wrapper').prepend(leftNav);
        }

    };
}(jQuery));
(function($){
    'use strict';

    // Make all home tiles the same height
    busq.fn.homeTilesAdjustHeight = function() {
        var tiles = $('.home__tiles .content__tile');
        var tileBodies = $('.home__tiles .content__tile-body');
        var headHeight = $('.home__tiles .content__tile-head').innerHeight();
        var footHeight = $('.home__tiles .content__tile-foot').innerHeight();
        var tileHeight = 0;
        var bodyHeight = 0;
        var current = 0;
        var tallestHasFoot = false;

        // Determine the tallest tile
        tiles.each(function(key, val){
            current = $(val).innerHeight();

            if(current > tileHeight){
                tileHeight = current;

                if($(val).find('.content__tile-foot').length === 1){
                    tallestHasFoot = true;
                    bodyHeight = $(val).find('.content__tile-body').innerHeight() + footHeight;
                } else {
                    tallestHasFoot = false;
                    bodyHeight = $(val).find('.content__tile-body').innerHeight();
                }
            }
        });

        // Adjust heights
        tiles.each(function(key, val){
            var body = $(val).find('.content__tile-body');
            var foot = $(val).find('.content__tile-foot');

            // Remove added footer height if current tile has one
            if(foot.length === 1){
                body.css('height', bodyHeight - footHeight + 'px');
            } else {
                body.css('height', bodyHeight + 'px');
            }
        });
    };

    // Make all home feature tiles the same height
    busq.fn.homeFeaturesAdjustHeight = function() {
        var features = $('.home__feature-container');
        var featureThumbnailHeight = $('.home__feature-thumbnail').height();
        var discoverThumbnailHeight = $('.personalise__image').height();
        var discoverTileHeight = $('.personalise__wrapper').height();
        var tallestElement;
        var tallestHeight = 0;
        var current;
        var targetHeightForFeature;
        var targetHeightForDiscover;
        var finalHeightForFeature;
        var finalHeightForDiscover;

        // Reset any previous styling
        $('.home__feature-content').attr('style', '');
        $('.personalise__image').css('height', '');

        // Determine the tallest feature
        features.each(function(key, val){
            current = $(val).innerHeight();

            if(current > tallestHeight){
                tallestHeight = current;
                tallestElement = $(val);
            }
        });

        // Check if tallest element is a feature tile or the discover tile
        if(tallestElement.has('.home__feature-content').length > 0){
            // Feature is tallest
            // Get the height of the content area as the goal
            targetHeightForFeature = tallestElement.find('.home__feature-content').height();
            finalHeightForFeature = targetHeightForFeature;

            // Work out values for Discover
            // Get the height of the entire feature tile as the goal
            targetHeightForDiscover = tallestHeight;

            // Get the difference between the heights, and add the current thumbnail height
            // Minus the 1px border of the feature tiles
            finalHeightForDiscover = targetHeightForDiscover - discoverTileHeight + discoverThumbnailHeight - 1;

            // Adjust heights of tiles
            features.each(function(key, val){
                if($(val).has('.home__feature-content').length > 0){
                    $(val).find('.home__feature-content').height(finalHeightForFeature);
                } else {
                    $(val).find('.personalise__image').height(finalHeightForDiscover);
                }
            });
        } else {
            // Discover is tallest
            // Work out values for Feature
            targetHeightForFeature = tallestHeight - featureThumbnailHeight;

            // Adjust heights of tiles
            features.each(function(key, val){
                if($(val).has('.home__feature-content').length > 0){
                    // Find the current item
                    // The final height is the target minus the content padding difference
                    var currentItem = $(val).find('.home__feature-content');
                    finalHeightForFeature = targetHeightForFeature - (currentItem.innerHeight() - currentItem.height());
                    currentItem.height(finalHeightForFeature);
                }
            });
        }
    };

    if($('.home__tiles').length > 0 && busq.fn.determineWidth() >= 2){
        busq.fn.homeTilesAdjustHeight();
    }
}(jQuery));
(function($){
    'use strict';


}(jQuery));
(function($){
    'use strict';


}(jQuery));
(function($){
    'use strict';

    /*
        Global
    */

    busq.discover = {
        defaults: {
            'business_industry': 'Z',
            'business_industry_value': 'All Businesses',
            'business_stage': 'all',
            'business_size': 'all',
            'business_location': 'all',
            'business_region': 'All'
        },
        tilesLoaded: 0
    };

    // Add zero to amounts less than two digits for consistency
    busq.fn.padZeros = function(number){
        number = '' + number;
        if(number.length < 2){
            return '0' + number;
        } else {
            return number;
        }
    };


    /*
        Storage Functions
    */

    // Retrieve a specified cookie
    busq.fn.getCookie = function(id){
        var target = id + '=';
        var jar = document.cookie.split(';');

        for(var cookie in jar){
            var current = jar[cookie].trim();
            if(current.indexOf(target) === 0){
                return current.substring(target.length, current.length);
            }
        }
    };

    // Check if local storage is possible
    busq.fn.storageEnabled = function(){
        if(typeof(localStorage) !== 'undefined'){
            return true;
        } else {
            return false;
        }
    };

    // Check if session storage is possible
    busq.fn.sessionStorageEnabled = function(){
        if(typeof(sessionStorage) !== 'undefined'){
            return true;
        } else {
            return false;
        }
    };

    // Check if local storage object exists
    // If it exists, return the object
    // If not, create adhering to special rules
    busq.fn.checkStorageObject = function(key, object){
        if(object === null || typeof(object) === 'undefined'){
            switch(key){
                case 'userinfo':
                    object = busq.fn.setUserDefaults();
                case 'personalise':
                    busq.fn.setStorageObject('personalise', 0);
                    object = 0;
                case 'userpanel':
                    busq.fn.setStorageObject('userpanel', 0);
                    object = 0;
                case 'discovered':
                    busq.fn.setStorageObject('discovered', 0);
                    object = 0;
                default:
                    break;
            }
        }

        return object;
    };

    // Check if session storage object exists
    // If it exists, return the object
    // If not, create adhering to special rules
    busq.fn.checkSessionObject = function(key, object){
        if(object === null || typeof(object) === 'undefined'){
            switch(key){
                case 'content':
                    object = busq.fn.storeDefaultContent();
                default:
                    break;
            }
        }

        return object;
    };

    // Store the data in session storage
    busq.fn.setSessionObject = function(key, value){
        if(busq.fn.sessionStorageEnabled()){
            sessionStorage.setItem('busqld-' + key, JSON.stringify(value));
        }
    };

    // Retrieve data from session storage
    busq.fn.getSessionObject = function(key){
        var object = {};

        if(busq.fn.sessionStorageEnabled()){
            object = JSON.parse(sessionStorage.getItem('busqld-' + key));
            object = busq.fn.checkSessionObject(key, object);
        }

        return object;
    };

    // Remove data from local storage
    busq.fn.removeSessionObject = function(key){
        if(busq.fn.sessionStorageEnabled()){
            sessionStorage.removeItem('busqld-' + key);
        }
    };


    // Store the data in local storage
    busq.fn.setStorageObject = function(key, value){
        if(busq.fn.storageEnabled()){
            localStorage.setItem('busqld-' + key, JSON.stringify(value));
        }
    };

    // Retrieve data from local storage
    busq.fn.getStorageObject = function(key){
        var object = {};

        if(busq.fn.storageEnabled()){
            object = JSON.parse(localStorage.getItem('busqld-' + key));
            object = busq.fn.checkStorageObject(key, object);
        }

        return object;
    };

    // Remove data from local storage
    busq.fn.removeStorageObject = function(key){
        if(busq.fn.storageEnabled()){
            localStorage.removeItem('busqld-' + key);
        }
    };

    // Set the object's timestamp value to the current time
    busq.fn.updateObjectTimestamp = function(object){
        var current = new Date().getTime();

        object.updated = current;

        return object;
    };


    /*
        Browser Capability Functions
    */

    // Private Browsing does not allow browser storage
    busq.fn.canPersonalise = function(){
        try {
            localStorage.setItem('store', '1');
            localStorage.removeItem('store');

            sessionStorage.setItem('store', '1');
            sessionStorage.removeItem('store');

            return true;
        } catch (error) {
            return false;
        }
    };

    // Display relevant messages on the page
    // Enable storage-independent functions
    busq.fn.privateBrowsingFallbacks = function(){
        busq.fn.togglePrivateBrowsingNotices();
    };

    // Show whether the personalised view is enabled
    busq.fn.personalisationEnabled = function(){
        return busq.fn.getStorageObject('discovered');
    };

    // Show personalisation status
    busq.fn.isPersonalised = function(){
        return busq.fn.getStorageObject('personalise');
    };

    // Enable personalisation state for the page
    busq.fn.enablePersonalisation = function(){
        // Turn on flag to indicate we're looking at a personalised version
        busq.fn.setStorageObject('discovered', 1);

        busq.fn.addPersonalisation();
    };

    // Disable personalisation state for the page
    busq.fn.disablePersonalisation = function(){
        // Update the Discover feature tile to show personalisation state
        $('.personalise__wrapper').removeClass('personalised');

        busq.fn.removePersonalisation();
    };

    // Add personalisation
    busq.fn.addPersonalisation = function(){
        // Turn on flag to configure the page
        busq.fn.setStorageObject('personalise', 1);

        // Start personalisation functions if it makes sense
        if($('.personalisation-panel').length > 0){
            // Enable the user panel
            busq.fn.displayDataPanel();

            // Update the discover tile to show "off" option
            $('.personalise--toggle').removeClass('personalise--on');
            $('.personalise--toggle').addClass('personalise--off');
            $('.personalise--toggle .personalise--state').text('off');
		        $('.personalise__title').html("<h2><span>We're </span><span>customising </span><span>this </span><span>content</span></h2>");
		        $('.personalise__links--message').html("<strong>Content is currently customised</strong>");
		        $('.personalise__foot--wrapper').addClass("hidden");
		        $('.personalise__options .personalise__links-list-item').removeClass('hidden');

            // Load in dynamic content
            busq.fn.updateContent(1);

            // Load in dynamic events
            busq.fn.loadPersonalisedEvents();
        }

        return false;
    };

    // Remove personalisation
    busq.fn.removePersonalisation = function(){
        // Turn on flag to configure the page
        busq.fn.setStorageObject('personalise', 0);

        // End personalisation functions if it makes sense
        if($('.personalisation-panel').length > 0){
            // Disable the user panel
            busq.fn.hideDataPanel();

            // Update the discover tile to show "on" option
            $('.personalise--toggle').removeClass('personalise--off');
            $('.personalise--toggle').addClass('personalise--on');
            $('.personalise--toggle .personalise--state').text('on');
            $('.personalise__links--message').html("<strong>Content is currently not customised</strong>");

            // Load in default content
            busq.fn.updateContent(0);

            // Load in default events
            busq.fn.loadDefaultEventsContent();
        }

        return false;
    };


    // Initiate functions and binding for personalisation
    busq.fn.startPersonalising = function(){
        var userinfo = busq.fn.getStorageObject('userinfo');

        // Update the Discover feature tile to show personalisation state
        $('.personalise__wrapper').addClass('personalised');

        // Save the default page state
        busq.fn.storeDefaultContent();

        // If we're personalising, fetch new content
        if(busq.fn.isPersonalised()){
            busq.fn.addPersonalisation();
        }

        $('body').on('click', '.personalise--off', busq.fn.removePersonalisation);
        $('body').on('click', '.personalise--on', busq.fn.addPersonalisation);
    };


    /*
        Content Functions
    */

    // Add non-personalised content into storage
    busq.fn.storeDefaultContent = function(){
        var content = {};

        $('.personalised-content').each(function(key, val){
            content[$(val).attr('data-id')] = $(val).html();
        });

        busq.fn.setSessionObject('content', content);

        return content;
    };

    // Load non-personalised content from storage
    busq.fn.loadDefaultContent = function(element){
        var content = busq.fn.getSessionObject('content');
        var index = element.attr('data-id');

        element.css('opacity', '0');

        setTimeout(function(){
            element.html(content[index]);
            element.css('opacity', '1');
        }, 500);
    };

    // Prepare query for content search
    busq.fn.prepareContentQuery = function(element){
        var userinfo = busq.fn.getStorageObject('userinfo');

        // Construct the data query to send to Funnelback
        var searchQuery = {
            'scope': element.attr('data-scope'),
            'numranks': element.attr('data-numranks'),
            'ablisData': userinfo.audience['business_industry'],
            'businessStage': userinfo.audience['business_stage'],
            'businessSize': userinfo.audience['business_size'],
            'businessLocation': userinfo.audience['business_location'],
            'businessRegion': encodeURI(userinfo.audience['business_region'])
        };

        return searchQuery;
    };

    // Create an output of the Funnelback URL for testing purposes
    busq.fn.constructDebugURL = function(searchQuery){
        var debugURL = 'https://deedi2-funnelback01.squiz.net/s/search.json?collection=business-qld-content-library-meta&profile=_default';

        debugURL += '&num_ranks=2&query_orsand=';
        debugURL += 'ablisData:' + searchQuery['ablisData'];
        debugURL += '|businessStage:' + searchQuery['businessStage'];
        debugURL += '|businessSize:' + searchQuery['businessSize'];
        debugURL += '|businessLocation:' + searchQuery['businessLocation'];
        debugURL += '|businessRegion:' + encodeURI(searchQuery['businessRegion']);
        debugURL += '&reslimit=' + searchQuery['numranks'];
        debugURL += '&scope=' + searchQuery['scope'];

        return debugURL;
    };

    // Load content from Funnelback
    busq.fn.loadFromLibrary = function(element){
        var libraryURL = $('.personalisation-panel').attr('data-url');
        var searchQuery = busq.fn.prepareContentQuery(element);
        var debugURL = busq.fn.constructDebugURL(searchQuery);

        //console.log(debugURL);
        //console.log('-------');

        $.ajax({
            type: 'GET',
            url: libraryURL,
            data: searchQuery,
            beforeSend: function(jqXHR, settings) {
                // Hide the default content to indicate a state change
                //console.log('AJAX URL: ' + settings.url);
                element.css('opacity', '0');
            },
            success: function(data){
                // Update the contents of the element with new HTML
                // Restore opacity to show new content
                element.html(data);
                element.css('opacity', '1');

                if(searchQuery['scope'] === 'top-features' && responsive === '3'){
                    busq.fn.homeFeaturesAdjustHeight();
                }

                busq.fn.updatePersonalisedTileHeights(element);
            }
        });
    };

    // Modify the personalised content on the page
    busq.fn.updateContent = function(dynamic){
        $('.personalised-content').each(function(key, val){
            // Load in dynamic content
            // Else load in default content
            if(dynamic){
                busq.fn.loadFromLibrary($(val));
            } else {
                busq.fn.loadDefaultContent($(val));
            }
        });
    };

    // Adjust the home tiles if all content is returned
    busq.fn.updatePersonalisedTileHeights = function(element){
        var tiles = ['content--alerts', 'content--i-want-to', 'content--events'];
        var current = $(element).attr('data-id');

        if(tiles.indexOf(current) !== -1){
            busq.discover.tilesLoaded += 1;
        }

        if(busq.discover.tilesLoaded === tiles.length && responsive === '3'){
            busq.fn.homeTilesAdjustHeight();
            busq.discover.tilesLoaded = 0;
        }
    };


    /*
        Events Content Functions
    */

    // Load events content from Funnelback
    /*busq.fn.loadPersonalisedEvents = function(){
        var events = $('.events-personalised-content');
        var libraryURL = events.attr('data-library-url');
        var numranks = events.attr('data-numranks');
        var userinfo = busq.fn.getStorageObject('userinfo');

        var searchQuery = {
            'numranks': numranks,
            'businessRegion': encodeURI(userinfo.audience['business_region'])
        };

        var ajaxURL = libraryURL + '?num_ranks=' + searchQuery.numranks + '&query_orsand=EventRegion:%22' + searchQuery.businessRegion  + '%22|EventRegion:%22All%22';

        $.ajax({
            type: 'GET',
            url: ajaxURL,
            //data: searchQuery,
            beforeSend: function(jqXHR, settings) {
                // Hide the default content to indicate a state change
                events.css('opacity', '0');
                //console.log('Events AJAX URL:' + ajaxURL);
            },
            success: function(data){
                // Update the contents of the element with new HTML
                // Restore opacity to show new content
                events.html(data);
                events.css('opacity', '1');

                busq.fn.updatePersonalisedTileHeights(events);
            }
        });
    };*/

    // Add non-personalised events content into storage
    busq.fn.storeEventsContent = function(){
        var eventsContent = $('.events-personalised-content').html();

        busq.fn.setSessionObject('eventscontent', eventsContent);

        return eventsContent;
    };

    // Load non-personalised content from storage
    busq.fn.loadDefaultEventsContent = function(){
        var content = busq.fn.getSessionObject('eventscontent');

        $('.events-personalised-content').css('opacity', '0');

        setTimeout(function(){
            $('.events-personalised-content').html(content);
            $('.events-personalised-content').css('opacity', '1');
        }, 500);
    };


    /*
        Data Panel Functions
    */

    // Populate the user data panel with storage information
    busq.fn.constructDataPanel = function(){
        var userinfo = busq.fn.getStorageObject('userinfo');
        var audience = userinfo.audience;
        var timestamp = new Date(userinfo.updated);
        var panel = $('.personalisation-panel');
        var markup;
        var updated;

        // Generate timestamp in a friednly format
        updated = busq.fn.padZeros(timestamp.getDate()) + '/' + busq.fn.padZeros(timestamp.getMonth()+1) + '/' + timestamp.getFullYear() + ' ' + busq.fn.padZeros(timestamp.getHours()) + ':' +busq.fn.padZeros(timestamp.getMinutes()) + ':' +busq.fn.padZeros(timestamp.getSeconds());

        markup = '<ul>';
        for(var item in audience){
            markup += '<li class="personalise__storage-item"><strong>' + item.replace(/_/g, ' ') + '</strong>: ' + audience[item] + '</li>';
        }
        markup += '</ul>';

        panel.find('.content__tile-body').html(markup);
        panel.find('.content__tile-foot').html('<div class="personalise__timestamp"><strong>Updated:</strong> ' + updated + '</div>');
    }

    // Show the user data panel
    busq.fn.displayDataPanel = function(){
        busq.fn.setStorageObject('userpanel', 1);

        if($('.personalisation-panel').length > 0){
            $('.personalisation-panel').css('display', 'block');
        }
    };

    // Hide the user data panel
    busq.fn.hideDataPanel = function(){
        busq.fn.setStorageObject('userpanel', 0);

        if($('.personalisation-panel').length > 0){
            $('.personalisation-panel').css('display', 'none');
        }
    };


    /*
        Private Browsing Functions
    */

    busq.fn.togglePrivateBrowsingNotices = function(){
        // The well on the Discover form
        if($('.well--private-browsing').length > 0){
            $('.well--private-browsing').css('display', 'block');
        }

        // The feature tile on the home page
        if($('.personalise__wrapper').length > 0){
            $('.personalise__warning').css('display', 'block');
            $('.personalise__options').css('display', 'none');

            $('.personalise__wrapper').addClass('personalised');

            if(responsive === '3'){
                busq.fn.homeFeaturesAdjustHeight();
            }
        }
    };


    /*
        Personalisation Functions
    */

    // Apply default values to the user model
    busq.fn.setUserDefaults = function(){
        var object = {};

        object.audience = {
            'business_industry': busq.discover.defaults['business_industry'],
            'business_industry_value': busq.discover.defaults['business_industry_value'],
            'business_stage': busq.discover.defaults['business_stage'],
            'business_size': busq.discover.defaults['business_size'],
            'business_location': busq.discover.defaults['business_location'],
            'business_region': busq.discover.defaults['business_region']
        };

        busq.fn.savePersonalisation(object);

        return object;
    };

    // Update the userdata personalisation object in storage
    busq.fn.savePersonalisation = function(object){
        object = busq.fn.updateObjectTimestamp(object);
        busq.fn.setStorageObject('userinfo', object);
    };

    // Save Discover form information
    busq.fn.saveDiscoverChoices = function(){
        var object = {};
        var business_industry;
        var business_industry_value;
        var business_stage = [];
        var business_size;
        var business_location;
        var business_region;

        object['audience'] = {};

        // Save the industry key from hidden input text field
        business_industry = $('[data-personalise="business_industry"]').find('#q3143_q1');
        object.audience['business_industry'] = business_industry.val();

        if(object.audience['business_industry'] === ''){
            object.audience['business_industry'] = busq.discover.defaults['business_industry'];
        }

        // Save the industry value from hidden input text field
        business_industry_value = $('#ablislabel');
        object.audience['business_industry_value'] = business_industry_value.val();

        if(object.audience['business_industry_value'] === ''){
            object.audience['business_industry_value'] = busq.discover.defaults['business_industry_value'];
        }

        // Save the stage value from all selected checkboxes
        $('[data-personalise="business_stage"] input').each(function(key, val){
            var option;
            if($(val).prop('checked')){
                business_stage.push($(val).attr('data-key'));
            }
        });

        if(business_stage.length > 0){
            object.audience['business_stage'] = business_stage.join(';');
        } else {
            object.audience['business_stage'] = busq.discover.defaults['business_stage'];
        }

        // Save the size value from the selected input radio field
        business_size = $('[data-personalise="business_size"] input:checked');
        if(business_size.length > 0){
            object.audience['business_size'] = business_size.attr('data-key');
        } else {
            object.audience['business_size'] = busq.discover.defaults['business_size'];
        }


        // Save the location value from the selected input radio field
        business_location = $('[data-personalise="business_location"] input:checked');
        if(business_location.length > 0){
            object.audience['business_location'] = business_location.next().text().toLowerCase();
        } else {
            object.audience['business_location'] = busq.discover.defaults['business_location'];
        }


        // Save the region from the selected select field
        business_region = $('[data-personalise="business_region"] select');
        object.audience['business_region'] = business_region.val();

        // Update the user model
        busq.fn.savePersonalisation(object);

        // Set up a personalised state
        busq.fn.enablePersonalisation();
    };


    /*
        Document Ready
    */

    $(document).ready(function(){
        if(busq.fn.canPersonalise()){
            // Only available on the home page
            if($('.personalisation-panel').length > 0){
                busq.fn.constructDataPanel();

                // Proceed if personalised state is enabled
                if(busq.fn.personalisationEnabled()){
                    busq.fn.startPersonalising();

                    if($('.events-personalised-content').length > 0) {
                        busq.fn.storeEventsContent();
                    }

                    //busq.fn.loadPersonalisedEvents();

                    if(responsive === '3'){
                        busq.fn.homeFeaturesAdjustHeight();
                    }
                }
            }
        } else {
            busq.fn.privateBrowsingFallbacks();
        }
    });

}(jQuery));
(function($){
    'use strict';


}(jQuery));
(function($){
    'use strict';

    // Display contextual social media accounts
    busq.fn.socialRelatedLinks = function() {

        /** Metadata Cleaner **/
        function cleanMetadata(dirtyString) {
            var allTerms = dirtyString.split(';');
            var classList = '';
            for (var i = 0; i < allTerms.length; i++) {
                var dirtyTerm = $.trim(allTerms[i]).replace(/%20/g, '-').replace('(', '').replace(')', '').replace(',', '');
                var finalTerm = dirtyTerm.toLowerCase().replace(/\s+/g, '-'); //make lower case and replace spaces with '-'
                classList += finalTerm + ' ';
            }
            return $.trim(classList);
        }

        /** Convert metadata output into classes **/
        $('.audience').each(function() {
            if ($(this).text().length > 0) {
                var categoryItems = cleanMetadata($(this).text());
                $(this).closest('.social-context-wrapper').addClass(categoryItems);
            }
        });

        // Change the order of the links if an Audience terms has been passed.
        var passedVar = location.href.split('?');
        if (passedVar.length > 1) {
            var usedVar = passedVar[1].split('=');
            var aTwitterAccount = [];
            if (usedVar[0] == 'audienceFilter') {
                var varString = decodeURIComponent(usedVar[1]).split(';');
                //move all divs that have this class into the context div
                $('.social-context-wrapper').each(function() {
                    for (var i = 0, lenI = varString.length; i < lenI; i++) {
                        if ($(this).hasClass(cleanMetadata(varString[i])) === true) {
                            if ($(aTwitterAccount).find($(this))) {
                                aTwitterAccount.push($(this));
                            } else {
                                //can sort to top here if needs be
                            }
                        }
                    }
                    
                    
                });
                
                    
                for (var j = 0, lenJ = aTwitterAccount.length; j < lenJ; j++) {
                    $('#contextual-links').append(aTwitterAccount[j]);
                    
                }
                
                
                if($(".social_related_accounts .social-context-wrapper").length === 0){
                    $(".social_related_accounts").hide();
                }else{
                    $(".social_related_accounts").show();
                }
            }
        }else{
            
        }
    };

    if ($('#contextual-links').length > 0) {
        busq.fn.socialRelatedLinks();
    }

}(jQuery));
(function($){
    'use strict';

    // Viewport cleanup for the main navigation
    busq.fn.viewportCleanupHeader = debounce(function(){
        responsive = $('#responsive').css('z-index');

        // If on desktop
        if(responsive === '3'){
            $('.header__navigation--list').attr('style', '');
        }
    }, 250);

    // Viewport restructure for feature tiles
    busq.fn.viewportCleanupFeatureTiles = debounce(function(){
        responsive = $('#responsive').css('z-index');

        // If on desktop
        if(responsive === '3' && $('.home__feature').length > 0){
            busq.fn.homeFeaturesAdjustHeight();
        } else {
            $('.home__feature-content').css('height', '');
            $('.personalise__image').css('height', '');
        }
    }, 250);

    // Viewport cleanup for the left navigation
    busq.fn.viewportCleanupLeftnav = debounce(function(){
        if($('.content__navigation').length > 0){
            busq.fn.arrangeSideNavigation();
        }
    }, 250);

    // Viewport cleanup for the footer
    busq.fn.viewportCleanupFooter = debounce(function(){
        responsive = $('#responsive').css('z-index');

        // If on desktop
        if(responsive === '3'){
            $('.footer__navigation-sublist').attr('style', '');
        }
    }, 250);

    $(window).on('load resize', busq.fn.viewportCleanupHeader);
    $(window).on('load resize', busq.fn.viewportCleanupFeatureTiles);
    $(window).on('load resize', busq.fn.viewportCleanupFooter);
    $(window).on('load resize', busq.fn.viewportCleanupLeftnav);
}(jQuery));
//# sourceMappingURL=global.js.map
