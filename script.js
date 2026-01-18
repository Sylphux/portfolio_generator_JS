//Cookies functions

function setCookie(cname, val, exdays = 365) { // auto stringify to keep objects in cookie
  cvalue = JSON.stringify(val)
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) { // auto parse to retrieve objects from cookie
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
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
  let cookieInfo = document.getElementById("cookieinfo")
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

// General functions

function removeAllChilds(e, i = 0){ // i is from which children all is removed
  while (e.children.length > i){
    e.removeChild(e.children[0 + i])
  }
}

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
  let devTools = document.getElementById("devtools")
  if (devTools.style.display == "none" || devTools.style.display == ""){
    devTools.style.display = "block"
  } else {
    devTools.style.display = "none"
  }
}

function toggleFullscreen(){
  toggleEdit()
  let header = document.getElementById("header")
  let view = document.getElementById("view")
  let cssContent = document.getElementById("content")
  if (header.style.display == "block" || header.style.display == ""){
    header.style.display = "none"
    view.style.backgroundColor = "white"
    cssContent.style.backgroundColor = "white"
  } else {
    header.style.display = "block"
    view.style.backgroundColor = "rgb(213, 233, 233)";
    cssContent.style.backgroundColor = "rgb(247, 247, 247)";
  }
  console.log("Fullscreen mode. Press ctrl+e to quit")
}

function save(){
  generate(false) 
  setCookie("content", content) 
  checkForCookies()
  checkUnsaved()
}

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

function addExperienceRender(setID = undefined){
  let template = document.getElementById("viewexperience_0")
  let newExperience = template.cloneNode(true)
  if (setID === undefined){
    newExperience.id = "viewexperience_" + document.getElementById("viewexperiences").children.length
  } else {
    newExperience.id = setID
  }
  document.getElementById("viewexperiences").appendChild(newExperience)
  renderExperience(newExperience)
}

function renderExperience(domExp, values = ["", "", "", "", ""]){
  domExp.children[0].innerHTML = values[0] // name
  domExp.children[1].innerHTML = values[1] + " | " + "<small>" + values[2] + " - " + values[3] + "</small>" // place, start, end
  domExp.children[2].innerHTML = values[4] // description
}

function doExperiencesList(){ //only writes in content var for now. Not showing on view side.
  removeAllChilds(document.getElementById("viewexperiences"), 1)
  let allExperiences = document.getElementById("experiences_list").children
  for (let i = 0; i < allExperiences.length; i++){
    // write in RAM (content object)
    content.experiences[i] = [
    allExperiences[i].children[0].value, // name
    allExperiences[i].children[1].value, // place
    allExperiences[i].children[2].children[0].value, // start 
    allExperiences[i].children[2].children[1].value, // end
    allExperiences[i].children[3].value] // description
    // render on view
    console.log(content.experiences[i])
    if (JSON.stringify(content.experiences[i]) != JSON.stringify([ "", "", "", "", "" ])){
      if (i != 0){addExperienceRender()}
      renderExperience(document.getElementById(("viewexperience_" + i)), content.experiences[i])
    }
  }
}

function generate(savecheck = true){ // This function both renders the content AND saves it to the RAM
  for (let key in content){
    if (key == "skills"){
      doSkillsList()
      continue
    }
    if (key == "experiences"){
      doExperiencesList()
      continue
    }
    content[key] = document.getElementById(key).value
    document.getElementById("view" + key).innerHTML = content[key]
  }
  console.log("Content generated.")
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

function assignDomExperienceContent(domExp, values = ["", "", "", "", ""]){
  domExp.children[0].value = values[0] // name
  domExp.children[1].value = values[1] // place
  domExp.children[2].children[0].value = values[2] //start
  domExp.children[2].children[1].value = values[3] // end
  domExp.children[3].value = values[4] // description
}

function addExperienceTemplate(setID = undefined){
  let template = document.getElementById("experience_0")
  let newExperience = template.cloneNode(true)
  if (setID === undefined){
    newExperience.id = "experience_" + document.getElementById("experiences_list").children.length
  } else {
    newExperience.id = setID
  }
  document.getElementById("experiences_list").appendChild(newExperience)
  assignDomExperienceContent(newExperience)
}

function loadExperiences(){
  for (let i in content.experiences){
    if (i != 0){addExperienceTemplate()}
    let exp = document.getElementById("experiences_list").children[i]
    assignDomExperienceContent(exp, content.experiences[i])
  }
} 

// the loadData function loads everything from the cookie on the edit side components, and then launches generate to render and save in ram.
function loadData(){
  content = getCookie('content') // loads cookie in ram
  for (let key in content){
    if (key == "experiences"){
      loadExperiences()
      continue
    }
    document.getElementById(key).value = content[key]
  }
  console.log("Data loaded from cookie.")
  generate()
}

// RUNNING CODE

let content = {
  name: "",
  job: "",
  email: "",
  phone: "",
  description: "",
  skills: "",
  experiences: []
}

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

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'e') {
    e.preventDefault();
    console.log("(ctrl+e)")
    toggleFullscreen();
  }
});

if (checkForCookies()){
  loadData()
} else {console.log("No cookie to load. All set.")}