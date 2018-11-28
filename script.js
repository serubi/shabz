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
  if(profile.getEmail() != null)
    window.location.href = "./index.html";
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    // Notify console
    console.log('User signed out.');

    // Remove lockStatus cookie
    setCookie("lockStatus", "removed", -1);

    // Remove user info cookies
    setCookie("googleProfilePicture", "removed", -1);
    setCookie("googleUserName", "removed", -1);
    setCookie("userName", "removed", -1);

    // Redirect to login page
    window.location.href = "./login.html";
  });
}

function isSignedIn() {
  var auth2 = gapi.auth2.getAuthInstance();
  return auth2.isSignedIn.get();
}

function onLoad() {
  gapi.load('auth2', function () {
    auth2 = gapi.auth2.init().then(() => {
      if(!isSignedIn())
        window.location.href = "./login.html";

      console.log("logged in: " + isSignedIn());

      var profilePicture = getCookie("googleProfilePicture");
      if (!!profilePicture) {
        if (profilePicture != gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getImageUrl()) {
          document.querySelector(".profilePicture").setAttribute("style", 'background-image: url(' + gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getImageUrl() + ');');
          setCookie("googleProfilePicture", gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getImageUrl(), 1);
        }      
      } else {
        document.querySelector(".profilePicture").setAttribute("style", 'background-image: url(' + gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getImageUrl() + ');');
        setCookie("googleProfilePicture", gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getImageUrl(), 1);
      }

      var userName = getCookie("googleUserName");
      if (!!userName) {
        if (userName != gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName()) {
          document.getElementById("userName").innerText = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName();
          setCookie("googleUserName", gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName(), 1);
        }
      } else {
        document.getElementById("userName").innerText = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName();
        setCookie("googleUserName", gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName(), 1);
      }

      var userEmail = getCookie("googleEmail");
      if (!!userEmail) {
        if (userEmail != gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail()) {
          document.getElementById("userEmail").innerText = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
          setCookie("googleEmail", gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail(), 1);
        }
      } else {
        document.getElementById("userEmail").innerText = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
        setCookie("googleEmail", gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail(), 1);
      }

      //console.log(gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail());
    });
  });
}

function loadUserInfoFromCookies() {
  var profilePicture = getCookie("googleProfilePicture");
  var profilePictureElement = document.querySelector(".profilePicture");
  if (!!profilePicture && !!profilePictureElement) {
    profilePictureElement.setAttribute("style", 'background-image: url(' + profilePicture + ');');
  }

  var userName = getCookie("googleUserName");
  var userNameElement = document.getElementById("userName");
  if (!!userName && !!userNameElement) {
    userNameElement.innerText = userName;
  }

  var userEmail = getCookie("googleEmail");
  var userEmailElemenet = document.getElementById("userEmail");
  if (!!userEmail && !!userEmailElemenet) {
    userEmailElemenet.innerText = userEmail;
  }
}

// on ready
document.addEventListener('DOMContentLoaded', function () {
  // load user info
  loadUserInfoFromCookies();
}, false);