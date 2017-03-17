jQuery( document ).ready(function() {

// Scope variables
var cookieName = "survey";
var minSessionSeconds = 90;
var minPagesVisited = 3;
var expiryDaysCompleted = 90;
var expiryDaysNo = 30;
    
function initExitIntentSurvey() {

    // Settings
    $.cookie.json = true;
    
    // UI handlers
    $(".exit-survey__panel").on("click", toggleSurvey);
    
    $("#exit-survey-question-no").on("click", noToSurvey);
    $("#exit-survey-question-yes").on("click", yesToSurvey);
    //$(".exit-survey").on("click", toggleSurvey);
    //$("#exit-survey-start").on("click", showSurvey);
    //$("#exit-survey-leave-yes").on("click", showSurvey);
    $("#exit-survey-leave-no").on("click", deferSurvey);
    $("#exit-survey-later").on("click", deferSurvey);

    /*$('#exit-survey-link').fancybox({
        width: 600,
        height: 800,
        autoDimensions: false,
        // This is to mitigate an issue on iOS devices where the modal content doesn't scroll
        // solution from http://www.ianhoar.com/2011/08/25/jquery-and-fancybox-how-to-automatically-set-the-height-of-an-iframe-lightbox/
        onComplete: function() {
          $('#fancybox-frame').load(function() {
            $('#fancybox-content').height($(this).contents().find('body').height()+30); //resize the modal to fit all content. 
            $.fancybox.center();
            $("#fancybox-frame").contents().find("#submit-fake-exit-survey").on("click", setSurveyTaken);
          });
        }
    });*/
    
    // View init
    if ( !getCookie() || getCookie().showSurvey ) {
        $(document).on("mouseleave", ifLeaving);
        determineAction();
    }
    
    
    
}



function determineAction(newPage, leaving) {
    var cookie = getCookie();
    newPage = typeof newPage !== 'undefined' ? newPage : true;
    leaving = typeof leaving !== 'undefined' ? leaving : false;

    // Cookie
    if (cookie === null) {
        cookie = { pageNumber: 1, timeOnSite: moment().unix(), showSurvey: true, accepted: false };
        setCookie(cookie);

        ga('send', 'event', 'Exit Survey', 'Invitation_load');
        
        return false;
    } else if (newPage) {
        cookie.pageNumber = cookie.pageNumber + 1;
        setCookie(cookie);    
    }

    // Display logic
    if(eligibleForSurvey()) {
        $(".exit-survey").show();
         ga('send', 'event', 'Exit Survey', 'Invitation_load');
        if(!cookie.accepted) {
            slideSurveyBoxOut(leaving);
        }
    }
}


    function eligibleForSurvey() {
        var cookie = getCookie();
        if(cookie.showSurvey) {
            if( secondsOnSite() > minSessionSeconds && cookie.pageNumber >= minPagesVisited) {
                return true;
            }       
        }
        return false;
    }
$(window).resize(function(){
    eligibleForSurvey();
});

function toggleSurvey(){
    if ($(".exit-survey").hasClass('active')){
        slideSurveyBoxIn();
    }else{
        slideSurveyBoxOut();
    }
    
    return false;
}

function ifLeaving(e) {
    var cookie = getCookie();
    if(e.clientY < 0) {
        if($('#feedbackForm').hasClass('in')){
            
        }else{
            if(cookie.showSurvey && cookie.accepted) {
                slideSurveyBoxOut(true);
            }
        }
    }
}

function noToSurvey(ev) {
    setSurveySaysCookie(false);
    slideSurveyBoxIn();
    hideSurveyBox();

    ga('send', 'event', 'Exit Survey', 'Invitation_No');

    return false;
}

function yesToSurvey(ev) {
    var cookie = getCookie();
    cookie.accepted = true;
    setCookie(cookie);

    $(".exit-survey .content-panel").hide();
    $("#exit-survey-start-panel").show();
    ga('send', 'event', 'Exit Survey', 'Invitation_Yes');
    return false;
}

function deferSurvey(ev) {
    ga('send', 'event', 'Exit Survey', 'Survey_Defer');

    slideSurveyBoxIn();
    return false;
}

function showSurvey(ev) {
    //$(document).off("mouseleave", ifLeaving);
    //slideSurveyBoxIn();
    ga('send', 'event', 'Exit Survey', 'Survey_Start');
    return false;
}

/*$('#feedbackForm').on('shown.bs.modal', function (e) {
  slideSurveyBoxIn();
  ga('send', 'event', 'Exit Survey', 'Survey_Start');
})*/

function setSurveyTaken(ev) {
    setSurveySaysCookie(true);
    hideSurveyBox();
    //alert('survey done');
    

    return false;
}

function setSurveySaysCookie(completed) {
    var cookie = getCookie();
    completed = typeof completed !== 'undefined' ? completed : true;

    cookie.showSurvey = false;
    setCookie(cookie, completed);
}

function slideSurveyBoxOut(leaving) {
    leaving = typeof leaving !== 'undefined' ? leaving : false;

    var cookie = getCookie();
    
    $(".exit-survey").addClass("active").addClass('in');
    
    if(cookie.accepted && leaving === true) {
        $(".exit-survey .content-panel").hide();
        $("#exit-survey-leave").show();    
    }
    else if(cookie.accepted) {
        $(".exit-survey .content-panel").hide();
        $("#exit-survey-start-panel").show();
    }
}

function slideSurveyBoxIn(ev) {
    $('.exit-survey').removeClass('in').removeClass("active");
    //$("#exit-survey-panel").removeClass("active");
    //$("#exit-survey-panel .panel").hide();
    //$('.exit-survey').hide();
    return false;
}

function hideSurveyBox() {
    $(".exit-survey").hide();
}

function secondsOnSite() {
    var cookieTime = moment.unix(getCookie().timeOnSite);
    var currentDate = moment();

    return currentDate.diff(cookieTime, 'seconds');
}

function getCookie() {
    var cookie = $.cookie(cookieName) || null;
    return cookie;
}

function setCookie(cookie, completed) {
    completed = typeof completed !== 'undefined' ? completed : true;

    if ( completed ) {
        $.cookie(cookieName, cookie, { expires: expiryDaysCompleted, path: '/' });
    } else {
        $.cookie(cookieName, cookie, { expires: expiryDaysNo, path: '/' });
    }
}

initExitIntentSurvey();

function feedbackCloseModal(){
     setTimeout(function(){ 
         if($('#feedbackForm').hasClass('in')){
            $('#feedbackForm').modal('toggle'); 
         }
     }, 10000);
}


function formReady(){
    slideSurveyBoxIn();
    $("#form_email_35778").validate({
        ignore:":hidden",
        errorPlacement: function(error, element) {
    		$( element ).closest('.sq-form-question').find('.error').append(error);
    	},
    	rules: {
            field: {
              required: true,
            }
        },
        submitHandler: function(form) {
            
            var form = $('#form_email_35778');
            var formData = form.serialize();
            var formSubmit = form.find('input[type="submit"]');
            // process the form
            $.ajax({
                type: 'POST',
                url: form.attr('action'),
                data: formData,
                success: function (response) {
                    
                    $('.modal-body').html(response);
                    hideSurveyBox();
                    setSurveySaysCookie(true);
                    ga('send', 'event', 'Exit Survey', 'Submit');
                    if($('.sq-form-errors-message').length === 0){
                        feedbackCloseModal();
                    }
    
                }
            });
                
        }
    });
}

$("#feedbackForm").on('shown.bs.modal', function (e) {
  setTimeout(function(){ formReady(); }, 1000);
})

$( document ).ready(function() {
    //busq.fn.determineWidth();
});
    

});