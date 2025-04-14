document.addEventListener("DOMContentLoaded", function () {
  let form = document.querySelector(".form");

  // Lấy các input
  let firstName = document.getElementById("firstName");
  let lastName = document.getElementById("lastName");
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let confirmPassword = document.getElementById("confirmPassword");

  // Lấy các span báo lỗi
  let firstNameError = document.getElementById("firstNameError");
  let lastNameError = document.getElementById("lastNameError");
  let emailError = document.getElementById("emailError");
  let passwordError = document.getElementById("passwordError");
  let confirmPasswordError = document.getElementById("confirmPasswordError");

  // Bắt sự kiện submit form
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn form reload

    // Xóa lỗi cũ
    firstNameError.textContent = "";
    lastNameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

    // Đánh dấu form hợp lệ
    let isValid = true;

    // Kiểm tra từng ô nhập
    if (firstName.value.trim() === "") {
      firstNameError.textContent = "*Họ không được để trống";
      isValid = false;
    }

    if (lastName.value.trim() === "") {
      lastNameError.textContent = "*Tên không được để trống";
      isValid = false;
    }

    if (email.value.trim() === "") {
      emailError.textContent = "*Email không được để trống";
      isValid = false;
    } else {
      let emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailFormat.test(email.value.trim())) {
        emailError.textContent = "*Email sai định dạng";
        isValid = false;
      }
    }

    if (password.value === "") {
      passwordError.textContent = "*Mật khẩu không được để trống";
      isValid = false;
    } else if (password.value.length < 6) {
      passwordError.textContent = "*Mật khẩu tối thiểu 6 ký tự";
      isValid = false;
    }

    if (confirmPassword.value === "") {
      confirmPasswordError.textContent = "*Vui lòng nhập lại mật khẩu";
      isValid = false;
    } else if (confirmPassword.value !== password.value) {
      confirmPasswordError.textContent = "*Mật khẩu nhập lại không đúng";
      isValid = false;
    }

    // Nếu form hợp lệ, tiến hành lưu
    if (isValid) {
      // Lấy danh sách người dùng hiện tại (nếu chưa có thì là mảng rỗng)
      let users = JSON.parse(localStorage.getItem("users")) || [];

      // Kiểm tra email đã tồn tại chưa
      let emailTrung = false;
      for (let i = 0; i < users.length; i++) {
        if (users[i].email === email.value.trim()) {
          emailTrung = true;
          break;
        }
      }

      if (emailTrung) {
        emailError.textContent = "*Email đã được sử dụng";
        return;
      }

      // Tạo đối tượng người dùng mới
      let newUser = {
        id: users.length + 1,
        firstname: firstName.value.trim(),
        lastname: lastName.value.trim(),
        email: email.value.trim(),
        password: password.value
      };

      // Thêm vào danh sách
      users.push(newUser);

      // Lưu lại vào localStorage
      localStorage.setItem("users", JSON.stringify(users));

      alert("Đăng ký thành công!");
      window.location.href = "./login.html";
    }
  });
});
