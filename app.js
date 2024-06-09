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

// Function to set a cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie
function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

// Function to delete a cookie
function deleteCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999;";
}
// Function to check if access token is expired
function isTokenExpired(accessToken) {
    if (!accessToken) return true; // Token is not valid if it's null or undefined
    const decodedToken = parseJwt(accessToken);
    if (!decodedToken || !decodedToken.exp) return true; // Invalid token or no expiry time
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decodedToken.exp < currentTime; // Compare expiry time with current time
}

// Function to parse JWT token
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}