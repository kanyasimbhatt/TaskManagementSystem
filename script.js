//initial setup
let statusarr = ["ToDo", "In Progress", "Done"];
let colormap = new Map();
colormap.set("ToDo", "todocolor");
colormap.set("In Progress", "inprogresscolor");
colormap.set("Done", "donecolor");
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

title.value = "";
description.value = "";

const all_tasks = document.getElementsByClassName("all-tasks")[0];

function addTask() {
  if (!localStorage.getItem("tasks-array")) {
    localStorage.setItem("tasks-array", JSON.stringify([]));
  }

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

function calculate_unselected(status) {
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
    let color = colormap.get(tasks[a].status);
    let unselected_options = calculate_unselected(tasks[a].status);

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
   <option value="${unselected_options[0]}">${unselected_options[0]}</option>
   <option value="${unselected_options[1]}">${unselected_options[1]}</option>
</select>
     <div class = "d-flex flex-row gap-5 m-4 justify-content-end h-40">
 <a href="#" onClick = "editTask(this.id)" id = "${tasks[a].id}" class="btn btn-warning">Edit</a>
 <a href="#" onClick = "DeleteTask(this.id)" id = "${tasks[a].id}" class="btn btn-warning">Delete</a>
 </div>
 </div>
</div> `;
  }

  if (tasks.length != 0) {
    all_tasks.innerHTML = htmlcode;
  } else {
    all_tasks.innerHTML = `<div class = "d-flex justify-content-center no-content flex-grow-1 ms-3 me-3"><b class="mt-2 mb-2">No Tasks yet</b></div>`;
  }
}
let tasks = JSON.parse(localStorage.getItem("tasks-array"));
showTasks(tasks);

function getIndexFromId(ids, storedtasks) {
  let index = 0;
  for (let a in storedtasks) {
    if (storedtasks[a].id == ids) index = a;
  }
  return index;
}

function DeleteTask(ids) {
  let storedtasks = JSON.parse(localStorage.getItem("tasks-array"));
  let index = getIndexFromId(ids, storedtasks);
  storedtasks.splice(index, 1);
  localStorage.setItem("tasks-array", JSON.stringify(storedtasks));
  showTasks(storedtasks);
}

function UpdateStatus(status_name, taskId) {
  console.log(status_name, " ", taskId);
  let storedtasks = JSON.parse(localStorage.getItem("tasks-array"));
  let searchedTasks = JSON.parse(localStorage.getItem("searched-array"));
  let taskIndex = storedtasks.findIndex((task) => task.id === taskId);
  let searchedTaskIndex = searchedTasks.findIndex((task) => task.id === taskId);
  console.log(taskIndex, " ", searchedTaskIndex);
  if (taskIndex !== -1) {
    storedtasks[taskIndex].status = status_name;
    localStorage.setItem("tasks-array", JSON.stringify(storedtasks));
  }

  if (searchedTaskIndex !== -1) {
    searchedTasks[searchedTaskIndex].status = status_name;

    localStorage.setItem("searched-array", JSON.stringify(searchedTasks));
  }

  if (taskId === -1 && searchedTaskIndex === -1) return;

  handleStatusChange(filterElement.value);
}

function handleStatusChange(optionId) {
  console.log(optionId);
  let storedtasks = JSON.parse(localStorage.getItem("tasks-array"));
  if (
    searchContentTitle.value == "" &&
    searchContentDescription.value == "" &&
    searchContentTitleDes.value == ""
  ) {
    if (optionId == "all-task") {
      console.log("hereeee! 1");
      showTasks(storedtasks);
    } else {
      console.log("hereeee! 2");
      Showselectedtasks(optionId, storedtasks);
    }
  } else {
    let searchedTasks = JSON.parse(localStorage.getItem("searched-array"));
    if (optionId == "all-task") {
      showTasks(searchedTasks);
    } else {
      Showselectedtasks(optionId, searchedTasks);
    }
  }
}

function Showselectedtasks(taskId, storedtasks) {
  all_tasks.innerHTML = "";

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

  for (let a in storedtasks) {
    if (storedtasks[a].status == showtasktitle) {
      showSelectedArr.push(storedtasks[a]);
    }
  }

  showTasks(showSelectedArr);
}

function Searchtasks(event, ref) {
  if (event.key != "Enter") return;

  const input_id = ref.id;
  const input_ele = document.getElementById(input_id);
  const text = input_ele.value;
  let storedtasks = JSON.parse(localStorage.getItem("tasks-array"));
  if (text == "") {
    showTasks(storedtasks);
    return;
  }
  let property_to_search =
    input_id == "searching-title"
      ? "title"
      : input_id == "searching-des"
      ? "description"
      : "";

  let searchedOutput = [];
  if (!localStorage.getItem("searched-array")) {
    localStorage.setItem("searched-array", JSON.stringify([]));
  }
  for (let a in storedtasks) {
    if (
      (property_to_search != "" &&
        text == storedtasks[a][property_to_search]) ||
      (property_to_search == "" &&
        (text == storedtasks[a]["title"] ||
          text == storedtasks[a]["description"]))
    ) {
      searchedOutput.push(storedtasks[a]);
    }
  }

  localStorage.setItem("searched-array", JSON.stringify(searchedOutput));

  handleStatusChange(filterElement.value);
}

function editTask(identifier) {
  let storedtasks = JSON.parse(localStorage.getItem("tasks-array"));

  let index = getIndexFromId(identifier, storedtasks);

  let editTaskObj = storedtasks[index];

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

  let storedtasks = JSON.parse(localStorage.getItem("tasks-array"));
  let index = getIndexFromId(identifier, storedtasks);

  storedtasks[index].title = title.value;
  storedtasks[index].description = description.value;
  storedtasks[index].status = status.value;

  title.value = "";
  description.value = "";
  status.value = "ToDo";

  addTaskText.textContent = "Add Task";
  addButton.onclick = function () {
    addTask();
  };
  statusOption1.disabled = true;
  statusOtion2.disabled = true;

  localStorage.setItem("tasks-array", JSON.stringify(storedtasks));
  showTasks(storedtasks);
}
