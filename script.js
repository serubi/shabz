var lockButton = document.getElementById("lockControlButton");
var lockIcon = document.getElementById("lockStatus");

lockButton.addEventListener("click", function() {
  lockButton.querySelector("i.fas").classList.toggle("fa-lock");
  lockButton.querySelector("i.fas").classList.toggle("fa-unlock");
  lockButton.classList.toggle("unlocked");

  lockStatus.setAttribute('data-status', lockStatus.getAttribute("data-status") == "locked" ? "unlocked" : "locked");

});