(function($){
    'use strict';
    
    busq.fn.loadPersonalisedEvents = function(){
        
        //console.log("coming at you LIVE from dev.js, you're in the PERSONAL EVENTS LOADER");
        
        var events = $('.events-personalised-content');
        var libraryURL = events.attr('data-library-url');
        var numranks = events.attr('data-numranks');
        var userinfo = busq.fn.getStorageObject('userinfo');
    
        var searchQuery = { 
            'numranks': numranks,  
            'businessRegion': encodeURI(userinfo.audience['business_region'])
        };

        var ajaxURL = libraryURL + '?num_ranks=2&query_orsand=EventRegion:%22' + searchQuery.businessRegion  + '%22|EventRegion:%22Central Queensland; Central West Queensland; Darling Downs; Far North Queensland; North Queensland; North West Queensland; South East Queensland; South West Queensland; Wide Bay-Burnett; All%22';    
        
        //var ajaxURL = libraryURL + '?num_ranks=' + searchQuery.numranks + '&query_orsand=EventRegion:%22' + searchQuery.businessRegion  + '%22|EventRegion:%22All%22';        
    
        $.ajax({
            type: 'GET',
            url: ajaxURL,
            //data: searchQuery,
            beforeSend: function(jqXHR, settings) {
                // Hide the default content to indicate a state change
                events.css('opacity', '0');
            },
            success: function(data){
                // Update the contents of the element with new HTML
                // Restore opacity to show new content
                events.html(data);
                events.css('opacity', '1');

                busq.fn.updatePersonalisedTileHeights(events);
            }
        });
    };
}(jQuery));

(function($){
    'use strict';

    if($('.content__tile-form-datepicker').length > 0){
        $('.content__tile-form-datepicker').datepicker();
        
        $('.content__tile-form-datepicker').datepicker("option", "dateFormat", "dd/mm/yy" );
    }
}(jQuery));

(function() {
    "use strict";
    
    busq.fn.tabbedContent = function(){
            
        $(".arrow-tabs li").first().addClass("selected");
        $(".arrow-tabs li").first().find("a").addClass("first");
        $(".arrow-tabs li").last().find("a").addClass("last");
        $(".tab-container .tab-content").hide();
        $(".tab-container .tab-content").first().show();
        
        function checkSelectedState() {
            $(".nav-buttons a").removeClass("disabled");
            if($(".arrow-tabs .selected a").hasClass("first")) {
                $(".nav-buttons a.previous").addClass("disabled");
            }
            if($(".arrow-tabs .selected a").hasClass("last")) {
                $(".nav-buttons a.next").addClass("disabled");
            }
            return false;
        }
        
        checkSelectedState();
        
        $(".arrow-tabs a").click(function(){
            $(".arrow-tabs li").removeClass("selected");
            $(this).parent().addClass("selected");
        
            checkSelectedState();
            
            var activeTabContent = $(this).attr("href");
            $(".tab-content").hide();
            $(activeTabContent).fadeIn(350);                
            var offset = document.getElementById("tutorial_tabs").offsetTop + 200;
            $("html, body").animate({ scrollTop: offset }, 500);
            return false;
        });
        
        $(".nav-buttons a").click(function(){
            var activeTab = $(".arrow-tabs .selected");
            var activeTabLink = $(".arrow-tabs .selected a");
            var nextContent = activeTab.next().find("a").attr("href");
            var prevContent = activeTab.prev().find("a").attr("href");
            
            if ($(this).hasClass("previous")) {
                if($(activeTabLink).hasClass("first")) {                        
                    // Do nothing
                } else {
                    activeTab.removeClass("selected");
                    activeTab.prev().addClass("selected");
                    $(".tab-content").hide();
                    $(prevContent).fadeIn(350);
                }
            }
            if ($(this).hasClass("next")) {
                if($(activeTabLink).hasClass("last")) {
                    // Do nothing
                } else {
                    activeTab.removeClass("selected");
                    activeTab.next().addClass("selected");  
                    $(".tab-content").hide();
                    $(nextContent).fadeIn(350);
                }
            }
            checkSelectedState();
            var offset = document.getElementById("tutorial_tabs").offsetTop;
            $("html, body").animate({ scrollTop: offset }, 500); 
            return false;
        });
    }
    
    if($('#tutorial_content').length > 0 || $('ul.arrow-tabs').length > 0 || $('#tutorial_tab_content').length > 0){
        busq.fn.tabbedContent();
    }
    
    
    busq.fn.eventsEmpty = function(){
        //Check if Events is empty
        if($('.content__tile.tile--blue').length <= 0){
            return true;
        }else{
            return false;
        }
    }
    
    busq.fn.alertsEmpty = function(){
         //Check if Alerts is empty
         if($('.content__tile-alert-list').length <= 0){
             return true;
         }else{
             return false;
         }
    }
    
    busq.fn.iwanttoEmpty = function(){
        //Check if I want to is empty
        if($('.iwantto').length === 0){
            return true;   
        }else{
            return false;
        }
    }
    
    busq.fn.homepageAlerts = function(){
        var eventsEmpty = busq.fn.eventsEmpty();
        var alertsEmpty = busq.fn.eventsEmpty();
        var iwanttoEmpty = busq.fn.eventsEmpty();
        
        var count = 0;
        $('.home__tiles-list-item').each(function(){
           count ++; 
        });
        
        if(eventsEmpty === true || alertsEmpty === true || iwanttoEmpty === true || count === 2){
            $('.home__tiles-list-item ').each(function(){
               $(this).removeClass('col-md-4').addClass('col-md-6'); 
            });
        }
    }
    
    if($('.home__tiles-list').length > 0){
        busq.fn.homepageAlerts();
    }
    
// Generate slider pagination

if ($('.carousel').length > 0) {
    var items = $('.carousel .item').length;
    var pagination = '';
        if (items > 1) {
        var sliderID = $('.carousel').attr('id');
        $('.carousel .item').each(function(index) {
            if (index === 0) {
                pagination = pagination + '<li href="#' + sliderID + '" data-target="#' + sliderID + '" data-slide-to="' + index + '" class="active"></li>';
            } else {
                pagination = pagination + '<li href="#' + sliderID + '" data-target="#' + sliderID + '" data-slide-to="' + index + '" class=""></li>';
            }
        });
        pagination = '<ol class="carousel-indicators">' + pagination + '</ol>';
        $($(pagination)).prependTo('#' + sliderID);
    }
}

})(jQuery);


/* EVENTS */

(function($){
    'use strict';

    // Clear values on event search tile
    busq.fn.eventsFormFilterClear = function(){
        var form = $('.events__filter .content__tile-form');
        var textFields = form.find('input[type="text"]');
        var hidden = form.find('input[type="hidden"]');
        var checkboxes = form.find('input[type="checkbox"]');
        var options = form.find('select');

        textFields.each(function(key, val) {
            $(val).val('');
            $(val).trigger('change');
        });
        hidden.each(function(key, val) {
            $(val).val('');
            $(val).trigger('change');
        });
        checkboxes.each(function(key, val) {
            $(val).prop('checked', false);
            $(val).trigger('change');
        });
        options.each(function(key, val) {
            $(val).val('');
            $(val).trigger('change');
        });
        busq.fn.eventsFormFilterSubmit();
        return false;
    };

    // Refine search based on form input
    busq.fn.eventsFormFilterSubmit = function(){
        var form = $('.search__form form');

        // Append values to hidden fields
        var hiddenDate = $('#queries_date_query-value');
        var hiddenFree = $('#event__free-value');

        hiddenDate.val($('.content__tile-form-datepicker').val());
        hiddenFree.val($('#event__free').prop('checked'));

        // Submit the form
        form.submit();

        return false;
    };

    // Show all events by submitting an empty search
    busq.fn.eventsFormShowAll = function(){
        var form = $('.search__form form');
        busq.fn.eventsFormFilterClear();

        form.find('input[type="text"]').val('');

        form.submit();

        return false;
    };

    // if we have an events list, bind 'read more' links to submit google events 
    busq.fn.eventsAnalytics = function(event){
      var sLocation = event.data.location;
      ga('send', 'event', 'Calendar', sLocation, $(this).attr('data-track-value'));
      return true;   
    };
    
    // Toggle event details display
    busq.fn.eventsShowDetails = function(event){
        var target = $(event.target);
        var more, title, item, info;

        item = target.parents('.search__results-list-item');
        info = item.find('.events__item-information');

        if (target.hasClass('events__item-more')){
            more = target;
        } else{
            more = item.find('.events__item-more'); 
        }

        if(info.css('display') === 'block'){
            info.slideUp(400, function() {
                more.text('More...');                
            });
        } else {
            info.slideDown(400, function() {
                more.text('Less');                
            });          
            var intUrl = target.data('selfurl');
            if (intUrl) {
              ga('send', 'event', 'BusinessEvents', 'view', intUrl);              
            }
        }

        return false;
    };


    /* Used to copy the filter parameters to the hidden fields within the Search form */
    busq.fn.eventsCopyHiddenFields = function() {
        if ($('.content__tile-form select, .content__tile-form input').length) {
            $('.content__tile-form select, .content__tile-form input').change(function() {
                var elFilter = $(this);
                var elFilterFormEL = $('#' + elFilter.attr('rel'));

                if (elFilter.attr('id') === "event__free") {
                    if (elFilter.prop('checked') === true) {
                        elFilterFormEL.val("Free");
                    } else {
                        elFilterFormEL.val('');
                    }
                    elFilterFormEL.trigger('change');
                } else {
                    elFilterFormEL.val(elFilter.val()).trigger('change');
                }
            });
        }
    };
    busq.fn.eventsCopyHiddenFields();

    /* Used to copy the filter parameters from the URL to the filters on the page if they exist */
    busq.fn.eventsAssignURLFilters = function() {
        try {
            var aFilterIDs = ['queries_region_query', 'queries_industry_query_value', 'queries_eventtype_query'];

            $.extend({
                getUrlVars: function() {
                    var vars = [],
                        hash;
                    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
                    for (var i = 0; i < hashes.length; i++) {
                        hash = hashes[i].split('=');
                        vars.push(hash[0]);
                        vars[hash[0]] = decodeURIComponent(hash[1]);
                    }
                    return vars;
                },
                getUrlVar: function(name) {
                    return $.getUrlVars()[name];
                }
            });
            // Get object of URL parameters
            var aAllParams = $.getUrlVars();
            var elArray = $('.content__tile-form select, .content__tile-form input');

            for (var i = 0, lenI = aAllParams.length; i < lenI; i++) {
                var sParamValue = aAllParams[aAllParams[i]];
                if (sParamValue) {
                    switch (aAllParams[i]) {
                        case 'meta_EventCost':
                            if (sParamValue.includes('Free')) {
                                $('#event__free').prop('checked', true).trigger('change');
                            }
                            break;
                        case 'start_date':
                             $('#queries_date_query').val(sParamValue).trigger('change');
                            // $('#queries_date_query').trigger('change');
                            break;
                        case 'meta_EventRegion':
                            $('#queries_region_query').val(sParamValue.replace(/\+/g, ' ')).trigger('change');
                            break;
                        case 'meta_EventType':
                            $('#queries_eventtype_query').val(sParamValue).trigger('change');
                            break;
                        case 'meta_Industry':
                            $('#queries_industry_query').val(sParamValue).trigger('change');
                            break;
                        default:
                            // Do nothing
                    }
                }
            }
        } catch (err) {
            //console.log(err.message);
        }
    };
    busq.fn.eventsAssignURLFilters();
    

    $('body').on('click', '.btn--clear-filters', busq.fn.eventsFormFilterClear);
    $('body').on('click', '.btn--refine-search', busq.fn.eventsFormFilterSubmit);
    $('body').on('click', '.btn--show-all-events', busq.fn.eventsFormShowAll);
    $('body').on('click', '.events__item-more, .events__item-title--link', busq.fn.eventsShowDetails);
    $('body').on('click', '.event-track-external-link', { location: 'External' }, busq.fn.eventsAnalytics);
    $('body').on('click', '.event-track-internal-link', { location: 'Internal' }, busq.fn.eventsAnalytics);
    
    
    busq.fn.searchHighlight = function(){
        var searchTerm = $('.search__results-list').data('searchterm');
        
        if(searchTerm === undefined || searchTerm === null) {
        }
        else{
            var regExp = searchTerm.match(/\S+\s*/g);
            $(regExp).each(function(){
                this.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
            });
            var replacement = '<strong>$&</strong>';
            
            $(regExp).each(function(){
                var query = this;
             
                $('.search__results-list-item').each(function(){
                    var html = $(this).find('.search__item-description').html();
                    var newhtml = html.replace(query, replacement);
                
                    $(this).find('.search__item-description').html(newhtml);
                });
            });
        }
        
        if($(".related-also").find("div").length > 0){
            
        }else{
            $(".related-also").addClass("visuallyhidden");
        }
    }
    
    if($('.search__results-list').length > 0){
        busq.fn.searchHighlight();
    }
    
    busq.fn.eventsMap = function(mapLocation){
        var map;
        function initialize(){
            
            var eventString = $('#event-map-canvas').attr('data-location');
            var eventCoords = eventString.replace(/[a-z]+=/g, '').replace(" ","").split(';');
       
            if(eventCoords[0].length > 0 && eventCoords[1].length > 0){
                var eventLoc = new google.maps.LatLng(eventCoords[0], eventCoords[1]);

                var mapOptions = {
                    center: eventLoc,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                  };
                var map = new google.maps.Map(document.getElementById("event-map-canvas"),
                          mapOptions);
                var marker = new google.maps.Marker({
                    position: eventLoc,
                    map: map
                });
            }else {
                $('#event-map-canvas').hide();
              }
        }
        
        $( document ).ready(function() {
            google.maps.event.addDomListener(window, "load", initialize);
        });


        
    }
    
    if($('#event-map-canvas').length > 0){
        busq.fn.eventsMap();
    }
    
    
    
    busq.fn.initAccordion = function(target){

        jQuery(target).accordion({
            active: false,
            collapsible: true, 
            heightStyle: "content",
            create: function(evt, ui) {
              try {
                var key = document.title + "_" + evt.target.parentElement.id;
                var value = parseInt(sessionStorage[key]);
                if (!isNaN(value)) 
                  jQuery(this).accordion("option", "active", value);
              } finally { } // ignore
            }
        });
    }

    if($('.accordion').length > 0){
        busq.fn.initAccordion('.accordion');    
    }
    
    if($('.accord_group').length > 0){
        busq.fn.initAccordion('.accord_group');    
    }
    
    var landingHeight;
    var accordionHeight;
    
    busq.fn.resetLandingAccordion = function(){
        $('.landing-accordion').css('overflow', 'initial').css('height','auto');
        landingHeight = $('.landing-accordion').height();
        $('.landing-accordion').removeClass('active');
        $('.landing-accordion-link').html('<span>Show more<i class="fa fa-chevron-down" aria-hidden="true"></i></span>');
        busq.fn.initLandingAccordion(); 
    }
    
    busq.fn.initLandingAccordion = function(){
        var currentWidth = busq.fn.determineWidth();
        
        if (currentWidth === 2){
            accordionHeight = '216px';
        }else{
            accordionHeight = '516px';
        }
        
        $('.landing-accordion').css('overflow', 'hidden').css('height',accordionHeight);
    }
    
    busq.fn.LandingAccordion = function(){
        if($('.landing-accordion').hasClass('active')){
           $('.landing-accordion').removeClass('active');
           $('.landing-accordion-link').html('<span>Show more<i class="fa fa-chevron-down" aria-hidden="true"></i></span>');
           $('.landing-accordion').css('height',accordionHeight);
        }else{
           $('.landing-accordion').height(landingHeight);
           $('.landing-accordion-link').html('<span>Show less<i class="fa fa-chevron-up" aria-hidden="true"></i></span>');
           $('.landing-accordion').addClass('active'); 
        }
    }
    
    if($('.landing-accordion').length > 0){
        
        
    }
    
    
    
    $('body').on('click', '.landing-accordion-link', busq.fn.LandingAccordion);
    
    
    if($('.content__welcome').length > 0){
       
        var countChar = $(".content__copy").text().length;

        if (countChar > 700){
            $('.content__welcome').addClass('landing-accordion');
            $('.content__copy').addClass('landing-accordion-target');
            $('.content__landing-header').append('<div class="landing-accordion-link"><span>Show more<i class="fa fa-chevron-down" aria-hidden="true"></i></span></div>');
            landingHeight = $('.landing-accordion').height();
            busq.fn.initLandingAccordion(landingHeight);
        }
    }
    
    
    
    var searchAccordionHeight;
    var searchfacetHeight;
    
    busq.fn.searchAccordioninit = function(searchfacetHeight){
         $('.facet-Industry').each(function(){
            var listItems = $(this).find('ul').children();
            var count = listItems.length;
            if (count > 10){
                searchfacetHeight = $(this).height();
                $(this).find('ul').addClass('accordion');
                
                searchAccordionHeight = '343px';
                
                $(this).find('ul').css('overflow', 'hidden').css('height',searchAccordionHeight);
                $(this).append('<div class="search-accordion-link"><span>Show more<i class="fa fa-chevron-down" aria-hidden="true"></i></span></div>');
            }
        });
    }
    
    busq.fn.searchAccordion = function(){
        if($('.facet-Industry').find('.accordion').hasClass('active')){
           $('.facet-Industry').find('.accordion').removeClass('active');
           $(this).html('<span>Show more<i class="fa fa-chevron-down" aria-hidden="true"></i></span>');
           $('.facet-Industry').find('.accordion').css('height',searchAccordionHeight);
        }else{
           $('.facet-Industry').find('.accordion').height(searchfacetHeight);
           $(this).html('<span>Show less<i class="fa fa-chevron-up" aria-hidden="true"></i></span>');
           $('.facet-Industry').find('.accordion').addClass('active'); 
        }
    }
    
    if($('.facet-Industry').length > 0){
        searchfacetHeight = $('.facet-Industry').find('ul').height();
        busq.fn.searchAccordioninit(searchfacetHeight);
    }
    
    $('body').on('click', '.search-accordion-link', busq.fn.searchAccordion);
    
    busq.fn.loadReportChart = function(past,soon,future,owner){
        google.charts.load('current', {packages: ['corechart']});
        google.charts.setOnLoadCallback(drawChart);
        
        function drawChart() {
            
            var data = google.visualization.arrayToDataTable([
              ['Status', 'Count'],
              ['Expired', Number(past)],
              ['Upcoming', Number(soon)],
              ['Future', Number(future)]
            ]);
            
            var newTitle;
            if( owner.length > 0){
                newTitle = 'Current Metrics for ' + owner;
            }else{
                newTitle = 'Current Metrics';
            }
            
            var options = {
              title: newTitle,
              colors: ['#b70c4b', '#fcb951', '#3caf9d'],
            };
            
            var chart = new google.visualization.PieChart(document.getElementById('piechart'));
            
            chart.draw(data, options);
            
            if( past === 0 && soon === 0 && future === 0){
                $('#piechart').hide();
            }
        }
    }
    
    
    busq.fn.getReportData = function(){
        
        var past;
        if ( typeof($('.flags').data('past')) !== "undefined" && $('.flags').data('past') !== null ){
            past = $('.flags').data('past');
        }else{
            past = '0';
        }
        
        var soon;
        if ( typeof($('.flags').data('soon')) !== "undefined" && $('.flags').data('soon') !== null ){
            soon = $('.flags').data('soon');
        }else{
            soon = '0';
        }
        
        var future;
        if ( typeof($('.flags').data('future')) !== "undefined" && $('.flags').data('future') !== null ){
            future = $('.flags').data('future');
        }else{
            future = '0';
        }

        var owner;
        if ( typeof($('.flags').data('owner')) !== "undefined" && $('.flags').data('owner') !== null ){
            owner = $('.flags').data('owner');
        }else{
            owner = '';
        }
        
        busq.fn.loadReportChart(past,soon,future,owner);
    }
    
    if($('#search_page_43959').length > 0){
        busq.fn.getReportData();
    }
    
    if($('body.global-content-owners #content_container_52042').length >0){
        busq.fn.getReportData(); 
    }
    
    jQuery(document).ready(function(){  
        if(navigator.userAgent.indexOf('Mac') > 0){
            jQuery('body').addClass('mac-os');
        } else {
         jQuery("body").addClass("win");
        }
    });
    
    busq.fn.InvestinggoogleMaps = function(){
        /* GOOGLE MAPS SCRIPT */
    
        var map;
    
       
            var styles = [
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [
                  { lightness: 100 },
                  { visibility: "simplified" }
                ]
              },{
                featureType: "water",
                elementType: "all",
                stylers: [
                  { color: "#7fc0c8"},
                  { visibility: "on" }
                ]
              },{
                featureType: "poi",
                elementType: "park",
                stylers: [
                  { color: "#84ad53"},
                  { visibility: "simplified" }
                ]
              },{
                featureType: "landscape",
                elementType: "all",
                stylers: [
                  { color: "#CED3B8"},
                  { visibility: "on" }
                ]
              },{
                featureType: "road",
                elementType: "labels",
                stylers: [
                  { visibility: "off" }
                ]
              }
            ];
        
            var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});
            var mapOptions = {
                zoom: 4,
                center: new google.maps.LatLng(-21.394877,149.545654),
                mapTypeId: google.maps.MapTypeId.ROADMAP 
            };
            map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            $('#map-canvas').css('height','315px');
            // needed to stop crazy messed up ghost images
            $('html > head').append('<style>#map-canvas img { max-width: none; }</style>');
            map.mapTypes.set('map_style', styledMap);
            map.setMapTypeId('map_style');
        
            var i;
        
            for (i=0; i < opportunities.length; i++) {
                //var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
                var thisCoordSplit = opportunities[i].latlong.split(",");
                var myLat = thisCoordSplit[0];
                var myLong = thisCoordSplit[1];
                var myLocation = new google.maps.LatLng(myLat, myLong);
                var thisTitle = opportunities[i].name;
                
                var myPopup = new google.maps.InfoWindow({
                    maxWidth: "200",
                    content: "loading..."
                });
                var imageURL = $('.mapmarker').data('marker');
                var image = new google.maps.MarkerImage(imageURL,
                    // This marker is 29 pixels wide by 33 pixels tall.
                    new google.maps.Size(29, 33),
                    // The origin for this image is 0,0.
                    new google.maps.Point(0, 0)
                );
                var myMarker = new google.maps.Marker({
                    position: myLocation, 
                    map: map,
                    //icon: image, 
                    title: thisTitle, 
                    html: '<div id=\"oppWindow\"><h3>'+thisTitle+'</h3><p>'+opportunities[i].description+'</p><p><a href="'+opportunities[i].url+'" target=\'_blank\' onclick="_gaq.push([\'_trackEvent\',\'document\', \'download\', href]); _gaq.push([\'_trackPageview\', href]);";</a>Learn more about this opportunity</p></div>'
                });  
                google.maps.event.addListener(myMarker, 'click', function() {
                    myPopup.setContent(this.html);
                    myPopup.open(map,this);
                });
                google.maps.event.addListener(map, 'click', function() {
                    myPopup.close();
                });
            }
    
        
        

    }
    
    if ($('#map-canvas').length > 0 ){ 
   
        setTimeout(function(){ 
            if (typeof google === 'object' && typeof google.maps === 'object') {
                busq.fn.InvestinggoogleMaps();
            }
        }, 5000);
    }
    
    
    busq.fn.specialAutocomplete = function(){
        
        $.getScript("//deedi-search.clients.squiz.net/s/resources-global/js/jquery.funnelback-completion.js"); 
        // Query completion setup.
        jQuery("input.query").fbcompletion({
            'enabled' : 'enabled',
            'standardCompletionEnabled': true,
            'collection' : 'business-qld-meta',
            'program' : 'https://deedi-search.clients.squiz.net/s/suggest.json',
            //'program' : program,
            'interactionLog' : 'https://deedi-search.clients.squiz.net/s/log',
            'format' : 'extended',
            'alpha' : '.5',
            'show' : '10',
            'sort' : '0',
            'length' : '3',
            'delay' : '0',
            'profile' : '',
            //'query' : 'collection=dtesb-etender',
            'logging' : 'disabled',
            //Search based completion
            'searchBasedCompletionEnabled': false,
            'searchBasedCompletionProgram': 'https://deedi-search.clients.squiz.net/s/suggest.json',
            //'searchBasedCompletionProgram': program
        });

    }
    
    if( $('.special-page').length > 0){
        busq.fn.specialAutocomplete();
    }
    
    
    busq.fn.formValidate = function(){
      
        $(".form-validate").validate({
            ignore:":hidden",
            errorPlacement: function(error, element) {
        		$( element ).closest('.sq-form-question').append(error);
        	},
        	rules: {
                field: {
                  required: true,
                  email: true,
                  number: true
                }
            } /*,
            submitHandler: function(form) {
                    
                    var form = $('#form_email_1601');
                    var formData = form.serialize();
                    var formSubmit = form.find('input[type="submit"]');
                    // process the form
                    $.ajax({
                        type: 'POST',
                        url: form.attr('action'),
                        data: formData,
                        success: function (response) {
                            
                            $('.modal-body').html(response);
                            
                            feedbackCloseModal();
                        }
                    });
                        
                }*/
        });
    }
    
    if( $('.form-validate').length > 0){
        busq.fn.formValidate();
    }
    
    if( $('#eligibility-alert').length > 0 || $('#program-details').length > 0) {
        
      insertCommas('eligibility-alert');
      insertCommas('program-details');
    
    }
    
    
    function insertCommas(id) {
    
      $('#' + id + ' .check-commas .value').each(function() {
        var str = $(this).text();
        $(this).text($.trim(str));
    
        if($(this).text() == '') {
          $(this).remove();
        }
    
      });
    
      var str = $('#' + id + ' .check-commas .value').last().text();
      $('#' + id + ' .check-commas .value').last().text(str.replace(',', ''));
    
      if($('#' + id + ' .check-commas .value').length > 1) {
        var str = $('#' + id + ' .check-commas .value').last().prev().text();
        $('#' + id + ' .check-commas .value').last().prev().text(str.replace(',', ''));
    
        var str = $('#' + id + ' .check-commas .value').last().text();
        $('#' + id + ' .check-commas .value').last().text('and ' + str);
      }
    
      //replace the first character of the first value with an uppercase version
      var node = $('#' + id + ' .check-commas .value:first');
      var nodeText = $(node).text();
      $(node).text(nodeText.charAt(0).toUpperCase() + nodeText.slice(1));
    }

    
    busq.fn.reportCustomise = function(){
        
        if($("#queries_name_query").length > 0){
            document.getElementById("queries_name_query").placeholder = "Search by name";
        }
        
        if($("#queries_username_query").length > 0){
            document.getElementById("queries_username_query").placeholder = "Search by username";
        }
        
        if($("#queries_type_query").length > 0){
            //$("#queries_type_query").prepend('<option value="">-- Leave Empty --</option>');
            if (getParameterByName('queries_type_query') === "" || getParameterByName('queries_type_query') === null) {
                $("#queries_type_query").val("").prop('selected', true);
            }
        }
        
        if($("#queries_layout_query").length > 0){
            $("#queries_layout_query").prepend('<option value="">-- Leave Empty --</option>');
            if (getParameterByName('queries_layout_query') === "" || getParameterByName('queries_layout_query') === null) {
                $("#queries_layout_query").val("").prop('selected', true);
            }
        }
        
        if($("#category_status").length >0){
            if (getParameterByName('category_status') != "" && getParameterByName('category_status') != null) {
                var selectedVal = getParameterByName('category_status');
                $("#category_status").val(selectedVal).prop('selected', true);
                
            }
        }
        
        if($("#queries_owner_query").length > 0){
            if (getParameterByName('queries_owner_query') != "" && getParameterByName('queries_owner_query') != null) {
                
                var selectedVal = getParameterByName('queries_owner_query');
                $("#queries_owner_query").val(selectedVal).prop('selected', true);
                document.querySelector('#queries_owner_query [value="' + selectedVal + '"]').selected = true;
            }
        }
        
        function getParameterByName(name, url) {
            
            if (!url) {
              url = window.location.href;
            }
       
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
        
        if (getParameterByName('queries_layout_query') === "" || getParameterByName('queries_layout_query') === null) {
           $("#queries_layout_query").prepend('<option value="" selected="selected">- Select -</option>');
        }
    }
    
    if($('.content-type-report').length > 0){
        busq.fn.reportCustomise();
    }
    
    // Event tracking for the ask a question feedback form
    $('#question-btn').on('click', function() {
      ga('send', 'event', 'Feedback (Ask a question)', 'Load');
    });
    // Event tracking for the report an issue feedback form
    $('#issue-btn').on('click', function() {
      ga('send', 'event', 'Feedback (Report an issue)', 'Load');
    });
    
    busq.fn.preventEnterDiscoverForm = function(){
        $(window).keydown(function(event){
            if(event.keyCode == 13) {
              event.preventDefault();
              return false;
            }
          });    
    }
    
    if ($("form#form_email_3121").length > 0){
        busq.fn.preventEnterDiscoverForm();
    }
    
    
    // Load the PDD image
    busq.fn.pddModalImage = function() {
        $('.species-carousel-item').click(function() {
            var targeturl = $(this).data('targeturl');
            var modalWrapper = $('#pddModal').find('.modal-body');
            modalWrapper.load(targeturl, function() {
                modalWrapper.addClass('in');
            });
        });
    };
    
    if($(".species-carousel-item").length > 0){
        busq.fn.pddModalImage();
    }

    
    busq.fn.tabletMegaMenu = function(){
        $(".header__navigation--list-item a").on("click", function(evt){
            if($(this).hasClass('active')){
                
            }else{
                evt.preventDefault();
                $(".header__navigation--list-item a").removeClass("active");
                $(this).addClass("active");
            }
        });
    }
    
    var ua = navigator.userAgent;
    var isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua);
    
    if (isiPad){  
        //if iPad
        busq.fn.tabletMegaMenu();
    }else{
        
    }
    
  
    
    
}(jQuery));
