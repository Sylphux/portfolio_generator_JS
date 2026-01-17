
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
  checkUnsaved()
}

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

function removeAllChilds(e){
  while (e.hasChildNodes()){
    e.removeChild(e.firstChild)
  }
}

//DOM declarations

cookieInfo = document.getElementById("cookieinfo")
devTools = document.getElementById("devtools")

//Other variable declaration

let content = {
  name: "",
  job: "",
  email: "",
  phone: "",
  description: "",
  skills: "",
  experiences: []
}

//Options functions

function switchTheme(){
  console.log("Switching view theme : To develop")
}

function copyCode(){
  console.log("Copying view code to clipboard : To develop")
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
  setCookie("content", content) // saves data to cookie
  checkForCookies() // changes the "no cookie saved" mention
  generate(false)
  checkUnsaved()
}

//Main functions

function doSkillsList(){ // generates the skills list ul from a string with commas
  content.skills = document.getElementById("skills").value
  let skillsArr = content.skills.split(",")
  let myList = document.getElementById("skillsul")
  removeAllChilds(myList)
  for (let i in skillsArr){
    let skill = skillsArr[i]
    const askill = document.createElement("li")
    askill.innerText = skill
    myList.appendChild(askill)
  }
}

//Generate the view portofolio from data
function generate(savecheck = true){
  for (let key in content){
    // Different treatments go here
    if (key == "skills"){
      doSkillsList()
      continue
    }
    if (key == "experiences"){continue}
    // 
    content[key] = document.getElementById(key).value
    document.getElementById("view" + key).innerHTML = content[key]
  }
  if (savecheck === true){checkUnsaved()} // by default checks for unsaved changes
}

function checkUnsaved(){
  p = document.getElementById("newchanges")
  if (JSON.stringify(content) != JSON.stringify(getCookie('content'))){
    p.innerHTML = "There are new changes to save."
    p.style.color = "red"
    console.log("Some content not saved")
  } else {
    console.log("All content is saved.")
    p.innerHTML = "No changes to save."
    p.style.color = "black"
  }
}

function loadData(){
  content = getCookie('content')
  for (let key in content){
    // put here ifs for cases where key is not a string and continue loop
    if (key == "experiences"){continue}
    //
    document.getElementById(key).value = content[key]
  }
  generate()
}

// Script to execute

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    console.log("(ctrl+Enter)")
    generate();
  }
});

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    console.log("(ctrl+s)")
    save();
  }
});

if (checkForCookies()){
  loadData()
}