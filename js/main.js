// some javascript goes here!
$(document).ready(function() {

	//hide the dimmer:
	$('#dimmer').hide();
	
	//modify search bar to change size with window
	var width = $(window).width();
	$('#srch_bar').attr({size: width*0.04});
	
	
	//Shows Login Panel
		$('#advancedButton').toggle(
		function() {
			$('#advancedPanel').show();
			$(this).rotate(-90);
			//$('#dimmer').show();
			//$(this).addClass('close');
		},
		function() {
			$('#advancedPanel').hide();
			$(this).rotate(0); //haha it rotates with regards to original position...
			//$(this).removeClass('close');
			//$('#dimmer').hide();
			}
		); // end toggle
		
	// another listener for if you click login message	
		$('.login_msg').toggle(
		function() {
			$('#advancedPanel').show();
			$('#advancedButton').rotate(-90);
			//$('#dimmer').show();
			//$(this).addClass('close');
		},
		function() {
			$('#advancedPanel').hide();
			$('#advancedButton').rotate(0); //haha it rotates with regards to original position...
			//$(this).removeClass('close');
			//$('#dimmer').hide();
			}
		);
		
	// toggles Sign-Up panel
		$('#signupPanel').hide();
		$('#signupBtn').toggle(function(){
			$('#signupPanel').show();
			},
			function(){
			$('#signupPanel').hide();
			}
		);
	
	// geolocation scripting see -> location_detection.js
/**** MAP/ LOCATION SCRIPTING ****/
	get_location();
	$('#map_wrapper').hide();
	

/**** EVENT POSTING SCRIPTING ***/
	$('#postEventForm-wrapper').hide();
	
	
/*** login ***/

	$("#loginMainForm").submit(function(event) {
		console.log("submitting signin");
		event.preventDefault();
		signIn();
		});
	
	
/**** SIGNUP SUBMISSION STUFF BELOW:  ****/
	// CHECK FOR VALID EMAIL	
		$('#email').keyup(function(){
			var email = $('#email').val();
			
			// returns BINARY - 1 = not matched = good
			// This is the nasty bit:
			//var res = 1;//find_email(email);
			var re = /\S+@\S+/g;
			
			// PROMISE FROM AJAX CALL
			var promise = find_email_prom(email);
			
			promise.success(function (data) {
				var res = data;
				if(res == 0 && re.test(email))
					$("#emailIsValid").empty().append("<font color='green'>good</font>");
				else
					$("#emailIsValid").empty().append("<font color='red'>bad</font>");
					
			});	
		});

			
/*** POSTING EVENT DATA PICKER ***/	
		
	$("#eventDateBegin").AnyTime_picker({ 
		format: "%Y-%m-%d %H:%i",
        formatUtcOffset: "%: (%@)",
        hideInput: false 
		});
	
	$("#eventDateEnd").AnyTime_picker(
        { format: "%Y-%m-%d %H:%i",
          formatUtcOffset: "%: (%@)",
          hideInput: false            //change later only for dev purposes
          //placement: "inline" 
          });
		
	$("#eventDateBegin").change(function() {
		
		var dateBegin = $("#eventDateBegin").val();
		
		// NOT DONE:
		// push date ahead of current date 60 mins if needed
		/*
		var firstTime = strtotime(datebegin);
		var ts = (new Date()).getTime();
		
		if( firstTime < (ts + 60*60)) // at least an hour ahead
			var dateBegin = d.getFullYear() + "-" + month + "-" + day + " " + hrs + ":" + mins
			* 
			*/
		
		// push date ahead 3 hrs.
		var newTime = strtotime(dateBegin) + 60*60*3; // + 3 hrs
		console.log(newTime);
		var d = new Date(newTime * 1000);
		var month = d.getMonth() + 1;
		if(month < 10)
			month = "0" + month.toString();
		var day = d.getDate();	
		if(day < 10)
			day = "0" + day.toString();
		var hrs = d.getHours();
		if(hrs < 10)
			hrs = "0" + hrs.toString();
		var mins = d.getMinutes();
		if(mins < 10) 
			mins = "0" + mins.toString();
		var newDateEnd = d.getFullYear() + "-" + month + "-" + day + " " + hrs + ":" + mins;
		console.log(newDateEnd);
		$("#eventDateEnd").val(newDateEnd);
		});

	// popup box on event submission success
	$('#postEventSuccess').hide();
	
	
	// char count for the description
	$('#eventDescription').keyup(function(){
		var txt = $('#eventDescription').val();
		var count = txt.length;
		if(count >= 500) {
			$('#descriptionCount').empty().append("<font color='red'>" + count + "</font>");
			}
		else {
			$('#descriptionCount').empty().append("<font color='green'>" + count + "</font>");
			}
		});
		
		
	// checkbox for contacting:
	$('#contactingOptions').hide();
	
	$('#allowContactEvtent').change( function(){
		var contact = $('#allowContactEvtent').attr('checked');
		console.log("contact value=" + contact);
		if(contact == "checked"){
			$('#contactingOptions').show();
			}
		else {
			$('#contactingOptions').hide();
			}
		});
	
	// event tags
	$('#eventTagsChoices').hide();
	$('#eventTags').click( function() {
		$('#eventTagsChoices').show();
		console.log("tags clicked");
		});
	
	

/**** EVENT EDITING WINDOW ****/


/*** SINGLE EVENT MAP ***/

	$('#EventMapWrapper').hide();
	$('#EventDirections').hide();
	
	
/*** MY EVENTS ***/
	$('#myEventsWrapper').hide();
	
/*** Hotkey to close out pop-up ***/
	$(document).keydown(function(e){
		//console.log("keypress");
		//console.log(e.keyCode);
		if(e.keyCode == 27) {
			//console.log("escape key");
			// THIS IS ALSO A FULL LIST OF POPUPS
			$("#dimmer").hide();
			$('#EventMapWrapper').hide();
			$('#EventDirections').hide();
			$('#myEventsWrapper').hide();
			$('#postEventForm-wrapper').hide();
			$('#map_wrapper').hide();
			$('#advancedPanel').hide();
			$('#tempWindow').hide();
			$('#postEventSuccess').hide();
			$('#aboutWaanoo').hide();
			$('#contactWaanoo').hide();
		}
	});	
	

/*** FOOTER popups ***/
	$('#aboutWaanoo').hide();
	$('#contactWaanoo').hide();
	
	
/*** ajax loaders ***/

	$('#ajaxLoaderLoadEvents').hide();
	$('#ajaxLoaderLoadMore').hide();
	$('#ajaxLoaderPostEvent').hide();
	$('#ajaxLoaderSignUp').hide();
	
/***fb auth ***/
	
	/*

	$('#facebookBtn').click( function() {
	   // var pos = screenCenterPos(800, 500);
		var url = 'fb/channel.php';
		signinWin = window.open(url, "SignIn", "width=780,height=410,toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0,left=" + ($(window).width() / 2) + ",top=" + ($(window).height() / 2));
		setTimeout(CheckLoginStatus, 2000);
		signinWin.focus();
		return false;
	    });	
	
	*/
		
});  // end ready
