//initial setup
let statusarr = ["ToDo", "In Progress", "Done"];
let colorMap = new Map();
colorMap.set("ToDo", "todocolor");
colorMap.set("In Progress", "inprogresscolor");
colorMap.set("Done", "donecolor");
document.getElementById("searching-title").value = "";
document.getElementById("searching-des").value = "";
document.getElementById("searching-title-des").value = "";

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

if (!localStorage.getItem("searched-array")) {
  localStorage.setItem("searched-array", JSON.stringify([]));
}

if (!localStorage.getItem("tasks-array")) {
  localStorage.setItem("tasks-array", JSON.stringify([]));
}

title.value = "";
description.value = "";

const allTask = document.getElementsByClassName("all-tasks")[0];

function addTask() {
  let title = document.getElementsByClassName("task")[0];
  let description = document.getElementsByClassName("description")[0];
  let status = document.getElementsByClassName("status")[0];
  if (title.value == "" || description.value == "") {
    alert("Enter title and description");
    return;
  }
  let tasks = {
    id: crypto.randomUUID(),
    title: title.value,
    description: description.value,
    status: status.value,
  };

  let arr = JSON.parse(localStorage.getItem("tasks-array"));
  arr.push(tasks);
  localStorage.setItem("tasks-array", JSON.stringify(arr));
  title.value = "";
  description.value = "";
  filterElement.value = "all-task";
  searchContentTitle.value = "";
  searchContentDescription.value = "";
  searchContentTitleDes.value = "";
  showTasks(arr);
}

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

    htmlcode += `<div class="card m-3 ${color} shadow-sm" style="width: 18rem">




<div class="card-body d-flex flex-column align-items-center justify-content-center">
<h5 class="card-title h-20">${tasks[a].title}</h5>
<p class="card-text text-center h-20">
  ${tasks[a].description}
</p>
<select class="form-select h-20"
  id="status-${tasks[a].id}"
  onchange="UpdateStatus(this.value, '${tasks[a].id}')">
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
    allTask.innerHTML = `<div class = "d-flex justify-content-center no-content flex-grow-1 ms-3 me-3"><b class="mt-2 mb-2">No Tasks yet</b></div>`;
  }
}
let tasks = JSON.parse(localStorage.getItem("tasks-array"));
showTasks(tasks);

function getIndexFromId(ids, storedTasks) {
  let index = 0;
  for (let a in storedTasks) {
    if (storedTasks[a].id == ids) index = a;
  }
  return index;
}

function DeleteTask(ids) {
  let storedTasks = JSON.parse(localStorage.getItem("tasks-array"));
  let index = getIndexFromId(ids, storedTasks);
  storedTasks.splice(index, 1);
  localStorage.setItem("tasks-array", JSON.stringify(storedTasks));
  showTasks(storedTasks);
}

function UpdateStatus(status_name, taskId) {
  let storedTasks = JSON.parse(localStorage.getItem("tasks-array"));
  let searchedTasks = JSON.parse(localStorage.getItem("searched-array"));
  let taskIndex = storedTasks.findIndex((task) => task.id === taskId);
  let searchedTaskIndex = searchedTasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    storedTasks[taskIndex].status = status_name;
    localStorage.setItem("tasks-array", JSON.stringify(storedTasks));
  }

  if (searchedTaskIndex !== -1) {
    searchedTasks[searchedTaskIndex].status = status_name;

    localStorage.setItem("searched-array", JSON.stringify(searchedTasks));
  }

  if (taskId === -1 && searchedTaskIndex === -1) return;
  handleStatusChange(filterElement.value);
}

function handleStatusChange(optionId) {
  let storedTasks = JSON.parse(localStorage.getItem("tasks-array"));
  if (
    searchContentTitle.value == "" &&
    searchContentDescription.value == "" &&
    searchContentTitleDes.value == ""
  ) {
    if (optionId == "all-task") {
      showTasks(storedTasks);
    } else {
      showSelectedTasks(optionId, storedTasks);
    }
  } else {
    let searchedTasks = JSON.parse(localStorage.getItem("searched-array"));
    if (optionId == "all-task") {
      showTasks(searchedTasks);
    } else {
      showSelectedTasks(optionId, searchedTasks);
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

  showTasks(showSelectedArr);
}

function searchTasks(event, ref) {
  // if (event.key != "Enter") return;

  const inputId = ref.id;
  const inputEle = document.getElementById(inputId);
  const text = inputEle.value.toLowerCase();
  let storedTasks = JSON.parse(localStorage.getItem("tasks-array"));
  if (text == "") {
    showTasks(storedTasks);
    return;
  }
  let propertyToSearch =
    inputId == "searching-title"
      ? "title"
      : inputId == "searching-des"
      ? "description"
      : "";

  let searchedOutput = [];
  for (let a in storedTasks) {
    if (
      (propertyToSearch != "" &&
        storedTasks[a][propertyToSearch].toLowerCase().includes(text)) ||
      (propertyToSearch == "" &&
        (storedTasks[a]["title"].toLowerCase().includes(text) ||
          storedTasks[a]["description"].toLowerCase().includes(text)))
    ) {
      searchedOutput.push(storedTasks[a]);
    }
  }
  localStorage.setItem("searched-array", JSON.stringify(searchedOutput));

  showTasks(searchedOutput);
}

function editTask(identifier) {
  let storedTasks = JSON.parse(localStorage.getItem("tasks-array"));

  let index = getIndexFromId(identifier, storedTasks);

  let editTaskObj = storedTasks[index];

  addTaskText.textContent = "Update Task";
  addButton.onclick = function () {
    editTaskContent(identifier);
  };
  title.value = editTaskObj["title"];
  description.value = editTaskObj["description"];
  status.value = editTaskObj["status"];
  statusOption1.disabled = false;
  statusOtion2.disabled = false;
}

function editTaskContent(identifier) {
  filterElement.value = "all-task";
  searchContentTitle.value = "";
  searchContentDescription.value = "";
  searchContentTitleDes.value = "";

  let storedTasks = JSON.parse(localStorage.getItem("tasks-array"));
  let index = getIndexFromId(identifier, storedTasks);

  storedTasks[index].title = title.value;
  storedTasks[index].description = description.value;
  storedTasks[index].status = status.value;

  title.value = "";
  description.value = "";
  status.value = "ToDo";

  addTaskText.textContent = "Add Task";
  addButton.onclick = function () {
    addTask();
  };
  statusOption1.disabled = true;
  statusOtion2.disabled = true;

  localStorage.setItem("tasks-array", JSON.stringify(storedTasks));
  showTasks(storedTasks);
}
