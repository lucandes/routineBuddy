/* HTML LINKS */
const blackScreen = document.querySelector("#black_screen");
const avaliableElem = document.querySelector("#avaliable span");
const occupiedElem = document.querySelector("#occupied span");
const categoryIconList = ["fa-clock", "fa-book", "fa-bed", "fa-gamepad", "fa-clipboard-question"];
const colorPickerList = ["#9cc51f", "#ffa500", "#4c4e81", "#1fc5bd", "#ff00f8"];
// activity settings window
const window_ACTVSET = document.querySelector("#activity_settings");
const name_ACTVSET = document.querySelector("#activity_settings #name");
const start_ACTVSET = document.querySelector("#activity_settings #start");
const end_ACTVSET = document.querySelector("#activity_settings #end");
const categorySelector = document.querySelector("#activity_settings #category #selector");
const categoryItems = document.querySelectorAll("#activity_settings #category .item");
const cancelButton_ACTVSET = document.querySelector("#activity_settings #cancel");
const addButton_ACTVSET = document.querySelector("#activity_settings #add");
const editButton_ACTVSET = document.querySelector("#activity_settings #edit");
// routine display
const plannerBar = document.querySelector("#bar_field #planner_bar");
const addNewActivityButton = document.querySelector("#activity_settings_button");
// manager
const window_MNGR = document.querySelector("#manager");
const emptyMessage_MNGR = document.querySelector("#manager #empty_message");
const listField_MNGR = document.querySelector("#manager #list");
const activityList_MNGR = document.querySelector("#manager #list ul");
const statisticsField_MNGR = document.querySelector("#manager #statistics");
const usedTimePercentage_MNGR = document.querySelector("#manager #statistics #occupied #progress_value");
const usedTimeProgress_MNGR = document.querySelector("#manager #statistics #occupied .circular_progress");
const workRatePercentage_MNGR = document.querySelector("#manager #statistics #productivity #progress_value");
const workRateProgress_MNGR = document.querySelector("#manager #statistics #productivity .circular_progress");
// activity delete window
const window_ADW = document.querySelector("#activity_delete");
const titleSpan_ADW = document.querySelector("#activity_delete h2 span");
const cancelButton_ADW = document.querySelector("#activity_delete #cancel");
const deleteButton_ADW = document.querySelector("#activity_delete #delete");

// const testebtn = document.querySelector("#teste");
// testebtn.onclick = () => {
//   let act1 = new Activity("Dormir", "22:30", "07:30", 2);
//   let act2 = new Activity("Trabalhar", "08:00", "12:30", 0);
//   let act3 = new Activity("Estudar", "13:15", "17:40", 1);
//   let act4 = new Activity("Jogar", "18:00", "21:40", 3);
//   activityList.push(act1, act2, act3, act4);
//   updateRoutineBar();
//   testebtn.style.display = "none";
// }

function checkForActivityErrors(activityObj){
  if (activityObj.name == ""){
    displayError("The name field cannot be empty");
    return true;
  } else if (activityObj.start == "" || activityObj.end == ""){
    displayError("Please enter the start time and end time of the activity");
    return true;
  } else if (activityObj.start == activityObj.end){
    displayError("The start time and end time cannot be the same");
    return true;
  }
  
  let conflictFound = false;

  for (let i=0; i<activityList.length; i++){
    if (activityList[i].verifyConflict(activityObj) && activityList[i].id != activityObj.id){
      console.log("ID COMPAIRSON: "+ activityList[i].id +", "+activityObj.id);
      
      conflictFound = true;
      console.log("Conflict found with "+activityList[i].name);
      break;
    }
  }

  if (conflictFound){
    displayError("Found conflicts between the new Activity and a existing one, please verify and try again");
    return true;
  }

  return false;
}

function addNewActivity(){
  let newAct = new Activity(name_ACTVSET.value, start_ACTVSET.value, end_ACTVSET.value, selectedCategory_ACTVSET);
  if (checkForActivityErrors(newAct)) return;
  
  activityList.push(newAct);
  console.log("New activity created: "+newAct.name);
  closeActivityTab();
  updateRoutineBar();
}

function editActivity(activityObjIndex){
  let newAct = new Activity(name_ACTVSET.value, start_ACTVSET.value, end_ACTVSET.value, selectedCategory_ACTVSET);
  newAct.id = activityList[activityObjIndex].id;
  if (checkForActivityErrors(newAct)) return;
  
  activityList[activityObjIndex] = newAct;
  console.log("Activity edited: "+newAct.name);
  closeActivityTab();
  updateRoutineBar();
}

function updateRoutineBar(){
  plannerBar.innerHTML = '';
  occupiedMinutes = 0;
  workRateMinutes = 0;
  avaliableMinutes = 1440;
  
  activityList.forEach((activityObj, index) => {
    
    if (activityObj.start > activityObj.end){
      let fromMidnightToEndInMinutes = parseInt(activityObj.end.split(':')[0]) * 60;
      fromMidnightToEndInMinutes += parseInt(activityObj.end.split(':')[1])

      /* regra de três pra saber a porcentagem, fck the translation */
      let percentage = (fromMidnightToEndInMinutes * 100) / 1440; // 1440 is the total minutes in 24h
      console.log("Percentage of FP calculated: "+percentage.toFixed(2));

      let firstPart = document.createElement('div');
      firstPart.style.backgroundColor = activityObj.color;
      firstPart.style.left = '0';
      firstPart.style.width = (percentage.toFixed(2)).toString()+"%";

      let firstPart_name = document.createElement('p');
      firstPart_name.innerHTML = activityObj.name;

      let fromStartToMidnightInMinutes = (24 - parseInt(activityObj.start.split(':')[0])) * 60;
      fromStartToMidnightInMinutes -= parseInt(activityObj.start.split(':')[1]);

      /* regra de três pra saber a porcentagem, fck the translation */
      percentage = (fromStartToMidnightInMinutes * 100) / 1440; // 1440 is the total minutes in 24h
      console.log("Percentage of SP calculated: "+percentage.toFixed(2));

      let secondPart = document.createElement('div');
      secondPart.style.backgroundColor = activityObj.color;
      secondPart.style.right = '0';
      secondPart.style.width = (percentage.toFixed(2)).toString()+"%";

      let secondPart_name = document.createElement('p');
      secondPart_name.innerHTML = activityObj.name;
      
      /* setting a single reaction to both elements hover */
      firstPart.addEventListener('mouseenter', () => {mouseOverReaction('mouseenter',firstPart, secondPart)});
      secondPart.addEventListener('mouseenter', () => {mouseOverReaction('mouseenter',firstPart, secondPart)});
      firstPart.addEventListener('mouseleave', () => {mouseOverReaction('mouseleave',firstPart, secondPart)});
      secondPart.addEventListener('mouseleave', () => {mouseOverReaction('mouseleave',firstPart, secondPart)});

      firstPart.appendChild(firstPart_name);
      plannerBar.appendChild(firstPart);
      secondPart.appendChild(secondPart_name);
      plannerBar.appendChild(secondPart);
    }
    else if (activityObj.start < activityObj.end){
      let startArray = (activityObj.start.split(':')).map(Number);
      let endArray = (activityObj.end.split(':')).map(Number);

      let elapsedTimeInMinutes = (endArray[0] - startArray[0]) * 60;
      elapsedTimeInMinutes += endArray[1] - startArray[1];

      /* regra de três pra saber a porcentagem, fck the translation */
      let percentage = (elapsedTimeInMinutes * 100) / 1440; // 1440 is the total minutes in 24h
      console.log("Percentage calculated: "+percentage.toFixed(2));

      let startPosition = (((startArray[0] * 60) + startArray[1]) * 100) / 1440;
      console.log("Start startPosition: "+startPosition.toFixed(2));

      let activityElement = document.createElement('div');
      activityElement.style.backgroundColor = activityObj.color;
      activityElement.style.left = startPosition+"%";
      activityElement.style.width = (percentage.toFixed(2)).toString()+"%";

      let activityElement_name = document.createElement('p');
      activityElement_name.innerHTML = activityObj.name;
      
      activityElement.appendChild(activityElement_name);
      plannerBar.appendChild(activityElement);
    }

    occupiedMinutes += (activityObj.duration[0] * 60) + activityObj.duration[1];
    if (activityObj.category == 0 || activityObj.category == 1) workRateMinutes += (activityObj.duration[0] * 60) + activityObj.duration[1];
    console.log(occupiedMinutes);
  })
  
  updateManager();
}

function updateManager(){
  /** list field */
  activityList_MNGR.innerHTML = '';
  if (activityList.length > 0){
    listField_MNGR.classList.remove("hide");
    statisticsField_MNGR.classList.remove("hide");
    emptyMessage_MNGR.classList.add("hide");

    activityList.forEach((item, index) => {
      let newItem = document.createElement('li');
      let spanName = document.createElement('span');
      let spanTime = document.createElement('span');
      let categoryIcon = document.createElement('i');
      let optionsDiv = document.createElement('div');
      let editIcon  = document.createElement('i');
      let deleteIcon  = document.createElement('i');
      
      editIcon.classList.add("fa-solid", "fa-edit");
      deleteIcon.classList.add("fa-solid", "fa-trash");
      optionsDiv.appendChild(editIcon);
      optionsDiv.appendChild(deleteIcon);

      editIcon.onclick = () => {openEditActivityTab(index)};
      deleteIcon.onclick = () => {openDeleteActivityTab(index)};

      categoryIcon.classList.add("fas", categoryIconList[item.category])
      spanName.innerHTML = item.name;
      spanTime.innerHTML = item.start+" / "+item.end;
      newItem.appendChild(categoryIcon);
      newItem.appendChild(spanName);
      newItem.appendChild(spanTime);
      newItem.appendChild(optionsDiv);
      newItem.style.backgroundColor = item.color;
      activityList_MNGR.appendChild(newItem);
    })
  }else {
    listField_MNGR.classList.add("hide");
    statisticsField_MNGR.classList.add("hide");
    emptyMessage_MNGR.classList.remove("hide");
  }

  /** manager & statistics field */ 
  avaliableTime = []
  occupiedTime = []
  
  let usedTime = parseInt((occupiedMinutes * 100) / 1440);
  updateCircularProgress(usedTime, usedTimePercentage_MNGR, usedTimeProgress_MNGR);
  let productiveTime = parseInt((workRateMinutes * 100) / 1440);
  updateCircularProgress(productiveTime, workRatePercentage_MNGR, workRateProgress_MNGR);

  // avaliableMinutes -= occupiedMinutes;
  // avaliableTime.push(parseInt(avaliableMinutes / 60));
  // avaliableTime.push(avaliableMinutes % 60);
  // occupiedTime.push(parseInt(occupiedMinutes / 60));
  // occupiedTime.push(occupiedMinutes % 60);

  // avaliableElem.innerHTML = avaliableTime[0] + " hours " + avaliableTime[1] + " minutes";
  // occupiedElem.innerHTML = occupiedTime[0] + " hours " + occupiedTime[1] + " minutes";
}

/* MINOR FUNCTIONS */
function openCreateActivityTab(){
  blackScreen.classList.add("show")
  window_ACTVSET.classList.add("show");
  window_ACTVSET.classList.add("create");
  name_ACTVSET.value = '';
  start_ACTVSET.value = "";
  end_ACTVSET.value = "";
  selectNACategory(0);
}

function openEditActivityTab(activityObjIndex){
  blackScreen.classList.add("show")
  window_ACTVSET.classList.add("show");
  window_ACTVSET.classList.add("edit");
  name_ACTVSET.value = activityList[activityObjIndex].name;
  start_ACTVSET.value = activityList[activityObjIndex].start;
  end_ACTVSET.value = activityList[activityObjIndex].end;
  selectNACategory(activityList[activityObjIndex].category);
  editButton_ACTVSET.onclick = () => {editActivity(activityObjIndex)}
}

function closeActivityTab(){
  blackScreen.classList.remove("show")
  window_ACTVSET.classList.remove("show");
  window_ACTVSET.classList.remove("create");
  window_ACTVSET.classList.remove("edit");
}

function openDeleteActivityTab(activityObjIndex){
  blackScreen.classList.add("show");
  window_ADW.classList.add("show");
  titleSpan_ADW.innerHTML = activityList[activityObjIndex].name;
  titleSpan_ADW.style.color = activityList[activityObjIndex].color;
  deleteButton_ADW.onclick = () => {
    activityList.splice(activityObjIndex, 1);
    closeDeleteActivityTab();
    updateRoutineBar();
  }
}

function closeDeleteActivityTab(){
  blackScreen.classList.remove("show");
  window_ADW.classList.remove("show");
}

function displayError(message){
  alert("Error: "+message);
}

function mouseOverReaction(actionType, elem1, elem2){
  if (actionType == 'mouseenter'){
    elem1.style.transform = "scaleY(115%)";
    elem2.style.transform = "scaleY(115%)";
  } else if (actionType == 'mouseleave'){
    elem1.style.transform = "scaleY(1)";
    elem2.style.transform = "scaleY(1)";
  }
}

function selectNACategory(index){
  categoryItems[selectedCategory_ACTVSET].classList.toggle("selected");
  categoryItems[index].classList.toggle("selected");
  
  if (index == 0){ // work
    selectedCategory_ACTVSET = 0;
    selectedColor_ACTVSET = "#9cc51f";
    categorySelector.style.left = "0";
  } else if (index == 1){ // study
    selectedCategory_ACTVSET = 1;
    selectedColor_ACTVSET = "#ffa500";
    categorySelector.style.left = "20%";
  } else if (index == 2){ // rest
    selectedCategory_ACTVSET = 2;
    selectedColor_ACTVSET = "#4c4e81";
    categorySelector.style.left = "40%";
  } else if (index == 3){ // relax
    selectedCategory_ACTVSET = 3;
    selectedColor_ACTVSET = "#1fc5bd";
    categorySelector.style.left = "60%";
  } else if (index == 4){ // other
    selectedCategory_ACTVSET = 4;
    selectedColor_ACTVSET = "#ff00f8";
    categorySelector.style.left = "80%";
  }

  categorySelector.style.backgroundColor = selectedColor_ACTVSET;
}

function updateCircularProgress(percentValue, percentDisplay, circularProgressElem){
  let currentProgress = 0;
  let progressUpdate = setInterval(() => {
    circularProgressElem.style.background = "conic-gradient(var(--new-button-background) "+currentProgress+"%, #00000036 0deg)";
    percentDisplay.innerHTML = currentProgress+"%";

    if (currentProgress < percentValue){
      currentProgress++;
      return;
    } else if (currentProgress > percentValue){
      currentProgress--;
      return;
    }

    clearInterval(progressUpdate);
  }, 20);
}

class Activity{
  static instanceCount = 0;

  constructor(name, start, end, category){
    this.name = name;
    this.start = start;
    this.end = end;    
    this.crossDay = start > end ? true : false;
    this.duration = this.#getDuration();
    this.category = category; // currently 4: productive, rest, relax, other
    this.color = colorPickerList[category];
    this.id = Activity.instanceCount++;
  }

  verifyConflict(newActivity){
    /* I know this looks confusing but idk another way to do it */
    if (!this.crossDay && !newActivity.crossDay) {
      if (this.start > newActivity.end || this.end < newActivity.start) return false;
    } else if (!this.crossDay && newActivity.crossDay){
      if (this.start > newActivity.end && this.end < newActivity.start) return false;
    } else if (this.crossDay && !newActivity.crossDay){
      if (this.start > newActivity.end && this.end < newActivity.start) return false;
    }
    return true;
  }


  #getDuration(){
    let dur = [0, 0];
    let startNumber = (this.start).split(':').map(Number);
    let endNumber = (this.end).split(':').map(Number);

    if (!this.crossDay){
      dur[0] = endNumber[0] - startNumber[0];
      dur[1] = endNumber[1] - startNumber[1];

    } else if (this.crossDay){
      dur[0] = (24 - startNumber[0]) + endNumber[0];
      dur[1] = endNumber[1] - startNumber[1];
    }
    
    if (dur[1] < 0){
      dur[0]--;
      dur[1] += 60;
    }

    return dur;
  };
} /* Activity class end */

/* ELEMENTS BEHAVIOUR */
addButton_ACTVSET.onclick = addNewActivity;
plannerBar.onclick = openCreateActivityTab;
cancelButton_ACTVSET.onclick = closeActivityTab;
cancelButton_ADW.onclick = closeDeleteActivityTab;
Array.from(categoryItems).forEach((elem, index) => {elem.onclick = () => {selectNACategory(index)}})

/* LETS */
let avaliableMinutes = 1440;
let avaliableTime = [];
let occupiedMinutes = 0; 
let occupiedTime = []
let workRateMinutes = 0;
let activityList = [];
let selectedCategory_ACTVSET = 0; // work, study, rest, relax, other
let selectedColor_ACTVSET = null;
let activityIDCounter = 0;

/* ON START */
document.addEventListener('DOMContentLoaded', () => {
  let textLoadProgress = 0;
  let textContent = "Click here to add a new activity";
  let plannerBarTextLoad = setInterval(() => {
    if (textLoadProgress <= textContent.length){
      plannerBar.innerHTML = textContent.substring(0,textLoadProgress);
      textLoadProgress++;
      return;
    }
    clearInterval(plannerBarTextLoad);
  }, 80);
});
