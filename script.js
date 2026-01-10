// State
let students = JSON.parse(localStorage.getItem('cu_students')) || [];
let deleteTargetRoll = null;

// Data
const courseData = [
    { title: "B.Tech", duration: "4 Years", icon: "fa-laptop-code", code: "CSE" },
    { title: "BBA", duration: "3 Years", icon: "fa-briefcase", code: "MGT" },
    { title: "BCA", duration: "3 Years", icon: "fa-desktop", code: "CMP" },
    { title: "B.Com (Hons)", duration: "3 Years", icon: "fa-chart-line", code: "COM" },
    { title: "BA-LLB", duration: "5 Years", icon: "fa-scale-balanced", code: "LAW" }
];

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
    renderStudents();
    renderCourses();
    setupDate();
});

// Navigation
function showSection(id) {
    // Hide all
    document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    // Show Target
    document.getElementById(id).classList.add('active');

    // Update Header
    const titles = {
        'dashboard': 'Dashboard',
        'students': 'Student Directory',
        'courses': 'Course Management'
    };
    document.getElementById('page-header').textContent = titles[id];

    // Update Nav Activity
    const navMap = {
        'dashboard': 0,
        'students': 1,
        'courses': 2
    };
    document.querySelectorAll('.nav-item')[navMap[id]].classList.add('active');
}

// Logic: Add / Update / Delete
const studentForm = document.getElementById('student-form');

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const roll = parseInt(document.getElementById('roll').value);
    const cgpa = parseFloat(document.getElementById('cgpa').value);
    const coursesStr = document.getElementById('courses-input').value;
    const courses = coursesStr.trim().split(/\s+/).map(Number).slice(0, 5); // Take first 5

    const editIndex = parseInt(document.getElementById('edit-index').value);

    // Validation
    if (courses.length === 0 || courses.some(isNaN)) {
        alert("Please enter valid numeric course IDs");
        return;
    }

    if (editIndex === -1) {
        // Add Mode
        // Check Uniqueness
        if (students.some(s => s.roll === roll)) {
            alert("Roll number already exists!");
            return;
        }

        const newStudent = { fname, lname, roll, cgpa, courses };
        students.push(newStudent);
    } else {
        // Edit Mode
        // If roll changed, check uniqueness
        if (students[editIndex].roll !== roll && students.some(s => s.roll === roll)) {
            alert("Roll number already exists!");
            return;
        }

        students[editIndex] = { fname, lname, roll, cgpa, courses };
    }

    saveData();
    closeModal();
    updateDashboard();
    renderStudents();
    studentForm.reset();
});

function deleteStudent(roll) {
    deleteTargetRoll = roll;
    document.getElementById('delete-modal').classList.add('active');
}

document.getElementById('confirm-delete-btn').addEventListener('click', () => {
    if (deleteTargetRoll !== null) {
        students = students.filter(s => s.roll !== deleteTargetRoll);
        saveData();
        updateDashboard();
        renderStudents();
        closeDeleteModal();
    }
});

function editStudent(roll) {
    const index = students.findIndex(s => s.roll === roll);
    if (index === -1) return;

    const s = students[index];

    document.getElementById('fname').value = s.fname;
    document.getElementById('lname').value = s.lname;
    document.getElementById('roll').value = s.roll;
    document.getElementById('cgpa').value = s.cgpa;
    document.getElementById('courses-input').value = s.courses.join(' ');
    document.getElementById('edit-index').value = index;
    document.getElementById('modal-title').innerText = "Edit Student";

    openModal();
}

// UI Rendering
function renderStudents(filteredList = null) {
    const list = filteredList || students;
    const grid = document.getElementById('students-grid');
    grid.innerHTML = '';

    list.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="student-avatar">${student.fname.charAt(0)}${student.lname.charAt(0)}</div>
                <span class="cgpa-badge">CGPA: ${student.cgpa.toFixed(2)}</span>
            </div>
            <div class="student-name">
                <h3>${student.fname} ${student.lname}</h3>
                <div class="student-roll">Roll No: ${student.roll}</div>
            </div>
            <div class="card-details">
                <strong>Courses:</strong> ${student.courses.join(', ')}
            </div>
            <div class="card-actions">
                <button class="btn-card" onclick="editStudent(${student.roll})">
                    <i class="fa-solid fa-pen"></i> Edit
                </button>
                <button class="btn-card delete" onclick="deleteStudent(${student.roll})">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    // Populate Table for Dashboard
    const tbody = document.getElementById('recent-table-body');
    if (tbody) {
        tbody.innerHTML = '';
        // Show last 5
        const recent = [...students].reverse().slice(0, 5);
        recent.forEach(s => {
            const row = `
                <tr>
                    <td>#${s.roll}</td>
                    <td>${s.fname} ${s.lname}</td>
                    <td>${s.courses.join(', ')}</td>
                    <td><b>${s.cgpa}</b></td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }
}

function updateDashboard() {
    document.getElementById('total-count-dash').innerText = students.length;

    const totalCGPA = students.reduce((acc, curr) => acc + curr.cgpa, 0);
    const avg = students.length ? (totalCGPA / students.length).toFixed(2) : "0.00";
    document.getElementById('avg-cgpa').innerText = avg;
}

function filterStudents() {
    const query = document.getElementById('start-search').value.toLowerCase();

    const filtered = students.filter(s => {
        const fullName = `${s.fname} ${s.lname}`.toLowerCase();
        return fullName.includes(query) || s.roll.toString().includes(query);
    });

    renderStudents(filtered);
}

function renderCourses() {
    const grid = document.getElementById('courses-grid');
    if (!grid) return;

    grid.innerHTML = '';

    courseData.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <div class="course-img-area">
                <i class="fa-solid ${course.icon}"></i>
            </div>
            <div class="course-info">
                <h3>${course.title}</h3>
                <div class="course-meta">
                    <span><i class="fa-regular fa-clock"></i> ${course.duration}</span>
                    <span><i class="fa-solid fa-tag"></i> ${course.code}</span>
                </div>
                <p class="course-desc">Premium undergraduate program designed for future leaders in the field of ${course.title}.</p>
                <button class="btn-outline">View Details</button>
            </div>
        `;
        grid.appendChild(card);
    });
}


// Utility
function saveData() {
    localStorage.setItem('cu_students', JSON.stringify(students));
}

function openAddModal() {
    document.getElementById('student-form').reset();
    document.getElementById('edit-index').value = -1;
    document.getElementById('modal-title').innerText = "Add New Student";
    openModal();
}

function openModal() {
    document.getElementById('student-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('student-modal').classList.remove('active');
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('active');
}

function setupDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', options);
}
