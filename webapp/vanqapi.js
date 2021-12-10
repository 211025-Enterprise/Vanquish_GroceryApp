
const apiBaseUrl = 'http://localhost:8081/api'

// function tokenPersistanceFunction(updatedOauth){
//     // Here you will get Updated Oauth values 
//     // Save these to DB
//     return saveAccessToken(updatedOauth.access_token, updatedOauth.refresh_token);
// }

// Client.prototype.queryApi = function (options, tokenPersistanceFunction, callback) {
//     return request.postAsync({
//         headers: {
//         Authorization: 'Bearer ' + access_token
//     },
//         url: this.options.url + this.options.apiVersion,
//         body: JSON.stringify(options)}).
//         then(function (result) {
//             // You have some indication from your oauth server, that your access_token is expired.
//             // You can check your response here to know whether access_token is expired or not.
//             // If access_token is expired, Make request to refresh access token.
//             // In your case 
//             if(AccessTokenIsExpired){
//                 // Function that will make request to refresh access_token by presenting refresh_token
//                 return tokenRefresh( refreshAccessTokenOptions,tokenPersistanceFunction)
//               .then(function(result){

//                   //Extract access_token, refresh_token from response
//                   // call 'tokenPersistanceFunction' to store these token in your DB.

//                   return tokenPersistanceFunction(updatedOauth);

//               })
//               .then(function(savedOauthTokensSuccess){
//                   // Now you have the updated Oauth tokens, you can make request to get resource
//                   // this call will return you the actual response.
//                   return queryApi(options, tokenPersistanceFunction, callback);
//               })
//             }else{
//               var json = JSON.parse(result[1]);

//             if (_.isFunction(callback)) {
//                 callback(null, json);
//             }
//             return json;
//             }


//         }).
//         catch(function (err) {
//             if (_.isFunction(callback)) {
//                 callback(err);
//                 return;
//             }
//             throw err;
//         });
// };

jQuery(document).ready(function($){
	var $form_modal = $('.cd-user-modal'),
		$form_login = $form_modal.find('#cd-login'),
		$form_signup = $form_modal.find('#cd-signup'),
		$form_forgot_password = $form_modal.find('#cd-reset-password'),
		$form_modal_tab = $('.cd-switcher'),
		$tab_login = $form_modal_tab.children('li').eq(0).children('a'),
		$tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
		$forgot_password_link = $form_login.find('.cd-form-bottom-message a'),
		$back_to_login_link = $form_forgot_password.find('.cd-form-bottom-message a'),
		$main_nav = $('.main-nav');

	//open modal
	$main_nav.on('click', function(event){
		if( $(event.target).is($main_nav) ) {
			// on mobile open the submenu
			$(this).children('ul').toggleClass('is-visible');
		} else {
			// on mobile close submenu
			$main_nav.children('ul').removeClass('is-visible');
			//show modal layer
			$form_modal.addClass('is-visible');	
			//show the selected form
			( $(event.target).is('.cd-signup') ) ? signup_selected() : login_selected();
		}

	});

	//close modal
	$('.cd-user-modal').on('click', function(event){
		if( $(event.target).is($form_modal) || $(event.target).is('.cd-close-form') ) {
			$form_modal.removeClass('is-visible');
		}	
	});
	//close modal when clicking the esc keyboard button
	$(document).keyup(function(event){
    	if(event.which=='27'){
    		$form_modal.removeClass('is-visible');
	    }
    });

	//switch from a tab to another
	$form_modal_tab.on('click', function(event) {
		event.preventDefault();
		( $(event.target).is( $tab_login ) ) ? login_selected() : signup_selected();
	});

	//hide or show password
	$('.hide-password').on('click', function(){
		var $this= $(this),
			$password_field = $this.prev('input');
		
		( 'password' == $password_field.attr('type') ) ? $password_field.attr('type', 'text') : $password_field.attr('type', 'password');
		( 'Hide' == $this.text() ) ? $this.text('Show') : $this.text('Hide');
		//focus and move cursor to the end of input field
		$password_field.putCursorAtEnd();
	});

	//show forgot-password form 
	$forgot_password_link.on('click', function(event){
		event.preventDefault();
		forgot_password_selected();
	});

	//back to login from the forgot-password form
	$back_to_login_link.on('click', function(event){
		event.preventDefault();
		login_selected();
	});

	function login_selected(){
		$form_login.addClass('is-selected');
		$form_signup.removeClass('is-selected');
		$form_forgot_password.removeClass('is-selected');
		$tab_login.addClass('selected');
		$tab_signup.removeClass('selected');
	}

	function signup_selected(){
		$form_login.removeClass('is-selected');
		$form_signup.addClass('is-selected');
		$form_forgot_password.removeClass('is-selected');
		$tab_login.removeClass('selected');
		$tab_signup.addClass('selected');
	}

	function forgot_password_selected(){
		$form_login.removeClass('is-selected');
		$form_signup.removeClass('is-selected');
		$form_forgot_password.addClass('is-selected');
	}

	//Submission of the login/signup page 
	$form_login.find('input[type="submit"]').on('click', function(event){

        signin();
	});
	$form_signup.find('input[type="submit"]').on('click', function(event){
        
        signUp();
	});


	//IE9 placeholder fallback
	//credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
	if(!Modernizr.input.placeholder){
		$('[placeholder]').focus(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
		  	}
		}).blur(function() {
		 	var input = $(this);
		  	if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.val(input.attr('placeholder'));
		  	}
		}).blur();
		$('[placeholder]').parents('form').submit(function() {
		  	$(this).find('[placeholder]').each(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
			 		input.val('');
				}
		  	})
		});
	}

});


//credits https://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
jQuery.fn.putCursorAtEnd = function() {
	return this.each(function() {
    	// If this function exists...
    	if (this.setSelectionRange) {
      		// ... then use it (Doesn't work in IE)
      		// Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
      		var len = $(this).val().length * 2;
      		this.setSelectionRange(len, len);
    	} else {
    		// ... otherwise replace the contents with itself
    		// (Doesn't work in Google Chrome)
      		$(this).val($(this).val());
    	}
	});
};

function signUp() {   
    let xhr = new XMLHttpRequest(); //Used for sending and receiving requests
    var formElement = document.querySelector("cd-form");
    var un = document.getElementById("signup-username").value;
    var pw = document.getElementById("signup-password").value;
    var user = {
        username:un,
        password:pw
    }
    xhr.onreadystatechange = function(){
        if(this.readyState === XMLHttpRequest.DONE){
            console.log(xhr.responseText);
        }
    }
    xhr.open("PUT", apiBaseUrl + "/users")
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.send(JSON.stringify(user)) 
}

function signin() {   
    let xhr = new XMLHttpRequest(); //Used for sending and receiving requests
    var un = document.getElementById("signin-username").value;
    var pw = document.getElementById("signin-password").value;
    var user = {
        username:un,
        password:pw
    }
    xhr.onreadystatechange = function(){
        if(this.readyState === XMLHttpRequest.DONE){
            console.log(xhr.responseText);
        }
    }
    xhr.open("POST", apiBaseUrl + "/users")
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.send(JSON.stringify(user)) 
}