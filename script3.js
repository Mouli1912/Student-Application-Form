// Elements
const studentForm = document.getElementById("studentForm");
const studentsTableBody = document.querySelector("#studentsTable tbody");

// Retrieve students from local storage
const getStudentsFromStorage = () => {
    return JSON.parse(localStorage.getItem("students")) || [];
};

// Save students to local storage
function saveStudentsToStorage(students) {
    localStorage.setItem("students", JSON.stringify(students));
}

// Render students in the table
const renderStudents = () => {
    const students = getStudentsFromStorage();
    studentsTableBody.innerHTML = ""; // Clear existing table rows

    students.forEach((student, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td contenteditable="false">${student.name}</td>
            <td contenteditable="false">${student.id}</td>
            <td contenteditable="false">${student.email}</td>
            <td contenteditable="false">${student.contact}</td>
            <td>
                <button class="edit" data-index="${index}">Edit</button>
                <button class="delete" data-index="${index}">Delete</button>
            </td>
        `;

        studentsTableBody.appendChild(row);
    });
};

// Validate input fields
const validateInput = (name, id, email, contact) => {
    const nameRegex = /^[A-Za-z\s]+$/; // Only characters and spaces
    const idRegex = /^[0-9]+$/; // Only numbers
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
    const contactRegex = /^[0-9]+$/; // Only numbers

    if (!nameRegex.test(name)) {
        alert("Name should contain only alphabets.");
        return false;
    }
    if (!idRegex.test(id)) {
        alert("Student ID should contain only numbers.");
        return false;
    }
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }
    if (!contactRegex.test(contact)) {
        alert("Contact should contain only numbers.");
        return false;
    }
    return true;
};

// Add a new student
const addStudent = (event) => {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const id = document.getElementById("studentId").value.trim();
    const email = document.getElementById("email").value.trim();
    const contact = document.getElementById("contact").value.trim();

    if (!validateInput(name, id, email, contact)) return;

    const newStudent = { name, id, email, contact };
    const students = getStudentsFromStorage();
    students.push(newStudent);
    saveStudentsToStorage(students);

    studentForm.reset(); // Clear the form
    renderStudents(); // Re-render the table
};

// Edit a student directly in the table
const toggleEditSave = (button, index) => {
    const row = button.closest("tr");
    const cells = row.querySelectorAll("td:not(:last-child)");
    const students = getStudentsFromStorage();

    if (button.textContent === "Edit") {
        cells.forEach((cell) => (cell.contentEditable = "true"));
        button.textContent = "Save";
        button.classList.add("save");
    } else {
        // Save changes
        const updatedStudent = {
            name: cells[0].textContent.trim(),
            id: cells[1].textContent.trim(),
            email: cells[2].textContent.trim(),
            contact: cells[3].textContent.trim(),
        };

        if (!validateInput(updatedStudent.name, updatedStudent.id, updatedStudent.email, updatedStudent.contact)) return;

        students[index] = updatedStudent;
        saveStudentsToStorage(students);
        cells.forEach((cell) => (cell.contentEditable = "false"));
        button.textContent = "Edit";
        button.classList.remove("save");
        renderStudents();
    }
};

// Delete a student
const deleteStudent = (index) => {
    const students = getStudentsFromStorage();
    students.splice(index, 1);
    saveStudentsToStorage(students);
    renderStudents();
};

// Handle table actions (edit/save/delete)
studentsTableBody.addEventListener("click", (event) => {
    const target = event.target;
    const index = target.getAttribute("data-index");

    if (target.classList.contains("edit")) {
        toggleEditSave(target, index);
    } else if (target.classList.contains("delete")) {
        deleteStudent(index);
    }
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    renderStudents();
});

// Form submit listener
studentForm.addEventListener("submit", addStudent);
