document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('addButton');
    const saveButton = document.getElementById('saveButton');
    const errorMessage = document.getElementById('errorMessage');
    const searchInput = document.getElementById('search');
    const taskList = document.getElementById('taskList');
  
    let isEditMode = false;
    let currentTaskIndex = -1;
    let subtaskCounter = 1;
  
    addButton.addEventListener('click', addTask);
    saveButton.addEventListener('click', saveTask);
    searchInput.addEventListener('keyup', searchTasks);
  
    function addTask() {
      const taskName = document.getElementById('taskName').value;
      const startDate = document.getElementById('startDate').value;
      const endDate = document.getElementById('endDate').value;
      const status = document.getElementById('status').value;
  
      if (!taskName || !startDate || !endDate || !status) {
        alert("All fields are required.");
        return;
      }
  
      if (new Date(endDate) <= new Date(startDate)) {
        alert("End date must be after the start date.");
        return;
      }
  
      const subtasks = document.querySelectorAll('.subtask');
      const subtaskList = Array.from(subtasks).map(subtask => subtask.value);
  
      const task = {
        taskName,
        subtasks: subtaskList,
        startDate,
        endDate,
        status
      };
  
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${task.taskName}</td>
        <td>${task.subtasks.join(', ')}</td>
        <td>${task.startDate}</td>
        <td>${task.endDate}</td>
        <td>${task.status}</td>
        <td class="actions">
            <button class="editButton">Edit</button>
            <button class="deleteButton">Delete</button>
        </td>
      `;
  
      const editButton = row.querySelector('.editButton');
      editButton.addEventListener('click', () => editTask(task, row));
  
      const deleteButton = row.querySelector('.deleteButton');
      deleteButton.addEventListener('click', () => deleteTask(row));
  
      taskList.appendChild(row);
      clearForm();
      errorMessage.textContent = '';
    }
  
    function handleDateChange() {
      const startDateInput = document.getElementById('startDate');
      const endDateInput = document.getElementById('endDate');
      const statusInput = document.getElementById('status');
  
      const startDate = new Date(startDateInput.value);
      const endDate = new Date(endDateInput.value);
      const today = new Date();
  
      startDateInput.setAttribute("min", today.toISOString().split("T")[0]);
      endDateInput.setAttribute("min", today.toISOString().split("T")[0]);
  
      if (startDate > today) {
        statusInput.value = "in-progress";
      } else if (endDate < today) {
        statusInput.value = "due-passed";
      } else {
        statusInput.value = "complete";
      }
    }
  
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    startDateInput.addEventListener('change', handleDateChange);
    endDateInput.addEventListener('change', handleDateChange);
  
    handleDateChange();
  
    function saveTask() {
      const taskName = document.getElementById('taskName').value;
      const startDate = document.getElementById('startDate').value;
      const endDate = document.getElementById('endDate').value;
      const status = document.getElementById('status').value;
  
      if (!taskName || !startDate || !endDate || !status) {
        errorMessage.textContent = 'All fields are required.';
        return;
      }
  
      if (new Date(endDate) <= new Date(startDate)) {
        errorMessage.textContent = 'End date must be after start date.';
        return;
      }
  
      const subtasks = document.querySelectorAll('.subtask');
      const subtaskList = Array.from(subtasks).map(subtask => subtask.value);
  
      const task = {
        taskName,
        subtasks: subtaskList,
        startDate,
        endDate,
        status
      };
  
      taskList.innerHTML = '';
  
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${task.taskName}</td>
        <td>${task.subtasks.join(', ')}</td>
        <td>${task.startDate}</td>
        <td>${task.endDate}</td>
        <td>${task.status}</td>
        <td class="actions">
            <button class="editButton">Edit</button>
            <button class="deleteButton">Delete</button>
        </td>
      `;
  
      const editButton = row.querySelector('.editButton');
      editButton.addEventListener('click', () => editTask(task, row));
  
      const deleteButton = row.querySelector('.deleteButton');
      deleteButton.addEventListener('click', () => deleteTask(row));
  
      taskList.appendChild(row);
  
      clearForm();
      errorMessage.textContent = '';
    }
  
    function editTask(task, row) {
      isEditMode = true;
      currentTaskIndex = row.rowIndex - 1;
  
      document.getElementById('taskName').value = task.taskName;
      document.getElementById('startDate').value = task.startDate;
      document.getElementById('endDate').value = task.endDate;
      document.getElementById('status').value = task.status;
  
      clearSubtasks();
      task.subtasks.forEach(subtask => addSubtaskInput(subtask));
  
      addButton.style.display = 'none';
      saveButton.style.display = 'inline-block';
    }
  
    function deleteTask(row) {
      if (row) {
        if (window.confirm("Are you sure you want to delete this task?")) {
          row.remove();
        }
      }
    }
  
    function searchTasks() {
      const query = searchInput.value.toLowerCase();
      const rows = document.querySelectorAll('#taskList tr');
  
      rows.forEach(row => {
        const taskName = row.children[0].textContent.toLowerCase();
        const status = row.children[4].textContent.toLowerCase();
  
        if (taskName.includes(query) || status.includes(query)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }
  
    function clearForm() {
      document.getElementById('taskName').value = '';
      document.getElementById('startDate').value = '';
      document.getElementById('endDate').value = '';
      document.getElementById('status').value = '';
    }
  
    function addSubtaskInput(value = '') {
      const subtaskSection = document.querySelector('.subtask-section');
      const subtaskInput = document.createElement('input');
      subtaskInput.type = 'text';
      subtaskInput.className = 'subtask';
      subtaskInput.required = true;
      subtaskInput.value = value;
  
      const subtaskLabel = document.createElement('label');
      subtaskLabel.textContent = `Subtask ${subtaskCounter}:`;
  
      const addButton = document.createElement('button');
      addButton.textContent = '+';
      addButton.className = 'addSubtaskButton';
      addButton.addEventListener('click', () => addSubtaskInput());
  
      subtaskSection.appendChild(subtaskLabel);
      subtaskSection.appendChild(subtaskInput);
      subtaskSection.appendChild(addButton);
  
      subtaskCounter++;
    }
  
    function clearSubtasks() {
      const subtaskSection = document.querySelector('.subtask-section');
      subtaskSection.innerHTML = `
        <label for="subtask1">Subtask 1:</label>
        <input type="text" class="subtask" required>
        <button class="addSubtaskButton">+</button>
      `;
  
      const addButton = subtaskSection.querySelector('.addSubtaskButton');
      addButton.addEventListener('click', () => addSubtaskInput());
      subtaskCounter = 2;
    }
  
    clearSubtasks();
  });
  