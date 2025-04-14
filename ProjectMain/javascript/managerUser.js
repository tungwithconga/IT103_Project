document.addEventListener("DOMContentLoaded", function () {
  let users = JSON.parse(localStorage.getItem("users")) || []; // Dữ liệu người dùng từ localStorage
  let tableBody = document.getElementById("userTableBody"); // Thân bảng người dùng
  let userCount = document.getElementById("userCount"); // Thẻ hiển thị số lượng người dùng
  let searchInput = document.getElementById("searchInput"); // Ô tìm kiếm
  let pagination = document.getElementById("pagination"); // Vùng phân trang

  let currentPage = 1; // Trang hiện tại
  let itemsPerPage = 5; // Số người dùng mỗi trang
  let filteredUsers = [...users]; // Mảng người dùng sau khi lọc

  // Hàm hiển thị người dùng theo trang
  function renderUsers(list) {
    tableBody.innerHTML = "";
    userCount.textContent = `${list.length} người`;

    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    let paginated = list.slice(start, end);

    for (let i = 0; i < paginated.length; i++) {
      let user = paginated[i];
      let row = document.createElement("tr");

      let nameCell = document.createElement("td");
      nameCell.innerHTML = `
        <img class="avatar" src="../image/icon-user.jpg">
        ${user.firstname} ${user.lastname}
        <div class="username">@${user.firstname.toLowerCase()}</div>
      `;

      let statusCell = document.createElement("td");
      statusCell.textContent = "hoạt động";

      let emailCell = document.createElement("td");
      emailCell.textContent = user.email;

      let actionCell = document.createElement("td");
      actionCell.innerHTML = `
        <a class="block">block</a> <a class="unblock">unblock</a>
      `;

      let sortCell = document.createElement("td");

      row.append(nameCell, statusCell, emailCell, actionCell, sortCell);
      tableBody.appendChild(row);
    }

    renderPagination(list.length); // Hiển thị phân trang
  }

  // Hàm phân trang
  function renderPagination(totalItems) {
    pagination.innerHTML = "";
    let totalPages = Math.ceil(totalItems / itemsPerPage);

    let createBtn = (label, page) => {
      let btn = document.createElement("button");
      btn.textContent = label;
      btn.className = "page-btn";
      if (page === currentPage) btn.classList.add("active");
      btn.addEventListener("click", () => {
        currentPage = page;
        renderUsers(filteredUsers);
      });
      return btn;
    };

    if (currentPage > 1) {
      pagination.appendChild(createBtn("« Prev", currentPage - 1));
    }

    for (let i = 1; i <= totalPages; i++) {
      pagination.appendChild(createBtn(i, i));
    }

    if (currentPage < totalPages) {
      pagination.appendChild(createBtn("Next »", currentPage + 1));
    }
  }

  // 🔍 Tìm kiếm người dùng theo tên hoặc email
  searchInput.addEventListener("input", () => {
    let keyword = searchInput.value.toLowerCase();
    filteredUsers = users.filter(user =>
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
    currentPage = 1;
    renderUsers(filteredUsers); // Hiển thị lại danh sách sau khi lọc
  });

  renderUsers(filteredUsers); // Gọi hàm hiển thị khi tải trang
});
