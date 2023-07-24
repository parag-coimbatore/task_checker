// Wait for the DOM content to load before executing the code
document.addEventListener('DOMContentLoaded', function () {
  // Get references to important elements in the DOM
  const addButton = document.getElementById('addButton');
  const saveButton = document.getElementById('saveButton');
  const errorMessage = document.getElementById('errorMessage');
  const searchInput = document.getElementById('search');
  const taskList = document.getElementById('taskList');

  // Initialize variables to manage edit mode and the index of the current task being edited
  let isEditMode = false;
  let currentTaskIndex = -1;

  // Add event listeners to buttons and search input
  addButton.addEventListener('click', addTask);
  saveButton.addEventListener('click', saveTask);

  //as user releases his key, searchTasks call ho jayega
  searchInput.addEventListener('keyup', searchTasks);

  // Function to add a new task to the task list
  function addTask() {
      // value milega
      const taskName = document.getElementById('taskName').value;
      const subtasks = document.querySelectorAll('.subtask');
      const startDate = document.getElementById('startDate').value;
      const endDate = document.getElementById('endDate').value;
      const status = document.getElementById('status').value;

      // Check if all required fields are filled
      if (!taskName || !startDate || !endDate || !status) {
          alert("All fields are required.")
          // errorMessage.textContent = 'All fields are required.';
          return;
      }

      // Check if endDate is before or equal to startDate
      if (new Date(endDate) <= new Date(startDate)) {
         alert("End date must be after start date")
         // errorMessage.textContent = 'End date must be after start date.';
         return;
      
  }

  // Check if startDate is before today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(startDate) < today) {
    alert("Start date cannot be in the past")

      // errorMessage.textContent = 'Start date cannot be in the past.';
      return;
  }

      // Gather subtask data
      const subtaskList = Array.from(subtasks).map(subtask => subtask.value);

      // Create a new task object
      const task = {
          taskName,
          subtasks: subtaskList,
          startDate,
          endDate,
          status
      };

      // New row in the table to display the task
      //jo bhi tr mein hai , use table miein daalo
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

      // Add event listener for the edit button of the new row
      const editButton = row.querySelector('.editButton');
      editButton.addEventListener('click', () => editTask(task, row));

      // Add event listener for the delete button of the new row
      const deleteButton = row.querySelector('.deleteButton');
      deleteButton.addEventListener('click', () => deleteTask(row));

      // Append the new row to the task list table
      taskList.appendChild(row);

      // Clear the form inputs after adding the task
      clearForm();

      // Hide the save button and show the add button again
      addButton.style.display = 'inline-block';
      saveButton.style.display = 'none';

      // Clear any previous error messages
      errorMessage.textContent = '';
  }

  // Function to enter edit mode and populate the form with the task data
  function editTask(task, row) {
      // Set edit mode to true and save the index of the current task being edited
      isEditMode = true;
      currentTaskIndex = row.rowIndex - 1;

      // Populate the form inputs with the task data for editing
      document.getElementById('taskName').value = task.taskName;
      const subtasks = document.querySelectorAll('.subtask');
      task.subtasks.forEach((subtask, index) => {
          subtasks[index].value = subtask;
      });
      document.getElementById('startDate').value = task.startDate;
      document.getElementById('endDate').value = task.endDate;
      document.getElementById('status').value = task.status;

      // Hide the add button and show the save button
      addButton.style.display = 'none';
      saveButton.style.display = 'inline-block';
  }

  // Function to save the edited task and update it in the table
  function saveTask() {
      // Gather form data again after editing
      const taskName = document.getElementById('taskName').value;
      const subtasks = document.querySelectorAll('.subtask');
      const startDate = document.getElementById('startDate').value;
      const endDate = document.getElementById('endDate').value;
      const status = document.getElementById('status').value;

      // Check if all required fields are filled
      if (!taskName || !startDate || !endDate || !status) {
          errorMessage.textContent = 'All fields are required.';
          return;
      }

      // Gather subtask data
      const subtaskList = Array.from(subtasks).map(subtask => subtask.value);

      // Create a new task object with the edited data
      const task = {
          taskName,
          subtasks: subtaskList,
          startDate,
          endDate,
          status
      };

      // Update the edited task in the table
      const rows = document.querySelectorAll('#taskList tr');
      if (currentTaskIndex >= 0 && currentTaskIndex < rows.length) {
          const row = rows[currentTaskIndex];
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

          // Event listener for the edit button of the edited row
          const editButton = row.querySelector('.editButton');
          editButton.addEventListener('click', () => editTask(task, row));

          // Add event listener for the delete button of the edited row
          const deleteButton = row.querySelector('.deleteButton');
          deleteButton.addEventListener('click', () => deleteTask(row));

          // Clear the form inputs after saving the task
          clearForm();

          // Hide the save button and show the add button again
          addButton.style.display = 'inline-block';
          saveButton.style.display = 'none';

          // Set edit mode to false and reset the current task index
          isEditMode = false;
          currentTaskIndex = -1;
      }

      // Clear any previous error messages
      errorMessage.textContent = '';
  }

  // Function to delete a task from the table
  function deleteTask(row) {
      if (row) {
          // Remove the row from the table
          
      confirm("ARE YOU SURE?")
          row.remove();
      }
  }

  // Function to search tasks based on the search input value
  function searchTasks() {
      const query = searchInput.value.toLowerCase();
      //tr k andar sab ko search karega
      const rows = document.querySelectorAll('#taskList tr');

      rows.forEach(row => {
          // Get the task name and status from each row and convert to lowercase for case-insensitive search
          const taskName = row.children[0].textContent.toLowerCase();
          const status = row.children[4].textContent.toLowerCase();

          // Check if the task name or status includes the search query
          if (taskName.includes(query) || status.includes(query)) {
              // If the search query matches, show the row
              row.style.display = '';
          } else {
              // If the search query does not match, hide the row
              row.style.display = 'none';
          }
      });
  }

  // Function to clear the form inputs
  function clearForm() {
      document.getElementById('taskName').value = '';
      const subtasks = document.querySelectorAll('.subtask');
      //calls function once for each element
      //ek hi baar mein sab nikal do
      subtasks.forEach(subtask => {
          subtask.value = '';
      });
      document.getElementById('startDate').value = '';
      document.getElementById('endDate').value = '';
      document.getElementById('status').value = '';
  }
});
