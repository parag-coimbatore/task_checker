// Wait for the DOM content to be fully loaded before executing the code
document.addEventListener('DOMContentLoaded', function () {

    // Get references to various elements in the HTML using their IDs
    const addButton = document.getElementById('addButton');
    const saveButton = document.getElementById('saveButton');
    const errorMessage = document.getElementById('errorMessage');
    const searchInput = document.getElementById('search');
    const taskList = document.getElementById('taskList');

    // Variables to keep track of the application state
    let isEditMode = false;         // Flag to indicate if the form is in "Edit" mode
    let currentTaskIndex = -1;      // Index of the currently edited task in the table
    let subtaskCounter = 1;         // Counter to keep track of the number of subtask inputs

    // Add event listeners to buttons and search input
    addButton.addEventListener('click', addTask);
    saveButton.addEventListener('click', saveTask);
    searchInput.addEventListener('keyup', searchTasks);

    // Function to add a new task
    function addTask() {
        // Get values from the form inputs
        const taskName = document.getElementById('taskName').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const status = document.getElementById('status').value;

        // Validate the form inputs
        if (!taskName || !startDate || !endDate || !status) {
            alert("All fields are required.");
            return;
        }

        if (new Date(endDate) <= new Date(startDate)) {
            alert("End date must be after the start date.");
            return;
        }

        // Get subtask values and create a task object
        const subtasks = document.querySelectorAll('.subtask');
        const subtaskList = Array.from(subtasks).map(subtask => subtask.value);

        const task = {
            taskName,
            subtasks: subtaskList,
            startDate,
            endDate,
            status
        };

        // Create a new row in the table to display the task
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

        // Add event listeners to the edit and delete buttons in the new row
        const editButton = row.querySelector('.editButton');
        editButton.addEventListener('click', () => editTask(task, row));

        const deleteButton = row.querySelector('.deleteButton');
        deleteButton.addEventListener('click', () => deleteTask(row));

        // Add the new row to the table
        taskList.appendChild(row);

        // Clear the form fields and error message after adding the task
        clearForm();
        errorMessage.textContent = '';
    }

    // Function to handle date changes and set status based on the dates
    function handleDateChange() {
        // Get references to the date and status input elements
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        const statusInput = document.getElementById('status');

        // Convert the input dates to JavaScript Date objects and get the current date
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        const today = new Date();

        // Set the minimum date attribute of the date inputs to today's date
        startDateInput.setAttribute("min", today.toISOString().split("T")[0]);
        endDateInput.setAttribute("min", today.toISOString().split("T")[0]);

        // Set the status based on the input dates
        if (startDate > today) {
            statusInput.value = "in-progress";
        } else if (endDate < today) {
            statusInput.value = "due-passed";
        } else {
            statusInput.value = "complete";
        }
    }

    // Get references to the date inputs and add event listeners to handle date changes
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    startDateInput.addEventListener('change', handleDateChange);
    endDateInput.addEventListener('change', handleDateChange);

    // Call the handleDateChange function initially to set the initial status based on dates
    handleDateChange();

    // Function to save a task (either add or update)
    function saveTask() {
        // Get values from the form inputs
        const taskName = document.getElementById('taskName').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const status = document.getElementById('status').value;

        // Validate the form inputs
        if (!taskName || !startDate || !endDate || !status) {
            errorMessage.textContent = 'All fields are required.';
            return;
        }

        if (new Date(endDate) <= new Date(startDate)) {
            errorMessage.textContent = 'End date must be after start date.';
            return;
        }

        // Get subtask values and create a task object
        const subtasks = document.querySelectorAll('.subtask');
        const subtaskList = Array.from(subtasks).map(subtask => subtask.value);

        const task = {
            taskName,
            subtasks: subtaskList,
            startDate,
            endDate,
            status
        };

        // If in edit mode, update the existing row, otherwise, add a new row
        if (isEditMode) {
            const rows = document.querySelectorAll('#taskList tr');
            const rowToUpdate = rows[currentTaskIndex];

            rowToUpdate.innerHTML = `
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

            // Update event listeners for edit and delete buttons
            const editButton = rowToUpdate.querySelector('.editButton');
            editButton.addEventListener('click', () => editTask(task, rowToUpdate));

            const deleteButton = rowToUpdate.querySelector('.deleteButton');
            deleteButton.addEventListener('click', () => deleteTask(rowToUpdate));

            // Switch back to "Add" mode after updating the row
            isEditMode = false;
            currentTaskIndex = -1;
            addButton.style.display = 'inline-block';
            saveButton.style.display = 'none';

            // Clear the form fields, subtask inputs, and error message after saving
            clearForm();
            clearSubtasks();
            errorMessage.textContent = '';
        } else {
            // Create a new row in the table to display the task
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

            // Add event listeners to the edit and delete buttons in the new row
            const editButton = row.querySelector('.editButton');
            editButton.addEventListener('click', () => editTask(task, row));

            const deleteButton = row.querySelector('.deleteButton');
            deleteButton.addEventListener('click', () => deleteTask(row));

            // Add the new row to the table
            taskList.appendChild(row);

            // Clear the form fields, subtask inputs, and error message after saving
            clearForm();
            clearSubtasks();
            errorMessage.textContent = '';
        }
    }

    // Function to edit a task
    function editTask(task, row) {
        // Enter "Edit" mode and store the index of the task being edited
        isEditMode = true;
        currentTaskIndex = row.rowIndex - 1;

        // Populate the form inputs with the values of the task being edited
        document.getElementById('taskName').value = task.taskName;
        document.getElementById('startDate').value = task.startDate;
        document.getElementById('endDate').value = task.endDate;
        document.getElementById('status').value = task.status;

        // Clear the subtask container before adding the subtask inputs
        const subtaskContainer = document.querySelector('.subtask-section');
        subtaskContainer.innerHTML = '';

        // Add the subtask inputs with the subtask values to the subtask container
        task.subtasks.forEach(subtask => {
            addSubtaskInput(subtask);
        });

        // Hide the "Add" button and display the "Save" button
        addButton.style.display = 'none';
        saveButton.style.display = 'inline-block';
    }

    // Function to delete a task
    function deleteTask(row) {
        if (row) {
            if (window.confirm("Are you sure you want to delete this task?")) {
                row.remove();
            }
        }
    }

    // Function to search for tasks based on the search input
    function searchTasks() {
        const query = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('#taskList tr');

        // Loop through each row in the table and hide/show based on the search query
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

    // Function to clear the form fields
    function clearForm() {
        document.getElementById('taskName').value = '';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        document.getElementById('status').value = '';
    }

    // Function to add a new subtask input field
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

        subtaskCounter++; // Increment the subtask counter for the next subtask
    }

    // Function to clear the subtask inputs
    function clearSubtasks() {
        const subtaskSection = document.querySelector('.subtask-section');
        subtaskSection.innerHTML = '';

        // Reset the subtask counter and add the initial subtask input field
        subtaskCounter = 1;
        addSubtaskInput();

        // Add event listener to the "Add" button for adding more subtask inputs
        const addButton = document.querySelector('.addSubtaskButton');
        addButton.addEventListener('click', () => addSubtaskInput());
    }

    // Call the function to clear subtasks on page load
    clearSubtasks();
});
