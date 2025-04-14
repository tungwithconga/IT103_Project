document.addEventListener("DOMContentLoaded", function () {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let tableBody = document.getElementById("userTableBody");
  let userCount = document.getElementById("userCount");
  let searchInput = document.getElementById("searchInput");
  let sortBtn = document.getElementById("sortBtn");
  let pagination = document.getElementById("pagination");

  let currentPage = 1;
  let itemsPerPage = 5;
  let sortAsc = true;
  let filteredUsers = [...users];

  function renderUsers(list) {
    tableBody.innerHTML = "";
    userCount.textContent = `${list.length} người`;

    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    let paginated = list.slice(start, end);

    paginated.forEach(user => {
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
    });

    renderPagination(list.length);
  }

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

  // 🔍 Tìm kiếm
  searchInput.addEventListener("input", () => {
    let keyword = searchInput.value.toLowerCase();
    filteredUsers = users.filter(user =>
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
    currentPage = 1;
    renderUsers(filteredUsers);
  });

  // 🔃 Sắp xếp
  sortBtn.addEventListener("click", () => {
    sortAsc = !sortAsc;
    filteredUsers.sort((a, b) => {
      let nameA = `${a.firstname} ${a.lastname}`.toLowerCase();
      let nameB = `${b.firstname} ${b.lastname}`.toLowerCase();
      return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    renderUsers(filteredUsers);
  });

  // 🚀 Khởi tạo ban đầu
  renderUsers(filteredUsers);
});
