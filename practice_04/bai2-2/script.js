// Giá sản phẩm
const prices = {
    "Áo": 150000,
    "Quần": 200000,
    "Giày": 350000,
    "Túi": 250000
};

// ===== Hàm tiện ích =====
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

// ===== Tính tổng tiền tự động =====
function updateTotal() {
    const product = document.getElementById('product').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalEl = document.getElementById('totalPrice');

    if (product && prices[product] && quantity > 0) {
        const total = prices[product] * quantity;
        totalEl.textContent = total.toLocaleString('vi-VN') + 'đ';
    } else {
        totalEl.textContent = '0đ';
    }
}

document.getElementById('product').addEventListener('change', updateTotal);
document.getElementById('quantity').addEventListener('input', updateTotal);

// ===== Đếm ký tự ghi chú =====
const noteEl = document.getElementById('note');
const noteCount = document.getElementById('noteCount');
const charCountEl = noteEl.nextElementSibling;

noteEl.addEventListener('input', function() {
    const len = this.value.length;
    noteCount.textContent = len;

    if (len > 200) {
        charCountEl.classList.add('over');
        showError('note', 'Ghi chú không được vượt quá 200 ký tự!');
    } else {
        charCountEl.classList.remove('over');
        clearError('note');
    }
});

// ===== Các hàm validate =====
function validateProduct() {
    const val = document.getElementById('product').value;
    if (val === '') {
        showError('product', 'Vui lòng chọn sản phẩm!');
        return false;
    }
    clearError('product');
    return true;
}

function validateQuantity() {
    const val = parseInt(document.getElementById('quantity').value);
    if (isNaN(val) || val < 1 || val > 99) {
        showError('quantity', 'Số lượng phải là số nguyên từ 1 đến 99!');
        return false;
    }
    clearError('quantity');
    return true;
}

function validateDeliveryDate() {
    const val = document.getElementById('deliveryDate').value;
    if (val === '') {
        showError('deliveryDate', 'Vui lòng chọn ngày giao hàng!');
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(val);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    maxDate.setHours(0, 0, 0, 0);

    if (selected < today) {
        showError('deliveryDate', 'Ngày giao không được là ngày trong quá khứ!');
        return false;
    }
    if (selected > maxDate) {
        showError('deliveryDate', 'Ngày giao không được quá 30 ngày từ hôm nay!');
        return false;
    }
    clearError('deliveryDate');
    return true;
}

function validateAddress() {
    const val = document.getElementById('address').value.trim();
    if (val === '') {
        showError('address', 'Địa chỉ không được để trống!');
        return false;
    }
    if (val.length < 10) {
        showError('address', 'Địa chỉ phải có ít nhất 10 ký tự!');
        return false;
    }
    clearError('address');
    return true;
}

function validateNote() {
    const val = document.getElementById('note').value;
    if (val.length > 200) {
        showError('note', 'Ghi chú không được quá 200 ký tự!');
        document.getElementById('note').classList.add('invalid');
        return false;
    }
    document.getElementById('note').classList.remove('invalid');
    document.getElementById('noteError').textContent = '';
    return true;
}

function validatePayment() {
    const selected = document.querySelector('input[name="payment"]:checked');
    if (!selected) {
        document.getElementById('paymentError').textContent = 'Vui lòng chọn phương thức thanh toán!';
        return false;
    }
    document.getElementById('paymentError').textContent = '';
    return true;
}

// ===== Blur validation =====
document.getElementById('product').addEventListener('blur', validateProduct);
document.getElementById('quantity').addEventListener('blur', validateQuantity);
document.getElementById('deliveryDate').addEventListener('blur', validateDeliveryDate);
document.getElementById('address').addEventListener('blur', validateAddress);

// ===== Xóa lỗi khi nhập lại =====
document.getElementById('product').addEventListener('change', () => clearError('product'));
document.getElementById('quantity').addEventListener('input', () => clearError('quantity'));
document.getElementById('deliveryDate').addEventListener('input', () => clearError('deliveryDate'));
document.getElementById('address').addEventListener('input', () => clearError('address'));

// ===== Xử lý submit =====
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const isValid =
        validateProduct() &
        validateQuantity() &
        validateDeliveryDate() &
        validateAddress() &
        validateNote() &
        validatePayment();

    if (isValid) {
        // Lấy thông tin đơn hàng
        const product = document.getElementById('product').value;
        const quantity = document.getElementById('quantity').value;
        const date = document.getElementById('deliveryDate').value;
        const address = document.getElementById('address').value;
        const payment = document.querySelector('input[name="payment"]:checked').value;
        const total = (prices[product] * quantity).toLocaleString('vi-VN') + 'đ';

        // Hiện box xác nhận
        document.getElementById('confirmDetails').innerHTML = `
            <p>🛍️ Sản phẩm: <strong>${product}</strong></p>
            <p>📦 Số lượng: <strong>${quantity}</strong></p>
            <p>📅 Ngày giao: <strong>${date}</strong></p>
            <p>📍 Địa chỉ: <strong>${address}</strong></p>
            <p>💳 Thanh toán: <strong>${payment}</strong></p>
            <p>💰 Tổng tiền: ${total}</p>
        `;
        document.getElementById('confirmBox').style.display = 'block';

        // Scroll xuống box xác nhận
        document.getElementById('confirmBox').scrollIntoView({ behavior: 'smooth' });
    }
});

// Nút Xác nhận
// ===== Nút Xác nhận =====
document.getElementById('btnConfirm').addEventListener('click', function() {
    // Validate lại lần cuối trước khi xác nhận
    const isStillValid =
        validateProduct() &
        validateQuantity() &
        validateDeliveryDate() &
        validateAddress() &
        validateNote() &
        validatePayment();

    if (!isStillValid) {
        // Ẩn box xác nhận, để người dùng sửa lỗi
        document.getElementById('confirmBox').style.display = 'none';
        return;
    }

    document.getElementById('orderForm').style.display = 'none';
    document.getElementById('confirmBox').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
});

// Nút Hủy
document.getElementById('btnCancel').addEventListener('click', function() {
    document.getElementById('confirmBox').style.display = 'none';
});