/* HTML LINKS */
const blackScreen = document.querySelector("#black_screen");
const avaliableElem = document.querySelector("#avaliable span");
const occupiedElem = document.querySelector("#occupied span");
const categoryIconList = ["fa-clock", "fa-bed", "fa-gamepad", "fa-clipboard-question"];
// new activity window
const NEWACTV = document.querySelector("#new_activity");
const name_NEWACTV = document.querySelector("#new_activity #name");
const color_NEWACTV = document.querySelector("#new_activity #color");
const start_NEWACTV = document.querySelector("#new_activity #start");
const end_NEWACTV = document.querySelector("#new_activity #end");
const categorySelector = document.querySelector("#new_activity #category #selector");
const categoryItems = document.querySelectorAll("#new_activity #category .item");
const cancel_NEWACTV = document.querySelector("#new_activity #cancel");
const add_NEWACTV = document.querySelector("#new_activity #add");
// routine display
const plannerBar = document.querySelector("#bar_field #planner_bar");
const addNewActivityButton = document.querySelector("#new_activity_button");
  // manager
const MNGR = document.querySelector("#manager");
const emptyMessage_MNGR = document.querySelector("#manager #empty_message");
const listField_MNGR = document.querySelector("#manager #list");
const activityList_MNGR = document.querySelector("#manager #list ul");
const statisticsField_MNGR = document.querySelector("#manager #statistics");
const usedTimePercentage_MNGR = document.querySelector("#manager #statistics #progress_value");
const usedTimeProgress_MNGR = document.querySelector("#manager #statistics #occupied .circular_progress");

//// DEBUG, REMOVE LATER
const testButton = document.querySelector("#teste");
testButton.style.position = "absolute";
testButton.style.right = "0";
testButton.style.top = "0";
testButton.style.opacity = "10%";
testButton.onclick = () => {
  let newAct = new Activity("Dormir", "white", "23:00", "06:30", 1);
  activityList.push(newAct);
  console.log("New activity created: "+newAct.name);
  testButton.style.display = "none";
  updateRoutineBar();
}

function addNewActivity(){
  if (name_NEWACTV.value == ""){
    displayError("The name field cannot be empty");
    return;
  } else if (start_NEWACTV.value == "" || end_NEWACTV.value == ""){
    displayError("Please enter the start time and end time of the activity");
    return;
  } else if (start_NEWACTV.value == end_NEWACTV.value){
    displayError("The start time and end time cannot be the same");
    return;
  }

  let newAct = new Activity(name_NEWACTV.value, color_NEWACTV.value, start_NEWACTV.value, end_NEWACTV.value, selectedCategory_NEWACTV);
  let conflictFound = false;

  for (let i=0; i<activityList.length; i++){
    if (activityList[i].verifyConflict(newAct)){
      conflictFound = true;
      console.log("Conflict found with "+activityList[i].name);
      break;
    }
  }

  if (conflictFound){
    displayError("Found conflicts between the new Activity and a existing one, please verify and try again");
    return;
  }

  activityList.push(newAct);
  console.log("New activity created: "+newAct.name);
  toggleAddActivityTab();
  updateRoutineBar();
}

function toggleAddActivityTab(){
  blackScreen.classList.toggle("show")
  NEWACTV.classList.toggle("open");
  name_NEWACTV.value = '';
  color_NEWACTV.value = '#000000';
  start_NEWACTV.value = "";
  end_NEWACTV.value = "";
  selectNACategory(0);
}

function updateRoutineBar(){
  plannerBar.innerHTML = '';
  occupiedMinutes = 0;
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
      elapsedTimeInMinutes -= startArray[1];
      elapsedTimeInMinutes += endArray[0];

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

    activityList.forEach((item) => {
      let newItem = document.createElement('li');
      let spanName = document.createElement('span');
      let spanTime = document.createElement('span');
      let spanIcon = document.createElement('i');
      spanIcon.classList.add("fas", categoryIconList[item.category])
      spanName.innerHTML = item.name;
      spanTime.innerHTML = item.start+" / "+item.end;
      newItem.appendChild(spanIcon);
      newItem.appendChild(spanName);
      newItem.appendChild(spanTime);
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

  // avaliableMinutes -= occupiedMinutes;
  // avaliableTime.push(parseInt(avaliableMinutes / 60));
  // avaliableTime.push(avaliableMinutes % 60);
  // occupiedTime.push(parseInt(occupiedMinutes / 60));
  // occupiedTime.push(occupiedMinutes % 60);

  // avaliableElem.innerHTML = avaliableTime[0] + " hours " + avaliableTime[1] + " minutes";
  // occupiedElem.innerHTML = occupiedTime[0] + " hours " + occupiedTime[1] + " minutes";
}

/* MINOR FUNCTIONS */

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
  categoryItems[selectedCategory_NEWACTV].classList.toggle("selected");
  categoryItems[index].classList.toggle("selected");
  if (index == 0){
    selectedCategory_NEWACTV = 0;
    categorySelector.style.left = "0";
  } else if (index == 1){
    selectedCategory_NEWACTV = 1;
    categorySelector.style.left = "25%";
  } else if (index == 2){
    selectedCategory_NEWACTV = 2;
    categorySelector.style.left = "50%";
  } else if (index == 3){
    selectedCategory_NEWACTV = 3;
    categorySelector.style.left = "75%";
  }
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
  constructor(name, color, start, end, category){
    this.name = name;
    this.color = color;
    this.start = start;
    this.end = end;    
    this.crossDay = start > end ? true : false;
    this.duration = this.#getDuration();
    this.category = category; // currently 4: productive, rest, relax, other
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
add_NEWACTV.onclick = addNewActivity;
addNewActivityButton.onclick = toggleAddActivityTab;
cancel_NEWACTV.onclick = toggleAddActivityTab;
Array.from(categoryItems).forEach((elem, index) => {elem.onclick = () => {selectNACategory(index)}})

/* LETS */
let avaliableMinutes = 1440;
let avaliableTime = []
let occupiedMinutes = 0; 
let occupiedTime = []
let workRateMinutes = 0;
let activityList = []
let selectedCategory_NEWACTV = 0;