// Mảng lưu danh sách sinh viên
let students = [];

// Lấy các phần tử DOM
const inputName = document.getElementById('inputName');
const inputScore = document.getElementById('inputScore');
const btnAdd = document.getElementById('btnAdd');
const tableBody = document.getElementById('tableBody');
const stats = document.getElementById('stats');

// Hàm tính xếp loại
function getGrade(score) {
    if (score >= 8.5) return 'Giỏi';
    if (score >= 7.0) return 'Khá';
    if (score >= 5.0) return 'Trung bình';
    return 'Yếu';
}

// Hàm vẽ lại bảng
function renderTable() {
    tableBody.innerHTML = '';

    students.forEach(function(sv, index) {
        const tr = document.createElement('tr');

        // Tô vàng nếu điểm yếu
        if (sv.score < 5.0) {
            tr.classList.add('weak');
        }

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${sv.name}</td>
            <td>${sv.score}</td>
            <td>${getGrade(sv.score)}</td>
            <td><button class="btn-delete" data-index="${index}">Xóa</button></td>
        `;

        tableBody.appendChild(tr);
    });

    updateStats();
}

// Hàm cập nhật thống kê
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

    // Validate
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

    // Thêm vào mảng
    students.push({ name, score });

    // Render lại bảng
    renderTable();

    // Reset input
    inputName.value = '';
    inputScore.value = '';
    inputName.focus();
}

// Sự kiện nút Thêm
btnAdd.addEventListener('click', addStudent);

// Nhấn Enter ở ô Điểm để thêm
inputScore.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') addStudent();
});

// Event Delegation — xử lý nút Xóa
tableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-delete')) {
        const index = parseInt(e.target.getAttribute('data-index'));
        students.splice(index, 1); // Xóa khỏi mảng
        renderTable();
    }
});