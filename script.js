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
  testButton.style.display = "none";
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
  toggleAddActivityTab();
  updateRoutineBar();
}

function toggleAddActivityTab(){
  NAElem.classList.toggle("open");
  name_NAElem.value = '';
  color_NAElem.value = '#000000';
  start_NAElem.value = "";
  end_NAElem.value = "";
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
      firstPart.style.left = '0';
      firstPart.style.width = (percentage.toFixed(2)).toString()+"%";

      let firstPart_name = document.createElement('p');
      firstPart_name.innerHTML = activityObj.name;

      firstPart.appendChild(firstPart_name);
      plannerBar.appendChild(firstPart);

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
      
      secondPart.appendChild(firstPart_name);
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
    this.crossDay = start > end ? true : false;
    this.duration = this.#getDuration();
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

add_NAElem.onclick = addNewActivity;
addNewActivityButton.onclick = toggleAddActivityTab;
cancel_NAElem.onclick = toggleAddActivityTab;

/* LETS */
let avaliable = 2400;
let occupied = 0;
let activityList = []