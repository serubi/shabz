var lockButton = document.getElementById("lockControlButton");
var lockIcon = document.getElementById("lockStatus");
var lockStatusCookie = getCookie("lockStatus");

lockButton.addEventListener("click", function() {
  lockButton.querySelector("i.fas").classList.toggle("fa-lock");
  lockButton.querySelector("i.fas").classList.toggle("fa-unlock");
  lockButton.classList.toggle("unlocked");

  lockStatus.setAttribute('data-status', lockStatus.getAttribute("data-status") == "locked" ? "unlocked" : "locked");

  if(lockStatusCookie == "locked") {
    setCookie("lockStatus", "unlocked", 1);
  } else {
    document.cookie = "username=John Doe; expires=Thu, 18 Dec 2019 12:00:00 UTC; path=/";
    setCookie("lockStatus", "locked", 1);
  }
});

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