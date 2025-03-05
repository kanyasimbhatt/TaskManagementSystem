let statusarr = ["ToDo", "In Progress", "Done"];
let colormap = new Map();
colormap.set("ToDo", "todocolor");
colormap.set("In Progress", "inprogresscolor");
colormap.set("Done", "donecolor");
document.getElementsByClassName("task")[0].value = "";
document.getElementsByClassName("description")[0].value = "";

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
  showTasks();
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

function showTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks-array"));

  let htmlcode = "";

  for (let a in tasks) {
    let color = colormap.get(tasks[a].status);
    let unselected_options = calculate_unselected(tasks[a].status);

    htmlcode += `<div class="card m-3 ${color}" style="width: 18rem">

<div class="card-body d-flex flex-column align-items-center">
  <h5 class="card-title">${tasks[a].title}</h5>
  <p class="card-text text-center">
    ${tasks[a].description}
  </p>
  <select class="form-select display-status"  aria-label="Default select example">
        <option selected value="${tasks[a].status}" disabled>${tasks[a].status}</option>
        <option onClick = "UpdateStatus(this.value, this.id)" id = "${a}" value="${unselected_options[0]}">${unselected_options[0]}</option>
        <option onClick = "UpdateStatus(this.value, this.id)" id = "${a}" value="${unselected_options[1]}">${unselected_options[1]}</option>
      </select>
      <div class = "d-flex flex-row gap-5 m-4 justify-content-center">
  <a href="#" onClick = "EditTask()" class="btn btn-warning">Edit</a>
  <a href="#" onClick = "DeleteTask(this.id)" id = "${tasks[a].id}" class="btn btn-warning">Delete</a>
  </div>
  </div>
</div> `;
  }

  if (tasks.length != 0) {
    all_tasks.innerHTML = htmlcode;
  } else {
    all_tasks.innerHTML = `<b class = "m-4">No Tasks yet</b>`;
  }
}
showTasks();

function DeleteTask(ids) {
  let storedtasks = JSON.parse(localStorage.getItem("tasks-array"));
  let index = 0;
  for (let a in storedtasks) {
    if (storedtasks[a].id == ids) index = a;
  }
  storedtasks.splice(index, 1);
  localStorage.setItem("tasks-array", JSON.stringify(storedtasks));
  showTasks();
}

function UpdateStatus(status_name, index) {
  let storedtasks = JSON.parse(localStorage.getItem("tasks-array"));

  storedtasks[index].status = status_name;

  localStorage.setItem("tasks-array", JSON.stringify(storedtasks));
  showTasks();
}

function Showselectedtasks(task) {
  all_tasks.innerHTML = "";

  let storedtasks = JSON.parse(localStorage.getItem("tasks-array"));
  let showtasktitle =
    task == "done"
      ? "Done"
      : task == "in-progress"
      ? "In Progress"
      : task == "todo"
      ? "ToDo"
      : "";
  if (showtasktitle == "") {
    return;
  }

  let htmlcode = "";
  for (let a in storedtasks) {
    let unselected_options = calculate_unselected(storedtasks[a].status);

    for (let i of statusarr) {
      if (i != storedtasks[a].status) {
        unselected_options.push(i);
      }
    }
    if (storedtasks[a].status == showtasktitle) {
      let color = colormap.get(storedtasks[a].status);
      htmlcode += `<div class="card m-3 ${color}" style="width: 18rem">

      <div class="card-body d-flex flex-column align-items-center">
        <h5 class="card-title">${storedtasks[a].title}</h5>
        <p class="card-text text-center">
          ${storedtasks[a].description}
        </p>
        <select class="form-select display-status"  aria-label="Default select example">
              <option selected value="${storedtasks[a].status}" disabled>${storedtasks[a].status}</option>
              <option onClick = "UpdateStatus(${this.value}, this.id)" id = "dfdf" value="${unselected_options[0]}">${unselected_options[0]}</option>
              <option onClick = "UpdateStatus(${this.value}, this.id)" id = "dff" value="${unselected_options[1]}">${unselected_options[1]}</option>
            </select>
            <div class = "d-flex flex-row gap-5 m-4 justify-content-center">
        <a href="#" onClick = "EditTask()" class="btn btn-warning">Edit</a>
        <a href="#" onClick = "DeleteTask(this.id)" id = "${storedtasks[a].id}" class="btn btn-warning">Delete</a>
        </div>
        </div>
      </div> `;
    }
  }

  if (htmlcode == "") {
    all_tasks.innerHTML = `No Tasks under ${showtasktitle}`;
  } else {
    all_tasks.innerHTML = htmlcode;
  }
}

function Searchtasks(event, ref) {
  if (event.key != "Enter") return;

  const input_id = ref.id;
  const input_ele = document.getElementById(input_id);
  const text = input_ele.value;
  let storedtasks = JSON.parse(localStorage.getItem("tasks-array"));
  console.log(text);
  let property_to_search =
    input_id == "searching-title"
      ? "title"
      : input_id == "searching-des"
      ? "description"
      : "";
  let htmlcode = "";

  for (let a in storedtasks) {
    let unselected_options = calculate_unselected(storedtasks[a].status);

    let color = colormap.get(storedtasks[a].status);
    if (text == storedtasks[a][property_to_search]) {
      console.log("match");
      htmlcode += `<div class="card m-3 ${color}" style="width: 18rem">

      <div class="card-body d-flex flex-column align-items-center">
        <h5 class="card-title">${storedtasks[a].title}</h5>
        <p class="card-text text-center">
          ${storedtasks[a].description}
        </p>
        <select class="form-select display-status"  aria-label="Default select example">
              <option selected value="${storedtasks[a].status}" disabled>${storedtasks[a].status}</option>
              <option onClick = "UpdateStatus(this.value, this.id)" id = "dfdf" value="${unselected_options[0]}">${unselected_options[0]}</option>
              <option onClick = "UpdateStatus(this.value, this.id)" id = "dff" value="${unselected_options[1]}">${unselected_options[1]}</option>
            </select>
            <div class = "d-flex flex-row gap-5 m-4 justify-content-center">
        <a href="#" onClick = "EditTask()" class="btn btn-warning">Edit</a>
        <a href="#" onClick = "DeleteTask(this.id)" id = "${storedtasks[a].id}" class="btn btn-warning">Delete</a>
        </div>
        </div>
      </div> `;
    }
  }

  if (htmlcode.length == 0) {
    all_tasks.innerHTML = "<b>No tasks under this search</b>";
  } else {
    all_tasks.innerHTML = htmlcode;
  }
}
