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
let verifyLockBtn: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById("verifyLockBtn");
let accessCode: HTMLInputElement = <HTMLInputElement>document.getElementById("accessCode");
let lockName: HTMLInputElement = <HTMLInputElement>document.getElementById("lockName");
let lock: Promise<ILock>;

function getDate(): string {
  let today = new Date();
  return today.toDateString() + " " + today.toLocaleTimeString('en-GB');
}
(<any>window).getDate = getDate;

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

let userName : string = "";

async function GetAccount(id: number) {
  try {
   return await axios.get<IAccount>(uri + "account/" + id).then(function (response: AxiosResponse<IAccount>) {
      return response.data;
    })
  } catch (error) {
    
  }
}

async function GetAccountFromEmail(email: string) {
  try {
    return await axios.get<IAccount>(uri + "account/" + email).then(function (response: AxiosResponse<IAccount>) {
      return response.data;
    })
  } catch (error) {

  }
}

async function GetAllRoles() {
  try {
    return await axios.get<Array<IRole>>(uri + "role/").then(function (response: AxiosResponse<Array<IRole>>) {
      return response.data;
    })
  } catch (error) {

  }
}

async function GetRole(id: number) {
  try {
    return await axios.get<IRole>(uri + "role/" + id).then(function (response: AxiosResponse<IRole>) {
      return response.data;
    })
  } catch (error) {

  }
}

async function AddAccount(account: IAccount) {
  try {
    return await axios.post<IAccount>(uri + "account/", account).then(function (response: AxiosResponse) {
      return response.status;
    })
  } catch (error) {

  }
}

async function AddLockAccount(lockAccount: ILockAccount) {
  try {
    return await axios.post<ILockAccount>(uri + "lock_account/", lockAccount).then(function (response: AxiosResponse) {
      return response.status;
    })
  } catch (error) {

  }
}

async function GetLock(id: number) {
  try {
    return await axios.get<ILock>(uri + "lock/" + id).then(function (response: AxiosResponse<ILock>) {
      return response.data;
    })
  } catch (error) {

  }
}

async function GetAllLocks() {
  try {
    return await axios.get<Array<ILock>>(uri + "lock/").then(function (response: AxiosResponse<Array<ILock>>) {
      return response.data;
    })
  } catch (error) {

  }
}

async function GetAllLockAccounts() {
  try {
    return await axios.get<Array<ILockAccount>>(uri + "lock_account/").then(function (response: AxiosResponse<Array<ILockAccount>>) {
      return response.data;
    })
  } catch (error) {

  }
}

async function GetLockFromAccessCode(accessCode: string) {
  try {
    return await axios.get<ILock>(uri + "lock/" + accessCode).then(function (response: AxiosResponse<ILock>) {
      return response.data;
    })
  } catch (error) {

  }
}

async function UpdateLock(lock: ILock) {
  try {
    return await axios.put<ILock>(uri + "lock/" + lock.id, lock).then(function (response: AxiosResponse) {
      return response.status;
    })
  } catch (error) {

  }
}

function GetAllLogs(): void {
  axios.get<ILog[]>(uri + "log")
    .then(function (response: AxiosResponse<ILog[]>): void {
      response.data.forEach((log: ILog) => {
        let li: HTMLLIElement = <HTMLLIElement>document.createElement("LI");
        GetAccount(log.accountId).then(function(result : IAccount){
          li.innerHTML = result.name;
          let span: HTMLSpanElement = <HTMLSpanElement>document.createElement("SPAN");
          span.innerHTML = log.date.toString();
          li.appendChild(span);
          let p: HTMLParagraphElement = <HTMLParagraphElement>document.createElement("P");
          p.innerHTML = log.status.toString();
          if (p.innerHTML == "true") {
            p.classList.add("locked")
            p.innerHTML = "Locked";
          }
          else{
            p.innerHTML = "Unlocked";
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

if (!!clearLogBtn) {
  clearLogBtn.addEventListener("click", function () {
    if (confirm("Er du sikker på at du vil slette hele loggen?")) {
      logOutput.classList.add("fadeClearUl");
      window.setTimeout(function () {
        axios.delete(uri + "log/")
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
  logOutput.innerHTML = "";
  axios.get<ILog[]>(uri + "log")
    .then(function (response: AxiosResponse<ILog[]>): void {
      response.data.forEach((log: ILog) => { 
        let li: HTMLLIElement = <HTMLLIElement>document.createElement("LI");
        GetAccount(log.accountId).then(function(result : IAccount){
          if(searchInput.value == result.name){
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
          }
        });
      });
    })
    .catch(function (error: AxiosError): void {
      GetAllLogs();
    });
}

let searchInput: HTMLInputElement = <HTMLInputElement>document.getElementById("LogSearch");

if (!!searchInput) {
  GetAllLogs();
  searchInput.addEventListener("textchanged", function (e) {
    GetSearchedLogs(searchInput.value);
  });
}

var lockIcon = document.getElementById("lockStatus");
var lockStatusCookie = getCookie("lockStatus");

if (lockStatusCookie == "unlocked" && getLocalLockStatus()) {
  toggleLockInterface();
}

if (!!lockButton) {
  lockButton.addEventListener("click", function () {
    toggleLock();
  });
}

function toggleLock() {
  toggleLockInterface();

  if (!!logOutput) {
    CreateLog();
  }

  let account: Promise<IAccount> = GetAccountFromEmail(getEmail());
  account.then((accountResponse) => {
    let accountPrimaryLock: Promise<ILock> = GetLock(accountResponse.primaryLockId);
    accountPrimaryLock.then((lockResponse) => {
      let editLock = lockResponse;

      editLock.status = getLocalLockStatus();
      axios.post<ILog>(uri + "log", { accountId: accountResponse.id, date: getDate(), status: getLocalLockStatus() });

      let updateLock = UpdateLock(editLock);
      updateLock.then((updateLockResponse) => {
        if(updateLockResponse == 200) {
          // Lock was updated successfully
          if (lockStatusCookie == "locked") {
            lockStatusCookie = "unlocked";
            setCookie("lockStatus", "unlocked", 1);
            console.log("unlocking...");
          } else {
            lockStatusCookie = "locked";
            setCookie("lockStatus", "locked", 1);
            console.log("locking...");
          }
        }
      });

    });
  });
}
(<any>window).toggleLock = toggleLock;

function getLocalLockStatus():boolean {
  if (!!lockButton) {
    if (lockButton.classList.contains("unlocked")) {
      return false;
    } else {
      return true;
    }
  }
  return false;
}
(<any>window).getLocalLockStatus = getLocalLockStatus;

function toggleLockInterface() {
  if (!!lockButton) {
    lockButton.querySelector("i.fas").classList.toggle("fa-lock");
    lockButton.querySelector("i.fas").classList.toggle("fa-unlock");
    lockButton.classList.toggle("unlocked");
  }

  if (!!lockIcon)
    lockIcon.setAttribute('data-status', lockIcon.getAttribute("data-status") == "locked" ? "unlocked" : "locked");

  let lockedStatusText: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById('lockedStatusText');
  if (!!lockedStatusText) {
    if (getLocalLockStatus()) {
      lockedStatusText.innerText = "Låst";
    } else {
      lockedStatusText.innerText = "Ulåst";
    }
  }
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
  if (!!profile && profile.getEmail() != null) {
    
    let account:Promise<IAccount> = GetAccountFromEmail(profile.getEmail());

    account.then((response) => {
      if(response.id != null && response.id > 0) {
        // Get the account's primary lock
        let accountPrimaryLock:Promise<ILock> = GetLock(response.primaryLockId);
        accountPrimaryLock.then((lockResponse) => {
          // Set the lockStatus cookie based on the lock's status in the database
          if(lockResponse.status) {
            lockStatusCookie = "locked";
            setCookie("lockStatus", "locked", 1);
          } else {
            lockStatusCookie = "unlocked";
            setCookie("lockStatus", "unlocked", 1);
          }
        }).then(() => {
          // Then redirect to the main page
          window.location.href = "./index.html";
        });
      } else {
        alert("Fejl ved login - brugeren findes ikke");
        signOut();
      }
    });
  }
}
(<any>window).onSignIn = onSignIn;

function onFirstSignIn(googleUser: any) {
  var profile = googleUser.getBasicProfile();
  if (!!profile && profile.getEmail() != null) {

    if (!!lockName && !!lock && !!accessCode) {
      lock.then((lockResponse) => {

        if(lockResponse.dateRegistered != null) {
          alert("Denne Shabz Smart Lock er allerede registreret");
          return;
        }

        let shouldContinue: boolean = false;
        let accountId: number;

        let existingAccount: Promise<IAccount> = GetAccountFromEmail(profile.getEmail());
        existingAccount.then((existingAccountResponse) => {
          if (!!existingAccountResponse && existingAccountResponse.id > 0) {
            shouldContinue = true;
            accountId = existingAccountResponse.id;
          } else {
            shouldContinue = false;
          }
        }).then(() => {
          if (!shouldContinue) {
            let newAccount: IAccount = ({ id: 0, email: profile.getEmail(), name: profile.getName(), primaryLockId: lockResponse.id });
            let newAccountResponse = AddAccount(newAccount);
            newAccountResponse.then((postResponse) => {
              if (postResponse == 200) {
                // Account blev tilføjet
                shouldContinue = true;
                accountId = newAccount.id;
              }
            });
          }
        }).then(() => {
          if (shouldContinue) {
            let updatedLock: ILock = ({ id: lockResponse.id, name: lockName.value, status: lockResponse.status, accessCode: lockResponse.accessCode, dateRegistered: getDate() });
            let updatedLockResponse = UpdateLock(updatedLock);
            updatedLockResponse.then((putResponse) => {
              if (putResponse == 200) {
                // Lock blev opdateret
                let allRoles: Promise<Array<IRole>> = GetAllRoles();
                let roleId:number = 0;

                allRoles.then((roleResponse) => {
                  roleResponse.forEach((role) => {
                    // Find the admin role (accessLevel 10)
                    if(role.accessLevel == 10) {
                      roleId = role.id;
                    }
                  });
                }).then(() => {
                  if(roleId > 0) {
                    let newLockAccount: ILockAccount = ({ id: 0, lockId: lockResponse.id, roleId: roleId, accountId: accountId});
                    console.log(newLockAccount);
                    let newLockAccountResponse = AddLockAccount(newLockAccount);
                    newLockAccountResponse.then((LockAccountResponse) => {
                      if(LockAccountResponse == 200) {
                        // Lock Account was added successfully

                        // Set the lockStatus cookie based on the lock's status in the database
                        if (lockResponse.status) {
                          lockStatusCookie = "locked";
                          setCookie("lockStatus", "locked", 1);
                        } else {
                          lockStatusCookie = "unlocked";
                          setCookie("lockStatus", "unlocked", 1);
                        }
                        
                        alert("\"" + lockResponse.name + "\" er nu klar til brug!");
                        window.location.href = "./index.html";
                      }
                    });
                  }
                });
              }
            });
          }
        });

      });

    }

  }
}
(<any>window).onFirstSignIn = onFirstSignIn;

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

if (!!verifyLockBtn) {
  verifyLockBtn.addEventListener('click', function() {
    let lockAccessCodeView: HTMLDivElement = <HTMLDivElement>document.getElementById("view1");

    if (!!accessCode) {
      if(accessCode.value.length == 7) {
        
        lock = GetLockFromAccessCode(accessCode.value);

        lock.then((lockResponse) => {
          if (!!lockResponse && lockResponse.id > 0) {

            if (lockResponse.dateRegistered != null) {
              alert("Fejl - Denne Shabz Smart Lock er allerede registreret");
              return;
            }

            let lockNameView: HTMLDivElement = <HTMLDivElement>document.getElementById("view2");
            let lockGoogleView: HTMLDivElement = <HTMLDivElement>document.getElementById("view3");

            if(!!lockAccessCodeView && !!lockNameView && !!lockName) {
              lockAccessCodeView.classList.add('hidden');
              lockName.value = lockResponse.name;
              lockNameView.classList.remove('hidden');

              let nameLockBtn: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById("nameLockBtn");
              nameLockBtn.addEventListener('click', function() {
                lockNameView.classList.add('hidden');
                lockGoogleView.classList.remove('hidden');
              });

            } else {
              alert("Fejl");
            }

          } else {
            alert("Access code er ugyldig");
          }
        });

      } else {
        alert("Access code er ugyldig");
      }
    } else {
      alert("Ingen access code fundet");
    }

  });
}

let allUserLocksList: HTMLUListElement = <HTMLUListElement>document.getElementById('listOfLocks');
let allUserLocks: Promise<Array<ILockAccount>> = GetAllLockAccounts();
if (!!allUserLocksList) {
  allUserLocks.then((lockAccountResponse) => {
    let account:Promise<IAccount> = GetAccountFromEmail(getEmail());

    account.then((accountResponse) => {
      lockAccountResponse.forEach((lockAccount) => {
        if (lockAccount.accountId == accountResponse.id) {
          // Account owns Lock Account
          let lock:Promise<ILock> = GetLock(lockAccount.lockId);
          lock.then((lockResponse) => {
            allUserLocksList.innerHTML += '<li class="listButton"><a href="#"><i class="fas fa-lock"></i><span>' + lockResponse.name + '</span><i class="fas fa-chevron-right right"></i></a></li>';
          });
        }
      });
    });
  });
}

let allSharedLockAccountsList: HTMLUListElement = <HTMLUListElement>document.getElementById('listOfSharedLocksAccounts');
if (!!allSharedLockAccountsList) {
  getLockAccountsSharingSameLocks();
}

function getLockAccountsSharingSameLocks() {
  let loggedInAccountLocks: Array<number> = [];
  let allSharedLockAccounts: Array<ILockAccount> = [];
  allUserLocks.then((lockAccountResponse) => {
    let account: Promise<IAccount> = GetAccountFromEmail(getEmail());

    account.then((loggedInAccountResponse) => {
      lockAccountResponse.forEach((lockAccount) => {
        if (lockAccount.accountId == loggedInAccountResponse.id) {
          loggedInAccountLocks.push(lockAccount.lockId);
        }
      });
    }).then(() => {
      lockAccountResponse.forEach((lockAccount) => {
        loggedInAccountLocks.forEach((lockId) => {
          if (lockAccount.lockId == lockId) {
            allSharedLockAccounts.push(lockAccount);
          }
        })
      });
    }).then(() => {
      if (!!allSharedLockAccountsList) {
        let accountIdHistory:Array<number> = [];
        allSharedLockAccounts.forEach((lockAccount) => {
          let shouldContinue:boolean = true;
          accountIdHistory.forEach((accountId) => {
            if(lockAccount.accountId == accountId) {
              shouldContinue = false;
            }
          });

          if(shouldContinue) {
            accountIdHistory.push(lockAccount.accountId);
            let account: Promise<IAccount> = GetAccount(lockAccount.accountId);
            let role: Promise<IRole> = GetRole(lockAccount.roleId);
            account.then((accountResponse) => {
              role.then((roleResponse) => {
                allSharedLockAccountsList.innerHTML += '<li class="listButton"><a href="#"><i class="fas fa-' + roleResponse.icon + '"></i><span>' + accountResponse.email + '</span><i class="fas fa-chevron-right right"></i></a></li>';
              });
            });
          }
        });
      }
    })
  });  
}