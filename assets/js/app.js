var hdServerUrl = /localhost/.test(window.location.host) ?
  'http://localhost:5000/api/users' :
  'http://ec2-35-153-207-169.compute-1.amazonaws.com:5000/api/users';

function addUserToHD(user) {
  $.ajax({
    type: 'POST',
    url: hdServerUrl,
    data: user,
    dataType: 'json',
    error: function() {
      console.log('Could not connect to the registration server. Please try again later.');
    },
    success: function() {
      console.log('User added.');
    }
  });
}

function onGoogleSuccess(googleUser) {
  var profile = googleUser.getBasicProfile();
  var userProfile = {
    firstName: profile.getGivenName(),
    lastName: profile.getFamilyName(),
    email: profile.getEmail()
  };

  if (localStorage.getItem('email') !== userProfile.email) {
    localStorage.setItem('email', userProfile.email);
    addUserToHD(userProfile);
    var googleForm = $('#mc-embedded-subscribe-form.for-google');
    googleForm.find('#mce-EMAIL').val(userProfile.email);
    addUserToMailChimp(googleForm, true);
  }
}

function addUserToMailChimp($form, fromGoogleSignin) {
  var userData = $form.serialize();
  $.ajax({
    type: $form.attr('method'),
    url: $form.attr('action'),
    data: userData,
    cache: false,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    error: function() {
      showAlert('Could not connect to the registration server. Please try again later.');
    },
    success: function(data) {
      if (data.result !== 'success') {
        if (!fromGoogleSignin) {
          addUserToHD(userData);
        }
        showAlert('There was error in processing your request.');
      } else {
        showAlert(data.msg);
      }
    }
  });
}

function showAlert(message) {
  var snackbar = document.getElementById('snackbar');
  snackbar.className = 'show';
  snackbar.innerText = message;
  setTimeout(function() {
    snackbar.className = snackbar.className.replace('show', '');
  }, 3000);
}

$(document).ready(function() {
  console.log('testing upload');

  // ========================
  // For Fade-in effect
  // ========================

  $('html').removeClass('fade-out');

  // ===============
  // Homepage Layout
  // ===============

  // Add large-5 to second and third posts in homepage, so each one will be 50% width
  $('.home-template .post-card-wrap:nth-of-type(1), .home-template .post-card-wrap:nth-of-type(2)')
  .addClass('large-5');

  $('.home-template .post-card-wrap:nth-of-type(1) .post-card, .home-template .post-card-wrap:nth-of-type(2) .post-card');

  // ===============
  // Off Canvas menu
  // ===============

  $('.off-canvas-toggle').click(function(e) {
    e.preventDefault();
    $('.off-canvas-container').toggleClass('is-active');
  });

  if (/firefox/.test(navigator.userAgent.toLowerCase())) {
    $('.banner-subscribe').css('margin-top', '40%');
  }

  // ========================
  // Images Fade In
  // ========================

  $('.fadein').viewportChecker({
    classToAdd: 'inview', // Class to add to the elements when they are visible
    offset: 100,
    removeClassAfterAnimation: true
  });

  // =================
  // Responsive videos
  // =================

  $('.wrapper').fitVids();

  $("#rotatingText").Morphext({
    // The [in] animation type. Refer to Animate.css for a list of available animations.
    animation: "fadeIn",
    // An array of phrases to rotate are created based on this separator. Change it if you wish to separate the phrases differently (e.g. So Simple | Very Doge | Much Wow | Such Cool).
    separator: ",Testing, Text",
    // The delay between the changing of each phrase in milliseconds.
    speed: 2000,
    complete: function () {
        // Called after the entrance animation is executed.
    }
  });

  $('.banner-subscribe button.subscribe-button').click(function(event) {
    event.preventDefault();
    event.stopPropagation();

    var scrollTo = $('.signup-section').position().top;
    $('html, body').animate({ scrollTop: scrollTo }, 800);

    $('#mc_embed_signup #mce-EMAIL').focus();
  });

  $('#mc-embedded-subscribe-form').submit(function(event) {
    event.preventDefault();
    var $form = $(this);
    addUserToMailChimp($form);
    return false;
  });
});