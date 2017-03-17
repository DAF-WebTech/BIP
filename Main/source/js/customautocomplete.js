var bqfb = {
    fn: {},
    vars: {},
    search: {}
};

(function($) {
    'use strict';

    //Debounce function so we can slow down the autocomplete
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    }

    //
    // Funnelback auto suggestions
    //


    // Adding a wrapper so it doesn't break when elements are missing
    if ($('#ablisquery').length > 0) {
        bqfb.ablisLabelID = $('#ablisquery').attr('data-meta-ablis-label');
        bqfb.ablisDataID = $('#ablisquery').attr('data-meta-ablis-data');
        bqfb.autocompleteURL = $('#ablisquery').attr('data-autocompleteURL');


        //Saved values
        var ablisData = $('#' + bqfb.ablisDataID).val().split(';');
        var ablisLabels = $('#' + bqfb.ablisLabelID).val().split(';');


        //Some checks to see if the arrays are already empty, double make sure they're empty
        if (ablisData[0].length === 0) {
            ablisData = [];
        }

        if (ablisLabels[0].length === 0) {
            ablisLabels = [];
        }

        var theRequest = '';
        var fb_completion = {
            enabled: 'true',
            program: bqfb.autocompleteURL,
            parentSelector: 'form',
            alpha: '.5',
            show: 50,
            sort: '0',
            length: '3',
            delay: 150,
            searchSelector: 'ablisquery',
            /* The selector for the search input field */
            suggestionSelector: '.autocomplete--results' /* The selector for the suggestion box. Expects an ID or class name */
        };
    }


    // this function does a quick check over how may characters are present
    // in the search query.
    bqfb.search.loadSuggestions = function(event) {

        var searchVal = event.currentTarget.value;

        // if the search query is greater than x characters, start the search
        if (searchVal.length >= fb_completion.length) {
            bqfb.search.searchSuggestions(searchVal, event.currentTarget);
        } else { // if it's less than x then close the suggestion box
            bqfb.search.closeSuggestions();
        }

    };

    bqfb.search.replace = function(name) {
        return name.replace(/_/g, ",");
        //return name;
    };


    // the main function to load the search results
    // this function is expecting the search field text value to be passed
    bqfb.search.searchSuggestions = function(searchVal, element) {
            // store the search term
            theRequest = searchVal;
            var $this = $(element);
            // combine the URL params to a variable
            var theURL = fb_completion.program; /* + theRequest.replace(/ /g, '+');*/
            var formData = $this.serialize();
            formData = formData.replace('ablisquery', 'partial_query');
            var xhr = $.ajax({
                type: 'GET',
                url: theURL + '&' + formData,
                success: function(data) {

                    //var $data = JSON.parse(data);
                    var $results = data;
                    var $uniqueResults = [];

                    var $wrapper = $this.parents('form').find($(fb_completion.suggestionSelector));
                    var $suggestionslist = $('.ablis-suggestion-list');
                    $suggestionslist.html('');

                    //If there's nothing, hide the box
                    if ($results.length < 1) {
                        $wrapper.addClass('hide');
                        $('.autocomplete--moremessage').addClass('hide');
                    }

                    // some cleanup code
                    $.each($results, function(i, el) {
                        //remove dupes
                        if ($.inArray(el, $uniqueResults) === -1) {
                            $uniqueResults.push(el);
                        }

                        //remove odd extras funnelback is throwing in (weighting !== 90)
                        if (el.wt !== "90") {
                            $uniqueResults.splice($.inArray(el, $uniqueResults), 1);
                        }

                    });

                    //
                    if ($uniqueResults.length > 0) {

                        for (var i = 0; i < $uniqueResults.length; i++) {
                            if (i < fb_completion.show) {

                                //Find category
                                var catID = $uniqueResults[i].cat.replace(/ /g, '').replace(/&amp;/g, '');

                                //Find things
                                var code = $uniqueResults[i].disp.code
                                var name = $uniqueResults[i].disp.name
                                var synonym = $uniqueResults[i].disp.synonym

                                //Find search term
                                var term = theRequest;

                                //Boldersize search term
                                if (typeof(name) != 'undefined') {
                                    if (name.toLowerCase().indexOf(term) >= 0) {
                                        var regEx = new RegExp(term, "ig");
                                        var replacement = '<strong>$&</strong>';
                                        var boldName = name.replace(regEx, replacement);
                                    } else {
                                        var boldName = name;
                                    }
                                }



                                $('<li class="ablis-suggestion"><input type="checkbox" name="' + name + '" id="ablis-' + code + '" value="' + code + '" />  <label for="ablis-' + code + '"><span class="ablis-hidden-code">[' + code + ']</span>' + bqfb.search.replace(boldName) + '</a></li>').appendTo($suggestionslist);

                                //Tick anything already in the array
                                $.each(ablisData, function(key, value) {
                                    $('input#ablis-' + value + '').prop('checked', true);
                                });
                            }
                        }
                        // now add the compiled suggestions into the page and show if hidden
                        if ($suggestionslist.length > 0) {

                            // Unhide the whole list
                            $('.autocomplete--results').removeClass('hide').scrollTop(0);

                        }

                        //Show a message if you need to scroll the results
                        if ($uniqueResults.length > 6) {
                            $('.autocomplete--moremessage').removeClass('hide');
                        } else {
                            $('.autocomplete--moremessage').addClass('hide');
                        }

                    } else {
                        $wrapper.addClass('hide');
                        $('.autocomplete--moremessage').addClass('hide');
                    }

                }
            });

            //fix for focusout issue
            $this.parents('form').find('input').each(function() {
                if ($(this).hasClass('ui-autocomplete-input')) {

                } else {
                    $(this).click(function() {
                        $('.autocomplete--results').addClass('hide');
                        $('.autocomplete--moremessage').addClass('hide');
                        
                    });
                }
            });

        } // end searchSuggestions() function


    bqfb.search.ablisRemoval = function(itemdata, itemlabel) {

        //Unchecked deal with the data field
        ablisData.splice($.inArray(itemdata, ablisData), 1);
        $('#' + bqfb.ablisDataID).val(ablisData);

        //Unchecked deal with the label field
        ablisLabels.splice($.inArray(itemlabel, ablisLabels), 1);
        //var updatedablisLabels = ablisLabels.replace(/_/g,',');
        $('#' + bqfb.ablisLabelID).val(ablisLabels);

        //Replace commas with semicolons
        $('.ablis-input').each(function(key, value) {
            var thisvalue = $(this).val();
            $(this).val(thisvalue.replace(/,/g, ';'))
        });
        //Replace underscores with commas
        $('.ablis-input').each(function(key, value) {
            var thisvalue = $(this).val();
            $(this).val(thisvalue.replace(/_/g, ','))
        });

    }




    bqfb.fn.ablisAdd = function(itemdata, itemlabel) {

        //Add item to the data field
        ablisData.push(itemdata);
        $('#' + bqfb.ablisDataID).val(ablisData);

        //Add item to the label field
        ablisLabels.push(itemlabel);
        $('#' + bqfb.ablisLabelID).val(ablisLabels);
    }

    // when a user selects an option from autocomplete
    bqfb.search.ablisSelected = function() {

        var $checkbox = $(this).find('input');

        var itemdata = $checkbox.val();
        var itemlabel = $checkbox.attr('name');

        if ($checkbox.prop('checked')) {
            bqfb.fn.ablisAdd(itemdata, itemlabel);
        } else {
            bqfb.search.ablisRemoval(itemdata, itemlabel);
        }

        //Enable the Edit+ Button
        $('#ees_saveButtonAction').removeClass('disabled');

        //Replace commas with semicolons
        $('.ablis-input').each(function(key, value) {
            var thisvalue = $(this).val();
            $(this).val(thisvalue.replace(/,/g, ';'))
        });
        //Replace underscores with commas
        $('.ablis-input').each(function(key, value) {
            var thisvalue = $(this).val();
            $(this).val(thisvalue.replace(/_/g, ','))
        });

        //Clean out current options list
        $('.ablis-current-options-list').html('');


        bqfb.fn.updateAblisOptions();

    }

    bqfb.fn.updateAblisOptions = function() {
        //console.log(ablisLabels);
        //Update the options list
        $(ablisLabels).each(function(key, value) {
            var ablisDataItem = ablisData[key];
            var html = '<li class="' + ablisDataItem + '">' + bqfb.search.replace(value) + '<a href="#" class="ablis-remove" data-ablislabel="' + value + '" data-abliscode="' + ablisDataItem + '"><i class="fa fa-minus-circle" aria-hidden="true"></i></a></li>';
            $('.ablis-current-options-list').append(html);
        });
    }

    bqfb.fn.bindAblisRemove = function() {
        $('body').on('click', '.ablis-remove', function(key, value) {

            //Remove the options from the inputs
            var itemlabel = $(this).attr('data-ablislabel');
            var itemdata = $(this).attr('data-abliscode');
            bqfb.search.ablisRemoval(itemdata, itemlabel);

            //Remove this item from the list
            $(this).parent('li').remove();

            //Uncheck the item if the autocomplete box still exists
            $('#ablis-' + itemdata).prop('checked', false);

            //Enable the Edit+ Button
            $('#ees_saveButtonAction').removeClass('disabled');

            return false;
        });

        
    }

 
    // function to close the suggestion box
    bqfb.search.closeSuggestions = function() {
        // hide only if visible and clear the html
        $(fb_completion.suggestionSelector).filter(':visible').addClass('hide').find('.section ul').html('');
        $('.autocomplete--moremessage').addClass('hide');
    }



    //To prepopulate the Business Stage from storage on the 'Discover what you need' page
    bqfb.fn.prePopulateBusinessStage = function(objDiscover) {
          if (objDiscover) {
            var sBusinessStage = objDiscover.audience.business_stage;
            if (sBusinessStage) {
                var elConsidering = $('#q3143_q2_0'),
                    elStarting = $('#q3143_q2_1'),
                    elRunning = $('#q3143_q2_2'),
                    elGrowing = $('#q3143_q2_3'),
                    elClosing = $('#q3143_q2_4'),
                    objBusinessStage = {
                        considering: elConsidering,
                        starting: elStarting,
                        running: elRunning,
                        growing: elGrowing,
                        closing: elClosing
                    };

                var aValues = sBusinessStage.split(';'),
                    val;
                while (aValues.length) {
                    val = aValues.shift();
                    $.each(objBusinessStage, function(k, v) {
                        if (k === val && v.length) {
                            v.prop('checked', true).trigger('change');
                            return false;
                        }
                    });
                }
                return objDiscover;
            }
        } else {
          
            return false;
        }
    };



    //To prepopulate the Business Size from storage on the 'Discover what you need' page
    bqfb.fn.prePopulateStaff = function(objDiscover) {
        if (objDiscover) {
            var sStaff = objDiscover.audience.business_size;
            if (sStaff) {
                var elZero = $('#q3143_q3_0'),
                    elUpTo_4 = $('#q3143_q3_1'),
                    elUpTo_19 = $('#q3143_q3_2'),
                    elUpTo_199 = $('#q3143_q3_3'),
                    elMoreThan_200 = $('#q3143_q3_4'),
                    objStaff = {
                        zero: elZero,
                        '1_to_4': elUpTo_4,
                        '5_to_19': elUpTo_19,
                        '20_to_199': elUpTo_199,
                        '200_plus': elMoreThan_200
                    },
                    changed = false;

                $.each(objStaff, function(k, v) {
                    if (k === sStaff && v.length) {
                        v.prop('checked', true).trigger('change');
                        changed = true;
                        return false;
                    }
                });
                return objDiscover;
            }
        } else {
            return false;
        }
    };


    //To prepopulate the Business Location & Region in within Queensland from storage on the 'Discover what you need' page
    bqfb.fn.prePopulateLocation = function(objDiscover) {
        if (objDiscover) {
            var sLocation = objDiscover.audience.business_location;
            if (sLocation) {
                var elQueensland = $('#q3143_q4_0'),
                    elInterstate = $('#q3143_q4_1'),
                    elOverseas = $('#q3143_q4_2'),
                    objLocation = {
                        interstate: elInterstate,
                        overseas: elOverseas,
                        queensland: elQueensland
                    },
                    elRegion = $('#q3143_q5'),
                    aRegion = busq.vars.regions,
                    changed = false;

                $.each(objLocation, function(k, v) {
                    if (sLocation === 'queensland') {
                        if (v.length) {
                            v.prop('checked', true).trigger('change');
                            var sRegion = objDiscover.audience.business_region;

                            if (sRegion) {
                                for (var i = aRegion.length - 1; i >= 0; i--) {
                                    if (aRegion[i] === sRegion) {
                                        elRegion.val(sRegion).trigger('change');
                                        break;
                                    }
                                }
                            }
                            changed = true;
                        }
                    } else {
                        if (k === sLocation && v.length) {
                            v.prop('checked', true).trigger('change');
                            changed = true;
                        }
                    }
                });
                return objDiscover;
            }
        } else {
            return false;
        }
    };


    //To prepopulate the Business Industry from storage on the 'Discover what you need' page
    bqfb.fn.prePopulateABLIS = function(objDiscover) {
        if (objDiscover) {
            //Adding a conditional so we don't show 'All Businesses'
            if (objDiscover.audience.business_industry != 'Z') {
                var arrKeys = objDiscover.audience.business_industry.split(';'),
                    arrValues = objDiscover.audience.business_industry_value.split(';');
                if (arrKeys.length === arrValues.length) {
                    for (var i = 0, len = arrKeys.length; i < len; i++) {
                        bqfb.fn.ablisAdd(arrKeys[i], arrValues[i]);
                    }
                }
                // bqfb.fn.updateAblisOptions();
                return objDiscover;
            }
        } else {
            return false;
        }
    };


    //To prepopulate the form fields from storage on the 'Discover what you need' page
    bqfb.fn.prePopulateDiscoverForm = function(objDiscover) {
        if ($('#form_email_3121').length) {
            bqfb.fn.prePopulateBusinessStage(objDiscover);
            bqfb.fn.prePopulateStaff(objDiscover);
            bqfb.fn.prePopulateLocation(objDiscover);
            bqfb.fn.prePopulateABLIS(objDiscover);
        } else {
            return false;
        }
    };


    //Check if we're on the front end
    if (typeof busq !== 'undefined') {
      bqfb.fn.prePopulateDiscoverForm(busq.fn.getStorageObject('userinfo'));
    }


    $(document).ready(function() {
        //console.log('document is ready!');
  
        // Adding a wrapper so it doesn't break when elements are missing
        if ($('#ablisquery').length > 0) {
            // initialise auto suggestion
            $('input[name="' + fb_completion.searchSelector + '"]').each(function(key, value) {
                var $this = $(this);

                // make sure auto suggestion is enabled
                if (fb_completion.enabled === 'true') {
                    var suggestionClassName = fb_completion.suggestionSelector.substr(1);
                }
            });

            //Define a debounce function to slow this down
            var debouncedAutocomplete = debounce(function(event) {
                bqfb.search.loadSuggestions(event);
            }, fb_completion.delay);


            //
            // init various event functions
            //
            // on key up or focus - run some checks before querying search
            $('input[name="' + fb_completion.searchSelector + '"]').on('keyup focus', debouncedAutocomplete);


            // user has clicked on a text only suggestion
            $(fb_completion.suggestionSelector).on('change', '.ablis-suggestion', bqfb.search.ablisSelected);


            // close suggestion box if user clicks elsewhere
            $('html').bind("click touchstart", function(ele) {
                if ($(ele.target).parents(fb_completion.parentSelector).length > 0) {
                    //  ele.stopPropagation();
                    //console.log('here');
                } else {
                    bqfb.search.closeSuggestions();
                }
            });

            //Bind remove items with icon
            bqfb.fn.bindAblisRemove();

            //Update the ABLIS Options list
            bqfb.fn.updateAblisOptions();
        }

    });

    $('#form_email_3121_reset').on('click', function() {
        $('.ablis-remove').trigger('click');
        console.log()
    });

})(jQuery);
