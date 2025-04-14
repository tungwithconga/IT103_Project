document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  let form = document.getElementById("loginForm");
  let email = document.getElementById("email");
  let password = document.getElementById("password");

  let emailError = document.getElementById("emailError");
  let passwordError = document.getElementById("passwordError");
  let loginError = document.getElementById("loginError");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
   
    // Reset thông báo lỗi
    emailError.textContent = "";
    passwordError.textContent = "";
    loginError.textContent = "";

    let isValid = true;

    // Kiểm tra rỗng
    if (email.value.trim() === "") {
      emailError.textContent = "*Email không được để trống";
      isValid = false;
    }

    if (password.value.trim() === "") {
      passwordError.textContent = "*Mật khẩu không được để trống";
      isValid = false;
    }

    if (!isValid) return;

    // Lấy danh sách người dùng đã đăng ký
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Tìm người dùng hợp lệ
    let foundUser = users.find(user =>
      user.email === email.value.trim() && user.password === password.value
    );

    if (foundUser) {
      // Lưu vào localStorage user đang đăng nhập
      localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
      localStorage.setItem("isLoggedIn", "true");

      // Điều hướng sau khi đăng nhập thành công
      window.location.href = "../html/home.html"; // Đổi link nếu cần
    } else {
      loginError.textContent = "*Email hoặc mật khẩu không đúng";
    }
  });
});
