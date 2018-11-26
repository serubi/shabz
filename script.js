var lockButton = document.getElementById("lockControlButton");

lockButton.addEventListener("click", function() {
  lockButton.querySelector("i.fas").classList.toggle("fa-lock");
  lockButton.querySelector("i.fas").classList.toggle("fa-unlock");
  lockButton.classList.toggle("unlocked");
});