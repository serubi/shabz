import axios, {
  AxiosResponse,
  AxiosError
} from "../../node_modules/axios/index";

import { ILog, IAccount, ILock, IRole, ILockAccount } from "./interfaces";

const uri: string = "https://shabzsmartlock.azurewebsites.net/api/";
//const uri: string = "https://localhost:44379/api/log";


let lockButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("lockControlButton");
let logOutput: HTMLUListElement = <HTMLUListElement>document.getElementById("log");
let clearLogBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("ClearLogBtn");
let signOutBtn: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById("signOutBtn");

function getDate(): string {
  let today = new Date();
  return today.toDateString() + " " + today.toLocaleTimeString('en-GB');
}

function CreateLog() {
  let li: HTMLLIElement = <HTMLLIElement>document.createElement("LI");
  li.innerHTML = getName();
  let span: HTMLSpanElement = <HTMLSpanElement>document.createElement("SPAN");
  let todayOutput: string = <string>"";

  span.innerHTML = getDate();
  li.appendChild(span);
  let p: HTMLParagraphElement = <HTMLParagraphElement>document.createElement("P");
  if (lockButton.classList.contains("unlocked")) {
    p.innerHTML = "Locked";
    p.classList.add("locked");
  }
  else {
    p.innerHTML = "Unlocked";
  }
  li.appendChild(p);
  logOutput.appendChild(li);
  logOutput.className = "slideUl";
  li.className = "fadeLi";
  window.setTimeout(function () {
    logOutput.className = "";
  }, 500);
}

// async function GetUser(id: number): Promise<IUser> {
//   return axios.get<Promise<IUser>>(uri + "user/" + id).then(function (response: AxiosResponse<Promise<IUser>>) {
//      return response.data;
//   })
//   .catch(function (error: AxiosError): void {

//   })
  
// }

let userName : string = "";

async function GetUser(id: number) {
  try {
   return await axios.get<IAccount>(uri + "account/" + id).then(function (response: AxiosResponse<IAccount>) {
      return response.data;
    })
  } catch (error) {
    
  }
}

function GetAllLogs(): void {
  axios.get<ILog[]>(uri + "log")
    .then(function (response: AxiosResponse<ILog[]>): void {
      response.data.forEach((log: ILog) => {
        let li: HTMLLIElement = <HTMLLIElement>document.createElement("LI");
        GetUser(log.userId).then(function(result : IAccount){
          li.innerHTML = result.name;
          let span: HTMLSpanElement = <HTMLSpanElement>document.createElement("SPAN");
          span.innerHTML = log.date.toString();
          li.appendChild(span);
          let p: HTMLParagraphElement = <HTMLParagraphElement>document.createElement("P");
          p.innerHTML = log.status.toString();
          if (p.innerHTML == "Locked") {
            p.classList.add("locked")
          }
          li.appendChild(p);
          logOutput.appendChild(li);
          logOutput.className = "slideUl";
          li.className = "fadeLi";
          window.setTimeout(function () {
            logOutput.className = "";
          }, 500);
        });
      });
    })
    .catch(function (error: AxiosError): void {
      console.log(error.message)
    });
}

GetAllLogs();

if (!!clearLogBtn) {
  clearLogBtn.addEventListener("click", function () {
    if (confirm("Er du sikker på at du vil slette hele loggen?")) {
      logOutput.classList.add("fadeClearUl");
      window.setTimeout(function () {
        axios.delete(uri)
          .then(function (response: AxiosResponse<ILog>): void {
            logOutput.innerHTML = "";
          })
          .catch(function (error: AxiosError): void {

          });
      }, 500);
    }
  });
}

function GetSearchedLogs(input: string): void {
  // logOutput.innerHTML = "";
  // axios.get<ILog[]>(uri)
  //   .then(function (response: AxiosResponse<ILog[]>): void {
  //     response.data.forEach((log: ILog) => {
  //       if (GetUser(log.userId).name == input) {
  //         logOutput.innerHTML = "";
  //       }
  //       else {
  //         let li: HTMLLIElement = <HTMLLIElement>document.createElement("LI");
  //         li.innerHTML = GetUser(log.userId).name;
  //         let span: HTMLSpanElement = <HTMLSpanElement>document.createElement("SPAN");
  //         span.innerHTML = log.date;
  //         li.appendChild(span);
  //         let p: HTMLParagraphElement = <HTMLParagraphElement>document.createElement("P");
  //         p.innerHTML = log.status.toString();
  //         if (p.innerHTML == "Locked") {
  //           p.classList.add("locked")
  //         }
  //         li.appendChild(p);
  //         logOutput.appendChild(li);
  //         logOutput.className = "slideUl";
  //         li.className = "fadeLi";
  //         window.setTimeout(function () {
  //           logOutput.className = "";
  //         }, 500);
  //       }
  //       if (input.length == 0) {
  //         GetAllLogs();
  //       }
  //     });
  //   })
  //   .catch(function (error: AxiosError): void {

  //   });
}

let searchInput: HTMLInputElement = <HTMLInputElement>document.getElementById("LogSearch");

// searchInput.addEventListener("change", function (e: React.ChangeEvent<HTMLInputElement>) {
//     GetSearchedLogs(searchInput.value);
// });

var lockIcon = document.getElementById("lockStatus");
var lockStatusCookie = getCookie("lockStatus");

if (lockStatusCookie == "unlocked") {
  toggleLockInterface();
}

if (!!lockButton) {
  lockButton.addEventListener("click", function () {
    toggleLockInterface();

    if (!!logOutput) {
      CreateLog();
    }

    if (lockButton.classList.contains("unlocked")) {
      axios.post<ILog>(uri + "log", { userId: 1, date: getDate(), status: true })
    }
    else {
      axios.post<ILog>(uri + "log", { userId: 1, date: getDate(), status: false })
    }

    if (lockStatusCookie == "locked") {
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
  if (!!lockButton) {
    lockButton.querySelector("i.fas").classList.toggle("fa-lock");
    lockButton.querySelector("i.fas").classList.toggle("fa-unlock");
    lockButton.classList.toggle("unlocked");
  }

  if (!!lockIcon)
    lockIcon.setAttribute('data-status', lockIcon.getAttribute("data-status") == "locked" ? "unlocked" : "locked");
}

function getCookie(cookieName: string) {
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
(<any>window).getCookie = getCookie;

function setCookie(cookieName: string, cookieValue: string, expiryDays: number) {
  var d = new Date();
  d.setTime(d.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}
(<any>window).setCookie = setCookie;

function onSignIn(googleUser: any) {
  var profile = googleUser.getBasicProfile();
  if (profile.getEmail() != null)
    window.location.href = "./index.html";
}
(<any>window).onSignIn = onSignIn;

if (!!signOutBtn) {
  signOutBtn.addEventListener('click', function () {
    signOut();
  });
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
(<any>window).signOut = signOut;

function isSignedIn() {
  return gapi.auth2.getAuthInstance().isSignedIn.get();
}

function getName() {
  let userName: string = getCookie("googleUserName");

  if (!!userName)
    return userName;

  return gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName();
}

function getEmail() {
  let userEmail: string = getCookie("googleEmail");

  if (!!userEmail)
    return userEmail;

  return gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
}

function getImageUrl() {
  let userProfilePicture: string = getCookie("googleProfilePicture");

  if (!!userProfilePicture)
    return userProfilePicture;

  return gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getImageUrl();
}

function onLoad() {
  gapi.load('auth2', function () {
    auth2: gapi.auth2.GoogleAuth = gapi.auth2.init({ client_id: '905484329544-kusro715md9u17io64laq82a0hn4399n.apps.googleusercontent.com' }).then(() => {

      if (isSignedIn()) {
        // If user is logged in
        var profilePicture = getCookie("googleProfilePicture");
        if (!!profilePicture) {
          if (profilePicture != getImageUrl()) {
            !!document.querySelector(".profilePicture") ? document.querySelector(".profilePicture").setAttribute("style", 'background-image: url(' + getImageUrl() + ');') : {};
            setCookie("googleProfilePicture", getImageUrl(), 1);
          }
        } else {
          !!document.querySelector(".profilePicture") ? document.querySelector(".profilePicture").setAttribute("style", 'background-image: url(' + getImageUrl() + ');') : {};
          setCookie("googleProfilePicture", getImageUrl(), 1);
        }

        var userName = getCookie("googleUserName");
        if (!!userName) {
          if (userName != getName()) {
            !!document.getElementById("userName") ? document.getElementById("userName").innerText = getName() : {};
            setCookie("googleUserName", getName(), 1);
          }
        } else {
          !!document.getElementById("userName") ? document.getElementById("userName").innerText = getName() : {};
          setCookie("googleUserName", getName(), 1);
        }

        var userEmail = getCookie("googleEmail");
        if (!!userEmail) {
          if (userEmail != getEmail()) {
            !!document.getElementById("userEmail") ? document.getElementById("userEmail").innerText = getEmail() : {};
            setCookie("googleEmail", getEmail(), 1);
          }
        } else {
          !!document.getElementById("userEmail") ? document.getElementById("userEmail").innerText = getEmail() : {};
          setCookie("googleEmail", getEmail(), 1);
        }

        //console.log(gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail());
      } else {
        // If user is not logged in
        window.location.href = "./login.html";
      }

    });
  });
}
(<any>window).onLoad = onLoad;

function initLogin() {
  let googleSigninBtnt: HTMLElement = document.getElementById("googleSignin").querySelector(".abcRioButtonContentWrapper") as HTMLElement;
  googleSigninBtnt.click();
}
(<any>window).initLogin = initLogin;

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

if (!!document.querySelector(".listButtonsCheck")) {
  let checkButtonLists: NodeListOf<HTMLUListElement> = <NodeListOf<HTMLUListElement>>document.querySelectorAll(".listButtonsCheck");

  checkButtonLists.forEach((ul) => {
    let checkButtons: NodeListOf<HTMLLIElement> = <NodeListOf<HTMLLIElement>>document.querySelectorAll(".listButton");

    checkButtons.forEach((button) => {
      button.addEventListener('click', function() {
        let icon = this.querySelector('a i.right');
        //console.log(icon.classList[0]); // far
        //console.log(icon.classList[1]); // fa-square
        if(button.getAttribute("data-checked") == "false") {
          icon.setAttribute("class", "fas fa-check-square " + icon.classList[2]);
          button.setAttribute("data-checked", "true");
        } else {
          icon.setAttribute("class", "far fa-square " + icon.classList[2]);
          button.setAttribute("data-checked", "false");
        }
      });
    });
  });
}