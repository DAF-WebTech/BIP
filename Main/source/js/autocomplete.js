(function($){
    'use strict';
    
    function getPathFromUrl(url) {
        return url.split("?")[0];
    }
    
    
                          
    busq.fn.searchAutocomplete = function(){
    //Debounce function so we can slow down the autocomplete              
    function debounce(func, wait, immediate) {
    	var timeout;
    	return function() {
    		var context = this, args = arguments;
    		var later = function() {
    			timeout = null;
    			if (!immediate) func.apply(context, args);
    		};
    		var callNow = immediate && !timeout;
    		clearTimeout(timeout);
    		timeout = setTimeout(later, wait);
    		if (callNow) func.apply(context, args);
    	};
    };
    
    
    
    jQuery('[data-toggle=tooltip]').tooltip({'html': true});
    
    var busqfb = [];
    busqfb.search = {};
    busqfb.collection = $('.header__search-form input[name="collection"]').attr('value');
    busqfb.searchURL = $('.header__search-form').attr('action');
    busqfb.autocompleteURL = $('.header__search-form').attr('data-autocompleteurl') + '?fmt=json++';
    busqfb.logUrl = 'https://deedi-search.clients.squiz.net/s/log';
    
    var fb_completion = {
        'enabled'    : 'true',
        'collection' : busqfb.collection,
        'program'    : busqfb.autocompleteURL,
        'interactionLog' : busqfb.logUrl,
        'standardCompletionEnabled': true,
        'format'    : 'extended',
        'alpha'      : '.5',
        'show'       : '10',
        'sort'       : '0',
        'length'     : '3',
        'delay'      : '150',
        'parentSelector' : 'form',
        'searchSelector'    : 'query', /* The selector for the search input field */
        'suggestionSelector': '.autocomplete' /* The selector for the suggestion box. Expects an ID or class name */
    }
    
    $(document).ready(function(){
        // initialise auto suggestion
        $('.header__search .form__autocomplete input[name="' + fb_completion.searchSelector + '"]').each(function(key, value){
            var $this = $(this);
            // make sure auto suggestion is enabled
            if(fb_completion.enabled === 'true'){
              // store the selector specified for the suggestion box
              // removing the first . or # character
              // insert the suggestion box to the end of the parent container
              var parentItem = $this.parents(fb_completion.parentSelector);
              $('<div class="content__tile autocomplete hide"><ul class="content__tile-body"></ul></div>').appendTo(parentItem);
            }
        });
        
        // initialise auto suggestion
        $('.home__search .form__autocomplete input[name="' + fb_completion.searchSelector + '"]').each(function(key, value){
            var $this = $(this);
            // make sure auto suggestion is enabled
            if(fb_completion.enabled === 'true'){
              // store the selector specified for the suggestion box
              // removing the first . or # character
              // insert the suggestion box to the end of the parent container
              var parentItem = $this.parents(fb_completion.parentSelector);
              var categoriesHTML = '';
              $('<div class="content__tile autocomplete hide"><ul class="content__tile-body">' + categoriesHTML + '</ul></div>').appendTo(parentItem);
            }
        });
        
         // initialise auto suggestion
        $('body.search #busqSiteSearch.form__autocomplete input[name="' + fb_completion.searchSelector + '"]').each(function(key, value){
            var $this = $(this);
            // make sure auto suggestion is enabled
            if(fb_completion.enabled === 'true'){
              // store the selector specified for the suggestion box
              // removing the first . or # character
              // insert the suggestion box to the end of the parent container
              var parentItem = $this.parents(fb_completion.parentSelector);
              var categoriesHTML = '';
              $('<div class="content__tile autocomplete hide"><ul class="content__tile-body">' + categoriesHTML + '</ul></div>').appendTo(parentItem);
            }
        });
               
        //Define a debounce function to slow this down
        var debouncedAutocomplete = debounce(function(event){
        	 busqfb.search.loadSuggestions(event);
        }, fb_completion.delay);
        
                      
        //
        // init various event functions
        //
        // on key up or focus - run some checks before querying search
        $('input[name="' + fb_completion.searchSelector + '"]').on('keyup focus', debouncedAutocomplete);
        // user has clicked on a text only suggestion
        $(fb_completion.suggestionSelector).on('click','.fb-text', busqfb.search.suggestionTextClick);
        // close suggestion box if user clicks elsewhere
        $('html').bind("click touchstart", function(ele){
          if($(ele.target).parents(fb_completion.parentSelector).length > 0){
          //  ele.stopPropagation();
          } else {
            busqfb.search.closeSuggestions();
          }
        });
      });
      
      // this function does a quick check over how may characters are present
      // in the search query.
      busqfb.search.loadSuggestions = function(event){
        
        var searchVal = event.currentTarget.value;
        
        // if the search query is greater than x characters, start the search
        if(searchVal.length >= fb_completion.length){
          busqfb.search.searchSuggestions(searchVal, event.currentTarget);
        } else { // if it's less than x then close the suggestion box
          busqfb.search.closeSuggestions();
        }
        
      }
      
    // the main function to load the search results
    // this function is expecting the search field text value to be passed
    busqfb.search.searchSuggestions = function(searchVal,element){
        // store the search term
        var theRequest = searchVal;
        var $this = $(element);
        // combine the URL params to a variable
        var theURL = fb_completion.program;/* + theRequest.replace(/ /g, '+');*/
        var formData = $this.parents('form').serialize();
        formData = formData.replace('query', 'partial_query');
        formData = formData.replace('num_ranks=10', 'num_ranks=20');
        formData = formData.replace('business-qld-meta', 'business-qld');
        
        var xhr = $.ajax({
            type: 'GET',
            url: theURL + '&' + formData,
            success: function(data) {
                
                //console.log(theURL + '&' + formData);
                //console.log(data);
                //var $data = JSON.parse(data);
                var $results = data;
                var $uniqueResults = [];
                
                // clear out duplicates
                $.each($results, function(i, el){
                    if($.inArray(el, $uniqueResults) === -1) $uniqueResults.push(el);
                });
                //console.log($uniqueResults.length);
                //
                if($uniqueResults.length > 0){
                    //Split results into categories
                    var categories = [];
                    $uniqueResults.forEach(function(key, value){
                      categories.push(key.cat);
                    });
                    
                    var $uniqueCat=categories.filter(function(itm,i,a){
                        return i==categories.indexOf(itm);
                    });
                    
                    var $wrapper = $this.parents('form').find($(fb_completion.suggestionSelector));
                    var $suggestionslist = $wrapper.children('ul');
                    $suggestionslist.find('.section ul').html('');
                    $('.autocomplete ul.content__tile-body').html('');
                    
                    var footer = '<div class="content__tile-foot"><a href="' + busqfb.searchURL + '?query=' + theRequest + '&collection=' + busqfb.collection + '">View all search results for <strong>' + theRequest + '</strong></a></div>';
                    
                    $uniqueCat.forEach(function(key,value){
                      var catID = key.replace(/ /g, '').replace(/&amp;/g, '');
                      
                      if (catID.length === 0){
                        catID = 'Suggestions';
                        key = 'Suggestions'
                      };
                      
                      var autocompleteUL = '#'+catID;
                      if ($wrapper.find(autocompleteUL)[0]){
                              //do nothing
                      }else{
                        var catContainer = '<li class="section content__tile-head show ' + catID + '"><h3>' + key + '</h3>' + '<ul class="list__square" id="' + catID + '"></ul></li>';
                      }
                
                      $suggestionslist.append(catContainer);
                      var appendTo = $wrapper.find('.autocomplete ul.content__tile-body');
                      $wrapper.find('ul.content__tile-body').find('li.section.Suggestions').appendTo(appendTo);
                    });
                    
                    $wrapper.find('.content__tile-foot').remove();
                    
                    $(footer).insertAfter($suggestionslist);
                    
                    for(var i = 0; i < $uniqueResults.length; i++){
                        if(i < fb_completion.show){
                          
                          //Resets
                          var destination= '';
                         
                          //Find category
                          var catID = $uniqueResults[i].cat.replace(/ /g, '').replace(/&amp;/g, '');
                          
                          //Find title
                          var title = $uniqueResults[i].disp;
                          console.log(title);
                          
                          //Find search term
                          var term = theRequest;
                          
                          //Boldersize search term
                          if (title.toLowerCase().indexOf(term) >= 0){
                            var regEx = new RegExp(term, "ig");
                            var replacement = '<strong>$&</strong>';
                            var title = title.replace(regEx, replacement);
                          }
                          
                          //Replace blank category with 'Suggestions'
                          if (catID.length === 0){
                            catID = 'Suggestions';
                          };
                          
                          //Find destination
                          
                          if ($uniqueResults[i].action.length > 0) {
                              destination = $uniqueResults[i].action;
                          } else {
                              destination = busqfb.searchURL + '?query=' + $uniqueResults[i].key + '&collection=' + busqfb.collection;
                          }
                       
                          
                          if (catID === 'Suggestions'){
                              var item = '<li><a href="' + destination + '">' + title +'</a></li>';
                          }else{
                              if($uniqueResults[i].action.indexOf('business.qld') > -1){
                                  var item = '<li><a href="' + getPathFromUrl(destination) + '">' + title +'</a></li>';
                              }else{
                                  var item = '<li><a target="_blank" href="' + getPathFromUrl(destination) + '">' + title +' <i class="fa fa-external-link-square" aria-hidden="true"></i></a></li>';
                              }
                          }
                          var parentWrapper = $wrapper.find('#' + catID);
                          $(item).appendTo(parentWrapper);
                        }
                    }
                    
                    //Jam Content to the bottom
                    var $contentsection = $wrapper.find('.section.Content');
                    var $suggestionssection = $wrapper.find('.section.Suggestions');
                    var $sectionParent = $contentsection.parent();
                    $contentsection.appendTo($sectionParent);
                    $suggestionssection.appendTo($sectionParent);
                    
                    
                  // now add the compiled suggestions into the page and show if hidden
                  if ($suggestionslist.length > 0){
                      var $suggestionsections = $suggestionslist.parents('form').find('.section ul');
                      
                      // Any category that does have suggestions, unhide
                      $suggestionsections.has('li').parents('.section.hidden').addClass('show').removeClass('hidden');
                      // Any category that does not have suggestions, hide
                      $suggestionsections.not(':has(li)').parents('.section').removeClass('show').addClass('hidden');
                      
                      // Unhide the whole list
                      $suggestionslist.parents('form').find('.autocomplete').removeClass('hide');
                  }
                } else {
                  $this.parents('form').find($(fb_completion.suggestionSelector)).addClass('hide');
                }
                
              }
        });
      } // end searchSuggestions() function
      // when a user clicks on a text suggestion
      busqfb.search.suggestionTextClick = function (){
        // replace the search field value with the clicked text
        $(this).parents('form').find('input[name="' + fb_completion.searchSelector + '"]').val($.trim($(this).text()));
        $(this).parents('form').find('input[name="' + fb_completion.searchSelector + '"]').focus();
        // now hide the suggestion box
        busqfb.search.closeSuggestions();
        /*return false;*/
      }
      // function to close the suggestion box
      busqfb.search.closeSuggestions = function(){
        // hide only if visible and clear the html
        $(fb_completion.suggestionSelector).filter(':visible').addClass('hide').find('.section ul').html('');
      }

    }
    
    busq.fn.searchAutocomplete();

}(jQuery));