let statusarr = ["ToDo", "In Progress", "Done"];
let colormap = new Map();
colormap.set("ToDo", "primary");
colormap.set("In Progress", "danger");
colormap.set("Done", "success");
document.getElementsByClassName("task")[0].value = "";
document.getElementsByClassName("description")[0].value = "";

function addTask() {
  if (!localStorage.getItem("tasks-array")) {
    localStorage.setItem("tasks-array", JSON.stringify([]));
  }
  let title = document.getElementsByClassName("task")[0].value;
  let description = document.getElementsByClassName("description")[0].value;
  let status = document.getElementsByClassName("status")[0].value;
  let tasks = {
    title: title,
    description: description,
    status: status,
  };

  let arr = JSON.parse(localStorage.getItem("tasks-array"));
  arr.push(tasks);
  localStorage.setItem("tasks-array", JSON.stringify(arr));
  showTasks();
}

function showTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks-array"));

  const all_tasks = document.getElementsByClassName("all-tasks")[0];

  let htmlcode = "";

  for (let a in tasks) {
    let color = colormap.get(tasks[a].status);
    let unselected_options = [];

    for (let i of statusarr) {
      if (i != tasks[a].status) {
        unselected_options.push(i);
      }
    }

    htmlcode += `<div class="card m-lg-3 bg-${color}" style="width: 18rem">

<div class="card-body d-flex flex-column ">
  <h5 class="card-title">${tasks[a].title}</h5>
  <p class="card-text">
    ${tasks[a].description}
  </p>
  <select class="form-select display-status"  aria-label="Default select example">
        <option selected value="${tasks[a].status}">${tasks[a].status}</option>
        <option value="${unselected_options[0]}" onclick = UpdateStatus(${unselected_options[0]}, this.id) id = "${a}">${unselected_options[0]}</option>
        <option value="${unselected_options[1]}" onclick = UpdateStatus(${unselected_options[1]}, this.id) id = "${a}">${unselected_options[1]}</option>
      </select>
      <div class = " d-flex flex-row align-items-end">
  <a href="#" onClick = "EditTask()" class="btn btn-primary">Edit</a>
  <a href="#" onClick = DeleteTask(this.id) id = "${a}" class="btn btn-primary">Delete</a>
  </div>
  </div>
</div> `;
  }

  if (tasks.length != 0) {
    all_tasks.innerHTML = htmlcode;
  } else {
    all_tasks.innerHTML = `<b>No Tasks yet</b>`;
  }
}
showTasks();

function DeleteTask(index) {
  let storedtasks = JSON.parse(localStorage.getItem("tasks-array"));

  storedtasks.splice(index, 1);

  localStorage.setItem("tasks-array", JSON.stringify(storedtasks));
  showTasks();
}

function UpdateStatus(status_name, index) {
  console.log(status_name, index);
  let storedtasks = JSON.parse(localStorage.getItem("tasks-array"));

  storedtasks[index].status = status_name;

  localStorage.setItem("tasks-array", JSON.stringify(storedtasks));
  showTasks();
}
