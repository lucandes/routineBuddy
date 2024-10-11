/* HTML LINKS */
const avaliableElem = document.querySelector("#avaliable span");
const occupiedElem = document.querySelector("#occupied span");
const addNewActivityButton = document.querySelector("#button_field #new");
const plannerBar = document.querySelector("#bar_field #planner_bar");

//// DEBUG, REMOVE LATER
const testButton = document.querySelector("#teste");
testButton.onclick = () => {
  let newAct = new Activity("Dormir", "white", "10:00", "17:30");
  activityList.push(newAct);
  console.log("New activity created: "+newAct.name);
  updateRoutineBar();
}

/* NEW ACTIVITY FIELD */
const NAElem = document.querySelector("#new_activity");
const name_NAElem = document.querySelector("#new_activity #name");
const color_NAElem = document.querySelector("#new_activity #color");
const start_NAElem = document.querySelector("#new_activity #start");
const end_NAElem = document.querySelector("#new_activity #end");
const cancel_NAElem = document.querySelector("#new_activity #cancel");
const add_NAElem = document.querySelector("#new_activity #add");

function addNewActivity(){
  if (name_NAElem.value == ""){
    displayError("The name field cannot be empty");
    return;
  } else if (start_NAElem.value == "" || end_NAElem.value == ""){
    displayError("Please enter the start time and end time of the activity");
    return;
  } else if (start_NAElem.value == end_NAElem.value){
    displayError("The start time and end time cannot be the same");
    return;
  }

  let newAct = new Activity(name_NAElem.value, color_NAElem.value, start_NAElem.value, end_NAElem.value);
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
  updateRoutineBar();
}

function toggleAddActivityTab(){
  NAElem.classList.toggle("open");
}

function updateRoutineBar(){
  plannerBar.innerHTML = '';
  
  activityList.forEach((activityObj, index) => {
    
    if (activityObj.start > activityObj.end){
      let fromMidnightToEndInMinutes = parseInt(activityObj.end.split(':')[0]) * 60;
      fromMidnightToEndInMinutes += parseInt(activityObj.end.split(':')[1])

      /* regra de três pra saber a porcentagem, fck the translation */
      let percentage = (fromMidnightToEndInMinutes * 100) / 1440; // 1440 is the total minutes in 24h
      console.log("Percentage of FP calculated: "+percentage.toFixed(2));

      let firstPart = document.createElement('div');
      firstPart.style.backgroundColor = activityObj.color;
      firstPart.innerHTML = activityObj.name;
      firstPart.style.left = '0';
      firstPart.style.width = (percentage.toFixed(2)).toString()+"%";
      plannerBar.appendChild(firstPart);

      let fromStartToMidnightInMinutes = (24 - parseInt(activityObj.start.split(':')[0])) * 60;
      fromStartToMidnightInMinutes -= parseInt(activityObj.start.split(':')[1]);

      /* regra de três pra saber a porcentagem, fck the translation */
      percentage = (fromStartToMidnightInMinutes * 100) / 1440; // 1440 is the total minutes in 24h
      console.log("Percentage of SP calculated: "+percentage.toFixed(2));

      let secondPart = document.createElement('div');
      secondPart.style.backgroundColor = activityObj.color;
      secondPart.innerHTML = activityObj.name;
      secondPart.style.right = '0';
      secondPart.style.width = (percentage.toFixed(2)).toString()+"%";
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
      activityElement.innerHTML = activityObj.name;
      activityElement.style.backgroundColor = activityObj.color;
      activityElement.style.left = startPosition+"%";
      activityElement.style.width = (percentage.toFixed(2)).toString()+"%";
      plannerBar.appendChild(activityElement);
    }
  })
}

function displayError(message){
  alert("Error: "+message);
}

class Activity{
  constructor(name, color, start, end){
    this.name = name;
    this.color = color;
    this.start = start;
    this.end = end;
    this.duration;
    this.crossDay = start > end ? true : false;
  }

  verifyConflict(newActivity){
    /* I know this looks confusing but idk another way to do it */
    if (!this.crossDay) {
      if ((this.start < newActivity.start && this.end > newActivity.start) || (this.start < newActivity.end && this.end > newActivity.end)) return true;
    } else if (this.crossDay){
      if ((this.start < newActivity.start) || (this.start < newActivity.end) || (this.end > newActivity.end) || (this.end > newActivity.start)) return true;
    }
    return false;
  }
} /* Activity class end */

add_NAElem.onclick = addNewActivity;
addNewActivityButton.onclick = toggleAddActivityTab;
cancel_NAElem.onclick = toggleAddActivityTab;

/* LETS */
let avaliable = 2400;
let occupied = 0;
let activityList = []