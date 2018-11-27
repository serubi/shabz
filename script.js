var lockButton = document.getElementById("lockControlButton");
var lockIcon = document.getElementById("lockStatus");
var lockStatusCookie = getCookie("lockStatus");

if(lockStatusCookie == "unlocked") {
  toggleLockInterface();
}

if (!!lockButton) {
  lockButton.addEventListener("click", function() {
    toggleLockInterface();

    if(lockStatusCookie == "locked") {
      lockStatusCookie = "unlocked";
      setCookie("lockStatus", "unlocked", 1);
      console.log("unlocking...");
    } else {
      lockStatusCookie = "locked";
      setCookie("lockStatus", "locked", 1);
      console.log("locking...");
    }
  });
}

function toggleLockInterface() {
  if(!!lockButton) {
    lockButton.querySelector("i.fas").classList.toggle("fa-lock");
    lockButton.querySelector("i.fas").classList.toggle("fa-unlock");
    lockButton.classList.toggle("unlocked");
  }

  if(!!lockIcon)
    lockIcon.setAttribute('data-status', lockIcon.getAttribute("data-status") == "locked" ? "unlocked" : "locked");
}

function getCookie(cookieName) {
  var name = cookieName + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cookieName, cookieValue, expiryDays) {
  var d = new Date();
  d.setTime(d.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  //console.log(profile);
  if(profile.getEmail() != null)
    window.location.href = "./index.html";
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    window.location.href = "./login.html";
  });
}

function isSignedIn() {
  var auth2 = gapi.auth2.getAuthInstance();
  console.log(auth2.isSignedIn.get());
}

function onLoad() {
  gapi.load('auth2', function () {
    auth2 = gapi.auth2.init().then(() => {
      if(!gapi.auth2.getAuthInstance().isSignedIn.get())
        window.location.href = "./login.html";
      console.log("logged in: " + gapi.auth2.getAuthInstance().isSignedIn.get());
      //console.log(gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail());
    });
  });
}

function initLogin() {
  document.getElementById("googleSignin").querySelector(".abcRioButtonContentWrapper").click();
}