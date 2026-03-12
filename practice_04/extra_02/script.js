let currentStep = 1;

// ===== Tiện ích =====
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    if (field) {
        field.classList.remove('valid');
        field.classList.add('invalid');
    }
    if (error) error.textContent = message;
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    if (field) {
        field.classList.remove('invalid');
        field.classList.add('valid');
    }
    if (error) error.textContent = '';
}

// ===== Cập nhật progress bar =====
function updateProgress(step) {
    for (let i = 1; i <= 3; i++) {
        const indicator = document.getElementById('indicator' + i);
        indicator.classList.remove('active', 'done');
        if (i < step) indicator.classList.add('done');
        if (i === step) indicator.classList.add('active');
    }
    for (let i = 1; i <= 2; i++) {
        const line = document.getElementById('line' + i);
        line.classList.toggle('done', i < step);
    }
}

// ===== Hiện bước =====
function showStep(step) {
    document.querySelectorAll('.step').forEach(s => s.style.display = 'none');
    document.getElementById('step' + step).style.display = 'block';
    updateProgress(step);
    currentStep = step;
}

// ===== Validate Bước 1 =====
function validateFullname() {
    const val = document.getElementById('fullname').value.trim();
    const regex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (val === '') { showError('fullname', 'Họ tên không được để trống!'); return false; }
    if (val.length < 3) { showError('fullname', 'Họ tên phải có ít nhất 3 ký tự!'); return false; }
    if (!regex.test(val)) { showError('fullname', 'Họ tên chỉ chứa chữ cái và khoảng trắng!'); return false; }
    clearError('fullname');
    return true;
}

function validateDob() {
    const val = document.getElementById('dob').value;
    if (val === '') { showError('dob', 'Vui lòng chọn ngày sinh!'); return false; }
    const today = new Date();
    const selected = new Date(val);
    if (selected >= today) { showError('dob', 'Ngày sinh phải là ngày trong quá khứ!'); return false; }
    clearError('dob');
    return true;
}

function validateGender() {
    const selected = document.querySelector('input[name="gender"]:checked');
    if (!selected) {
        document.getElementById('genderError').textContent = 'Vui lòng chọn giới tính!';
        return false;
    }
    document.getElementById('genderError').textContent = '';
    return true;
}

// ===== Validate Bước 2 =====
function validateEmail() {
    const val = document.getElementById('email').value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val === '') { showError('email', 'Email không được để trống!'); return false; }
    if (!regex.test(val)) { showError('email', 'Email không đúng định dạng!'); return false; }
    clearError('email');
    return true;
}

function validatePassword() {
    const val = document.getElementById('password').value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (val === '') { showError('password', 'Mật khẩu không được để trống!'); return false; }
    if (!regex.test(val)) { showError('password', 'Mật khẩu ≥ 8 ký tự, có chữ hoa, chữ thường và số!'); return false; }
    clearError('password');
    return true;
}

function validateConfirmPassword() {
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (confirm === '') { showError('confirmPassword', 'Vui lòng xác nhận mật khẩu!'); return false; }
    if (pass !== confirm) { showError('confirmPassword', 'Mật khẩu xác nhận không khớp!'); return false; }
    clearError('confirmPassword');
    return true;
}

// ===== Hiện thông tin xác nhận =====
function showConfirmInfo() {
    const name = document.getElementById('fullname').value.trim();
    const dob = document.getElementById('dob').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const email = document.getElementById('email').value.trim();

    document.getElementById('confirmInfo').innerHTML = `
        <p>👤 <strong>Họ tên:</strong> ${name}</p>
        <p>🎂 <strong>Ngày sinh:</strong> ${dob}</p>
        <p>⚧ <strong>Giới tính:</strong> ${gender}</p>
        <p>📧 <strong>Email:</strong> ${email}</p>
    `;

    document.getElementById('successName').textContent = name;
}

// ===== Sự kiện các nút =====

// Bước 1 → Bước 2
document.getElementById('btnNext1').addEventListener('click', function() {
    const isValid =
        validateFullname() &
        validateDob() &
        validateGender();
    if (isValid) showStep(2);
});

// Bước 2 → Bước 1
document.getElementById('btnBack2').addEventListener('click', function() {
    showStep(1);
});

// Bước 2 → Bước 3
document.getElementById('btnNext2').addEventListener('click', function() {
    const isValid =
        validateEmail() &
        validatePassword() &
        validateConfirmPassword();
    if (isValid) {
        showConfirmInfo();
        showStep(3);
    }
});

// Bước 3 → Bước 2
document.getElementById('btnBack3').addEventListener('click', function() {
    showStep(2);
});

// Hoàn tất
document.getElementById('btnSubmit').addEventListener('click', function() {
    document.querySelectorAll('.step').forEach(s => s.style.display = 'none');
    document.getElementById('successMessage').style.display = 'block';
});

// ===== Blur validation =====
document.getElementById('fullname').addEventListener('blur', validateFullname);
document.getElementById('dob').addEventListener('blur', validateDob);
document.getElementById('email').addEventListener('blur', validateEmail);
document.getElementById('password').addEventListener('blur', validatePassword);
document.getElementById('confirmPassword').addEventListener('blur', validateConfirmPassword);

// ===== Xóa lỗi khi nhập lại =====
document.getElementById('fullname').addEventListener('input', () => clearError('fullname'));
document.getElementById('email').addEventListener('input', () => clearError('email'));
document.getElementById('password').addEventListener('input', () => clearError('password'));
document.getElementById('confirmPassword').addEventListener('input', () => clearError('confirmPassword'));