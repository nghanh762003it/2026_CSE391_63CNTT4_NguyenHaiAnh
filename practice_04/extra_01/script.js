// Hàm tiện ích hiển thị lỗi
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    if (field) {
        field.classList.remove('valid');
        field.classList.add('invalid');
    }
    error.textContent = message;
}

// Hàm tiện ích xóa lỗi
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    if (field) {
        field.classList.remove('invalid');
        field.classList.add('valid');
    }
    error.textContent = '';
}

// ===== Các hàm validate từng trường =====

function validateFullname() {
    const val = document.getElementById('fullname').value.trim();
    const regex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (val === '') {
        showError('fullname', 'Họ tên không được để trống!');
        return false;
    }
    if (val.length < 3) {
        showError('fullname', 'Họ tên phải có ít nhất 3 ký tự!');
        return false;
    }
    if (!regex.test(val)) {
        showError('fullname', 'Họ tên chỉ được chứa chữ cái và khoảng trắng!');
        return false;
    }
    if (val.length > 50) {
        showError('fullname', 'Họ tên không được quá 50 ký tự!');
        return false;
    }
    clearError('fullname');
    return true;
}

function validateEmail() {
    const val = document.getElementById('email').value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val === '') {
        showError('email', 'Email không được để trống!');
        return false;
    }
    if (!regex.test(val)) {
        showError('email', 'Email không đúng định dạng (vd: name@domain.com)!');
        return false;
    }
    clearError('email');
    return true;
}

function validatePhone() {
    const val = document.getElementById('phone').value.trim();
    const regex = /^0[0-9]{9}$/;
    if (val === '') {
        showError('phone', 'Số điện thoại không được để trống!');
        return false;
    }
    if (!regex.test(val)) {
        showError('phone', 'SĐT phải có 10 chữ số và bắt đầu bằng 0!');
        return false;
    }
    clearError('phone');
    return true;
}

function validatePassword() {
    const val = document.getElementById('password').value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (val === '') {
        showError('password', 'Mật khẩu không được để trống!');
        return false;
    }
    if (!regex.test(val)) {
        showError('password', 'Mật khẩu ≥ 8 ký tự, có chữ hoa, chữ thường và số!');
        return false;
    }
    clearError('password');
    return true;
}

function validateConfirmPassword() {
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (confirm === '') {
        showError('confirmPassword', 'Vui lòng xác nhận mật khẩu!');
        return false;
    }
    if (pass !== confirm) {
        showError('confirmPassword', 'Mật khẩu xác nhận không khớp!');
        return false;
    }
    clearError('confirmPassword');
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

function validateTerms() {
    const checked = document.getElementById('terms').checked;
    if (!checked) {
        document.getElementById('termsError').textContent = 'Vui lòng đồng ý với điều khoản!';
        return false;
    }
    document.getElementById('termsError').textContent = '';
    return true;
}

// ===== Validate blur từng trường =====
document.getElementById('fullname').addEventListener('blur', validateFullname);
document.getElementById('email').addEventListener('blur', validateEmail);
document.getElementById('phone').addEventListener('blur', validatePhone);
document.getElementById('password').addEventListener('blur', validatePassword);
document.getElementById('confirmPassword').addEventListener('blur', validateConfirmPassword);

// ===== Xóa lỗi khi nhập lại =====
document.getElementById('fullname').addEventListener('input', () => clearError('fullname'));
document.getElementById('email').addEventListener('input', () => clearError('email'));
document.getElementById('phone').addEventListener('input', () => clearError('phone'));
document.getElementById('password').addEventListener('input', () => clearError('password'));
document.getElementById('confirmPassword').addEventListener('input', () => clearError('confirmPassword'));

// ===== Xử lý submit =====
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Dùng & để đảm bảo TẤT CẢ đều được gọi, không dừng sớm
    const isValid =
        validateFullname() &
        validateEmail() &
        validatePhone() &
        validatePassword() &
        validateConfirmPassword() &
        validateGender() &
        validateTerms();

    if (isValid) {
        const name = document.getElementById('fullname').value.trim();

        // Ẩn form, hiện thông báo thành công
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('successName').textContent = name;
        document.getElementById('successMessage').style.display = 'block';
    }
});
// ===== Đếm ký tự họ tên =====
document.getElementById('fullname').addEventListener('input', function () {
    const len = this.value.length;
    const counter = document.getElementById('fullnameCount');
    counter.textContent = len + '/50';
    if (len > 50) {
        counter.classList.add('over');
    } else {
        counter.classList.remove('over');
    }
});

// ===== Toggle hiện/ẩn mật khẩu =====
document.getElementById('togglePassword').addEventListener('click', function () {
    const input = document.getElementById('password');
    if (input.type === 'password') {
        input.type = 'text';
        this.textContent = '🙈';
    } else {
        input.type = 'password';
        this.textContent = '👁';
    }
});

document.getElementById('toggleConfirm').addEventListener('click', function () {
    const input = document.getElementById('confirmPassword');
    if (input.type === 'password') {
        input.type = 'text';
        this.textContent = '🙈';
    } else {
        input.type = 'password';
        this.textContent = '👁';
    }
});

// ===== Password Strength Bar =====
document.getElementById('password').addEventListener('input', function () {
    const val = this.value;
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');

    const hasLower = /[a-z]/.test(val);
    const hasUpper = /[A-Z]/.test(val);
    const hasNumber = /\d/.test(val);
    const isLongEnough = val.length >= 8;

    // Xóa class cũ
    fill.className = 'strength-fill';
    text.className = 'strength-text';

    if (val.length === 0) {
        fill.style.width = '0%';
        text.textContent = '';
        return;
    }

    const score = [hasLower, hasUpper, hasNumber, isLongEnough]
        .filter(Boolean).length;

    if (score <= 2) {
        fill.classList.add('weak');
        text.classList.add('weak');
        text.textContent = '🔴 Yếu';
    } else if (score === 3) {
        fill.classList.add('medium');
        text.classList.add('medium');
        text.textContent = '🟡 Trung bình';
    } else {
        fill.classList.add('strong');
        text.classList.add('strong');
        text.textContent = '🟢 Mạnh';
    }
});