const accessToken = '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'; // Replace with your GitHub access token
const filePath = 'employees.json'; // Path to your JSON file in the GitHub repository

// Function to fetch employees from JSON file
async function fetchEmployees() {
    try {
        const response = await fetchJsonFile(filePath);
        return response;
    } catch (error) {
        console.error('Error fetching employees:', error);
        return [];
    }
}

// Function to add a new employee
async function addEmployee(employeeData) {
    try {
        const employees = await fetchEmployees();
        employees.push(employeeData);
        await updateJsonFile(filePath, employees, accessToken);
        return true;
    } catch (error) {
        console.error('Error adding employee:', error);
        return false;
    }
}

// Function to update an employee
async function updateEmployee(index, updatedEmployeeData) {
    try {
        const employees = await fetchEmployees();
        employees[index] = updatedEmployeeData;
        await updateJsonFile(filePath, employees, accessToken);
        return true;
    } catch (error) {
        console.error('Error updating employee:', error);
        return false;
    }
}

// Function to delete an employee
async function deleteEmployee(index) {
    try {
        const employees = await fetchEmployees();
        employees.splice(index, 1);
        await updateJsonFile(filePath, employees, accessToken);
        return true;
    } catch (error) {
        console.error('Error deleting employee:', error);
        return false;
    }
}

// Function to read JSON file from GitHub
async function fetchJsonFile(filePath) {
    console.log(filePath)
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: 'rakeshine',
        repo: 'spk',
        path: filePath,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
    if (!response.ok) {
        throw new Error(`Failed to read file: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

// Function to update JSON file on GitHub
async function updateJsonFile(filePath, data) {
    console.log(filePath)
    const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: 'rakeshine',
        repo: 'spk',
        path: filePath,
        message: 'my commit message',
        committer: {
          name: 'Teste',
          email: 'rakeshine@github.com'
        },
        content: JSON.stringify(btoa(JSON.stringify(data, null, 2))),
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })

    if (!response.ok) {
        throw new Error(`Failed to update file: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

$(document).ready(function() {
    function fetchEmployees() {
        fetchEmployees()
            .then(response => response.json())
            .then(data => {
                const rows = data.values.slice(1); // Skip header row
                $('#employee-table').DataTable({
                    data: rows,
                    columns: [
                        { title: "ID" },
                        { title: "Name" },
                        { title: "Phone" },
                        { title: "Company" },
                        { title: "Action", orderable: false, searchable: false } // New column for actions
                    ],
                    createdRow: function(row, data, index) {
                        const viewButton = `<button type="button" class="btn btn-primary btn-sm" onclick="editEmployee(${index})">View</button>`;
                        const editButton = `<button type="button" class="btn btn-primary btn-sm" onclick="editEmployee(${index})">Edit</button>`;
                        const deleteButton = `<button type="button" class="btn btn-danger btn-sm" onclick="deleteEmployee(${index})">Delete</button>`;
                        $('td', row).eq(-1).html(`${viewButton} ${editButton} ${deleteButton}`);
                    }
                });
            });
    }

    if ($('#employee-table').length) {
        fetchEmployees();
    }

    // Function to edit employee
    window.editEmployee = function(index) {
        // Redirect to the edit page with the employee index as a query parameter
        window.location.href = `edit-employee.html?index=${index}`;
    };

    // Function to view employee
    window.viewEmployee = function(index) {
        // Redirect to the view page with the employee index as a query parameter
        window.location.href = `view-employee.html?index=${index}`;
    };

    // Function to delete employee
    window.deleteEmployee = function(index) {
        // Here you would implement the logic to delete the employee
        alert(`Delete employee at index ${index}`);
    };
});
