
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
  generate(false)
  setCookie("content", content) // saves data to cookie
  checkForCookies() // changes the "no cookie saved" mention
  checkUnsaved() // changes the "no cookie saved" mention
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

function doExperiencesList(){ //only writes in content var for now. Not showing on view side.
  let allExperiences = document.getElementById("experiences_list").children
  for (let i = 0; i < allExperiences.length; i++){
    let exp = allExperiences[i] // exp is my Node which i will save in the var content
    let name = exp.children[0].value;
    let place = exp.children[1].value;
    let start = exp.children[2].children[0].value;
    let end = exp.children[2].children[1].value;
    let description = exp.children[3].value;
    content.experiences[i] = [name, place, start, end, description]
  }
}

function generate(savecheck = true){
  for (let key in content){
    if (key == "skills"){
      doSkillsList()
      continue
    }
    if (key == "experiences"){
      doExperiencesList()
      continue
    }
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
  for (let i = 1; i < content.experiences.length; i++){
    addExperienceTemplate()
  }
  let allDomExperiences = document.getElementById("experiences_list").children
  for (let i in content.experiences){
    let exp = allDomExperiences[i]
    assignDomExperienceContent(exp, content.experiences[i])
  }
} 

function loadData(){

  content = getCookie('content')
  console.log("Experiences loaded : " + JSON.stringify(content.experiences))

  for (let key in content){
    if (key == "experiences"){ // create enough edit divs for the experiences
      loadExperiences()
      continue
    }
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
} else {console.log("No cookie to load. All set.")}