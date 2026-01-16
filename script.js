
//Utilitary functions

function setCookie(cname, val, exdays = 365) {
  // stringify value to json to keep objects
  cvalue = JSON.stringify(val)
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      // auto json parse everything
      return JSON.parse(c.substring(name.length, c.length));
    }
  }
  return "";
}

function deleteCookie(name){
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  checkForCookies()
}

//DOM declarations

cookieInfo = document.getElementById("cookieinfo")
devTools = document.getElementById("devtools")
editName = document.getElementById("name")
editEmail = document.getElementById("email")
editPhone = document.getElementById("phone")
editDescription = document.getElementById("description")
editSkills = document.getElementById("skills")

//Other variable declaration

let content = {
  name: "",
  email: "",
  phone: "",
  description: "",
  skills: ""
}

//Code

function copyCode(){}

function checkForCookies(){
  if (document.cookie != ""){
    cookieInfo.innerHTML = "Cookies are stored.<br>"
    cookieInfo.innerHTML += document.cookie
    document.getElementById("deletecookies").style.display = "block"
    return true
  } else {
    cookieInfo.innerHTML = "No cookies stored."
    document.getElementById("deletecookies").style.display = "none"
    return false
  }
}

function toggleEdit(){
  toggle = document.getElementById("edit")
  if (toggle.style.display == "none") {
    toggle.style.display = "block"
  } else {
    toggle.style.display = "none"
  }
}

function toggleDevTools(){
  if (devTools.style.display == "none"){
    devTools.style.display = "block"
  } else {
    devTools.style.display = "none"
  }
}

function save(){
  setCookie("content", content)
  checkForCookies()
}

function generate(){
  for (let key in content){
    content[key] = document.getElementById(key).value
    document.getElementById("view" + key).innerHTML = content[key]
  }
  console.log(content)
}

//auto generation of the view

document.addEventListener('keypress', function(event) {
    console.log('Key pressed: ' + event.key);
    generate()
});

function loadData(){
  content = getCookie('content')
  console.log("accessing data in the cookie and putting it in content Object")
  console.log(content)
  for (let key in content){
    document.getElementById(key).value = content[key]
  }
}

function applyContentToView(){}

if (checkForCookies()){
  loadData()
}