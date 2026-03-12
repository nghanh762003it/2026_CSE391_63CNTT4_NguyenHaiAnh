let students = [];          // Mảng gốc
let filteredStudents = [];  // Mảng sau khi lọc
let sortDirection = null;   // null | 'asc' | 'desc'

// Lấy DOM
const inputName = document.getElementById('inputName');
const inputScore = document.getElementById('inputScore');
const btnAdd = document.getElementById('btnAdd');
const tableBody = document.getElementById('tableBody');
const stats = document.getElementById('stats');
const searchInput = document.getElementById('searchInput');
const filterGrade = document.getElementById('filterGrade');
const scoreHeader = document.getElementById('scoreHeader');
const sortArrow = document.getElementById('sortArrow');

// Hàm tính xếp loại
function getGrade(score) {
    if (score >= 8.5) return 'Giỏi';
    if (score >= 7.0) return 'Khá';
    if (score >= 5.0) return 'Trung bình';
    return 'Yếu';
}

// Hàm áp dụng tất cả bộ lọc
function applyFilters() {
    const keyword = searchInput.value.trim().toLowerCase();
    const grade = filterGrade.value;

    // Bước 1: Lọc từ mảng gốc
    filteredStudents = students.filter(function(sv) {
        const matchName = sv.name.toLowerCase().includes(keyword);
        const matchGrade = grade === 'all' || getGrade(sv.score) === grade;
        return matchName && matchGrade;
    });

    // Bước 2: Sắp xếp nếu có
    if (sortDirection === 'asc') {
        filteredStudents.sort((a, b) => a.score - b.score);
    } else if (sortDirection === 'desc') {
        filteredStudents.sort((a, b) => b.score - a.score);
    }

    // Bước 3: Render
    renderTable();
}

// Hàm vẽ bảng
function renderTable() {
    tableBody.innerHTML = '';

    if (filteredStudents.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="no-result">Không có kết quả</td></tr>';
        return;
    }

    filteredStudents.forEach(function(sv, index) {
        const tr = document.createElement('tr');
        if (sv.score < 5.0) tr.classList.add('weak');

        // Tìm index gốc trong mảng students để xóa đúng
        const originalIndex = students.indexOf(sv);

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${sv.name}</td>
            <td>${sv.score}</td>
            <td>${getGrade(sv.score)}</td>
            <td><button class="btn-delete" data-index="${originalIndex}">Xóa</button></td>
        `;
        tableBody.appendChild(tr);
    });
}

// Hàm cập nhật thống kê (luôn tính từ mảng gốc)
function updateStats() {
    const total = students.length;
    const avg = total === 0 ? 0 :
        students.reduce((sum, sv) => sum + sv.score, 0) / total;
    stats.textContent = `Tổng: ${total} sinh viên | Điểm TB: ${avg.toFixed(2)}`;
}

// Hàm thêm sinh viên
function addStudent() {
    const name = inputName.value.trim();
    const score = parseFloat(inputScore.value);

    if (name === '') {
        alert('Vui lòng nhập họ tên!');
        inputName.focus();
        return;
    }
    if (isNaN(score) || score < 0 || score > 10) {
        alert('Điểm không hợp lệ! Vui lòng nhập số từ 0 đến 10.');
        inputScore.focus();
        return;
    }

    students.push({ name, score });
    inputName.value = '';
    inputScore.value = '';
    inputName.focus();

    updateStats();
    applyFilters();
}

// Sự kiện thêm
btnAdd.addEventListener('click', addStudent);
inputScore.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') addStudent();
});

// Sự kiện tìm kiếm realtime
searchInput.addEventListener('input', applyFilters);

// Sự kiện lọc xếp loại
filterGrade.addEventListener('change', applyFilters);

// Sự kiện sắp xếp theo điểm
scoreHeader.addEventListener('click', function() {
    if (sortDirection === null || sortDirection === 'desc') {
        sortDirection = 'asc';
        sortArrow.textContent = ' ▲';
    } else {
        sortDirection = 'desc';
        sortArrow.textContent = ' ▼';
    }
    applyFilters();
});

// Sự kiện xóa (Event Delegation)
tableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-delete')) {
        const index = parseInt(e.target.getAttribute('data-index'));
        students.splice(index, 1);
        updateStats();
        applyFilters();
    }
});