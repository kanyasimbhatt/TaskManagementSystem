//common elements
const addTaskText = document.getElementsByClassName("add-task-text")[0];
const addButton = document.getElementsByClassName("add-button")[0];
let title = document.getElementsByClassName("task")[0];
let description = document.getElementsByClassName("description")[0];
let status = document.getElementsByClassName("status")[0];
const searchContentTitle = document.getElementById("searching-title");
const searchContentDescription = document.getElementById("searching-des");
const filterElement = document.getElementsByClassName("status-change")[0];
const searchContentTitleDes = document.getElementById("searching-title-des");
let statusOption1 = status.children[1];
let statusOtion2 = status.children[2];
const allTask = document.getElementsByClassName("all-tasks")[0];
let tasks = JSON.parse(localStorage.getItem("tasks-array"));

//initial setup
let statusarr = ["ToDo", "In Progress", "Done"];
let colorMap = new Map();
colorMap.set("ToDo", "todocolor");
colorMap.set("In Progress", "inprogresscolor");
colorMap.set("Done", "donecolor");
document.getElementById("searching-title").value = "";
document.getElementById("searching-des").value = "";
document.getElementById("searching-title-des").value = "";
title.value = "";
description.value = "";
status.value = "ToDo";
if (!localStorage.getItem("searched-array")) {
  storeDataToLocal([]);
}

if (!localStorage.getItem("tasks-array")) {
  storeDataToLocal([]);
}
let tasksArray = tasks;
let filterArray = tasksArray;
let statusChangedTasks = [];

showTasks(tasks);

function addTask(identifier) {
  let id;
  if (identifier) id = identifier;
  else id = crypto.randomUUID();
  let index = getIndexFromId(identifier, tasksArray);

  if (title.value == "" || description.value == "") {
    alert("Enter title and description");
    return;
  }
  if (index == -1) {
    let tasks = {
      id: id,
      title: title.value,
      description: description.value,
      status: status.value,
    };
    tasksArray.push(tasks);
  } else {
    tasksArray[index].title = title.value;
    tasksArray[index].description = description.value;
    tasksArray[index].status = status.value;
  }

  storeDataToLocal(tasksArray);
  title.value = "";
  description.value = "";
  status.value = "ToDo";
  filterElement.value = "all-task";
  searchContentTitle.value = "";
  searchContentDescription.value = "";
  addTaskText.textContent = "Add Task";
  addButton.textContent = "Add";
  statusOption1.disabled = true;
  statusOtion2.disabled = true;
  searchContentTitleDes.value = "";
  showTasks(tasksArray);
}

function storeDataToLocal(arr) {
  localStorage.setItem("tasks-array", JSON.stringify(arr));
}

//calculateUnselected() -> used to get those status which is currently not selected by the task.
function calculateUnselected(status) {
  let unselected = [];
  for (let i of statusarr) {
    if (i != status) {
      unselected.push(i);
    }
  }
  return unselected;
}

function showTasks(tasks) {
  let htmlcode = "";

  for (let a in tasks) {
    let color = colorMap.get(tasks[a].status);
    let unselectedOptions = calculateUnselected(tasks[a].status);

    htmlcode += `<div class="card me-2 mb-2 ${color} shadow-sm" style="width: 18rem">

    <div class="card-body d-flex flex-column align-items-center justify-content-center">
    <h5 class="card-title h-20">${tasks[a].title}</h5>
    <p class="card-text text-center h-20">
      ${tasks[a].description}
    </p>
    <select class="form-select h-20"
      id="status-${tasks[a].id}"
      onchange="updateStatus(this.value, '${tasks[a].id}')">
      <option selected value="${tasks[a].status}" disabled>${tasks[a].status}</option>
      <option value="${unselectedOptions[0]}">${unselectedOptions[0]}</option>
      <option value="${unselectedOptions[1]}">${unselectedOptions[1]}</option>
    </select>
        <div class = "d-flex flex-row gap-5 m-4 justify-content-end h-40">
    <a href="#" onClick = "editTask(this.id)" id = "${tasks[a].id}" class="btn btn-warning">Edit</a>
    <a href="#" onClick = "DeleteTask(this.id)" id = "${tasks[a].id}" class="btn btn-warning">Delete</a>
    </div>
    </div>
    </div> `;
  }

  if (tasks.length != 0) {
    allTask.innerHTML = htmlcode;
  } else {
    allTask.innerHTML = `<div class = "d-flex justify-content-center no-content flex-grow-1"><b class="mt-2 mb-2">No Tasks yet</b></div>`;
  }
}

function getIndexFromId(ids, storedTasks) {
  let index = -1;
  for (let a in storedTasks) {
    if (storedTasks[a].id == ids) index = a;
  }
  return index;
}

function DeleteTask(ids) {
  let index = getIndexFromId(ids, tasksArray);
  tasksArray.splice(index, 1);
  storeDataToLocal(tasksArray);
  showSelectedTasks(filterElement.value, tasksArray);
}

//updateStatus() -> handling the status change from the task card itself
function updateStatus(status_name, taskId) {
  let searchedTasks = JSON.parse(localStorage.getItem("searched-array"));
  let taskIndex = tasksArray.findIndex((task) => task.id === taskId);
  let searchedTaskIndex = searchedTasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    tasksArray[taskIndex].status = status_name;
    storeDataToLocal(tasksArray);
  }

  if (searchedTaskIndex !== -1) {
    searchedTasks[searchedTaskIndex].status = status_name;

    storeDataToLocal(storedTasks);
  }

  if (taskId === -1 && searchedTaskIndex === -1) return;
  handleStatusChange(filterElement.value);
}

//handleStatusChange() -> handling the status change from filter drop down
function handleStatusChange(optionId) {
  if (
    searchContentTitle.value == "" &&
    searchContentDescription.value == "" &&
    searchContentTitleDes.value == ""
  ) {
    if (optionId == "all-task") {
      showTasks(tasksArray);
    } else {
      console.log(optionId);
      showSelectedTasks(optionId, tasksArray);
    }
  } else {
    if (optionId == "all-task") {
      showTasks(filterArray);
    } else {
      showSelectedTasks(optionId, filterArray);
    }
  }
}

function showSelectedTasks(taskId, storedTasks) {
  allTask.innerHTML = "";

  let showtasktitle =
    taskId == "done"
      ? "Done"
      : taskId == "in-progress"
      ? "In Progress"
      : taskId == "todo"
      ? "ToDo"
      : "";
  if (showtasktitle == "") {
    return;
  }
  let showSelectedArr = [];

  for (let a in storedTasks) {
    if (storedTasks[a].status == showtasktitle) {
      showSelectedArr.push(storedTasks[a]);
    }
  }
  statusChangedTasks = showSelectedArr;
  showTasks(showSelectedArr);
}

function searchTitle(event) {
  if (filterElement.value != "all-task") {
    if (event.key == "Delete" || event.key == "Backspace") {
      showSelectedTasks(filterElement.value, tasksArray);
      filterArray = statusChangedTasks;
    }
    let text = searchContentTitle.value.toLowerCase();
    filterArray = statusChangedTasks.filter((taskObj) => {
      return taskObj.title.toLowerCase().includes(text) ? 1 : 0;
    });

    showTasks(filterArray);
    return;
  }
  if (event.key == "Delete" || event.key == "Backspace") {
    filterArray = tasksArray;
  }
  if (
    searchContentTitle.value === "" &&
    searchContentDescription.value === "" &&
    searchContentTitleDes.value === ""
  ) {
    filterArray = tasksArray;
    showTasks(filterArray);
  }
  let text = searchContentTitle.value.toLowerCase();
  filterArray = filterArray.filter((taskObj) => {
    return taskObj.title.toLowerCase().includes(text) ? 1 : 0;
  });

  showTasks(filterArray);
}

function searchDescription(event) {
  if (filterElement.value != "all-task") {
    if (event.key == "Delete" || event.key == "Backspace") {
      showSelectedTasks(filterElement.value, tasksArray);
      filterArray = statusChangedTasks;
    }
    let text = searchContentDescription.value.toLowerCase();
    filterArray = statusChangedTasks.filter((taskObj) => {
      return taskObj.description.toLowerCase().includes(text) ? 1 : 0;
    });

    showTasks(filterArray);
    return;
  }
  if (event.key == "Delete" || event.key == "Backspace") {
    filterArray = tasksArray;
  }
  if (
    searchContentTitle.value === "" &&
    searchContentDescription.value === "" &&
    searchContentTitleDes.value === ""
  ) {
    filterArray = tasksArray;
    showTasks(filterArray);
  }
  let text = searchContentDescription.value.toLowerCase();
  filterArray = filterArray.filter((taskObj) => {
    return taskObj.description.toLowerCase().includes(text) ? 1 : 0;
  });

  showTasks(filterArray);
}

function searchTitleDes(event) {
  if (filterElement.value != "all-task") {
    if (event.key == "Delete" || event.key == "Backspace") {
      showSelectedTasks(filterElement.value, tasksArray);
      filterArray = statusChangedTasks;
    }
    let text = searchContentTitleDes.value.toLowerCase();
    filterArray = statusChangedTasks.filter((taskObj) => {
      return taskObj.description.toLowerCase().includes(text) ||
        taskObj.title.toLowerCase().includes(text)
        ? 1
        : 0;
    });

    showTasks(filterArray);
    return;
  }
  if (event.key == "Delete" || event.key == "Backspace") {
    filterArray = tasksArray;
  }
  if (
    searchContentTitle.value === "" &&
    searchContentDescription.value === "" &&
    searchContentTitleDes.value === ""
  ) {
    filterArray = tasksArray;
    showTasks(filterArray);
  }

  let text = searchContentTitleDes.value.toLowerCase();

  filterArray = filterArray.filter((taskObj) => {
    return taskObj.description.toLowerCase().includes(text) ||
      taskObj.title.toLowerCase().includes(text)
      ? 1
      : 0;
  });

  showTasks(filterArray);
}

function editTask(identifier) {
  let index = getIndexFromId(identifier, tasksArray);
  let editTaskObj = tasksArray[index];
  addTaskText.textContent = "Update Task";
  addButton.textContent = "Update";

  addButton.onclick = function () {
    addTask(identifier);
  };
  title.value = editTaskObj["title"];
  description.value = editTaskObj["description"];
  status.value = editTaskObj["status"];
  statusOption1.disabled = false;
  statusOtion2.disabled = false;
}
