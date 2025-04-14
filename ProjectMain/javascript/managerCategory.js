document.addEventListener("DOMContentLoaded", function () {
  let tableBody = document.getElementById("categoryTableBody"); // Vị trí hiển thị danh sách chủ đề
  let badge = document.querySelector(".badge"); // Thẻ hiển thị số lượng chủ đề

  let nameInput = document.getElementById("topicName"); // Ô nhập tên chủ đề
  let descInput = document.getElementById("topicDesc"); // Ô nhập mô tả chủ đề
  let addBtn = document.getElementById("addBtn"); // Nút thêm mới
  let updateBtn = document.getElementById("updateBtn"); // Nút cập nhật
  let toggleFormBtn = document.getElementById("toggleFormBtn"); // Nút hiển thị form
  let formAddBox = document.getElementById("formAddBox"); // Khối form thêm/chỉnh sửa
  let cancelBtn = document.getElementById("cancelBtn"); // Nút hủy

  let topics = JSON.parse(localStorage.getItem("entries")) || []; // Dữ liệu chủ đề từ localStorage
  let editingId = null; // ID chủ đề đang chỉnh sửa

  // Hiển thị toàn bộ chủ đề ra bảng
  function hienThiChuDe() {
    tableBody.innerHTML = "";

    for (let i = 0; i < topics.length; i++) {
      let topic = topics[i];

      let row = document.createElement("tr");

      row.innerHTML = `
        <td>${topic.name}</td>
        <td>${topic.description || ""}</td>
        <td><span class="badge status-badge">Active</span></td>
        <td>
          <a href="#" class="edit-btn" data-id="${topic.id}">Edit</a>
          <a href="#" class="delete-btn" data-id="${topic.id}">Delete</a>
        </td>
      `;

      tableBody.appendChild(row);
    }

    badge.textContent = `${topics.length} chủ đề`;

    ganSuKienXoa(); // Gắn sự kiện xóa
    ganSuKienSua(); // Gắn sự kiện sửa
  }

  // Gắn sự kiện xóa bài
  function ganSuKienXoa() {
    let deleteBtns = document.querySelectorAll(".delete-btn");

    for (let i = 0; i < deleteBtns.length; i++) {
      let btn = deleteBtns[i];
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        let idCanXoa = Number(this.dataset.id);
        if (confirm("Bạn có chắc muốn xóa?")) {
          topics = topics.filter(t => t.id !== idCanXoa);
          localStorage.setItem("entries", JSON.stringify(topics));
          hienThiChuDe();
        }
      });
    }
  }

  // Gắn sự kiện sửa bài
  function ganSuKienSua() {
    let editBtns = document.querySelectorAll(".edit-btn");

    for (let i = 0; i < editBtns.length; i++) {
      let btn = editBtns[i];
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        let idCanSua = Number(this.dataset.id);
        let topic = topics.find(t => t.id === idCanSua);
        if (topic) {
          nameInput.value = topic.name;
          descInput.value = topic.description;
          editingId = topic.id;
          formAddBox.style.display = "block";
          addBtn.style.display = "none";
          updateBtn.style.display = "inline-block";
        }
      });
    }
  }

  // Nút thêm chủ đề mới
  addBtn.addEventListener("click", function () {
    let name = nameInput.value.trim();
    let desc = descInput.value.trim();

    if (name === "") {
      alert("Vui lòng nhập tên chủ đề");
      return;
    }

    let newTopic = {
      id: topics.length > 0 ? topics[topics.length - 1].id + 1 : 1,
      name: name,
      description: desc
    };

    topics.push(newTopic);
    localStorage.setItem("entries", JSON.stringify(topics));
    nameInput.value = "";
    descInput.value = "";
    formAddBox.style.display = "none";
    hienThiChuDe();
  });

  // Nút cập nhật chủ đề đã sửa
  updateBtn.addEventListener("click", function () {
    let name = nameInput.value.trim();
    let desc = descInput.value.trim();

    if (name === "") {
      alert("Tên chủ đề không được để trống");
      return;
    }

    let topic = topics.find(t => t.id === editingId);
    if (topic) {
      topic.name = name;
      topic.description = desc;
      localStorage.setItem("entries", JSON.stringify(topics));
    }

    nameInput.value = "";
    descInput.value = "";
    editingId = null;
    formAddBox.style.display = "none";
    addBtn.style.display = "inline-block";
    updateBtn.style.display = "none";
    hienThiChuDe();
  });

  // Nút mở form thêm mới
  toggleFormBtn.addEventListener("click", function () {
    formAddBox.style.display = "block";
    nameInput.value = "";
    descInput.value = "";
    editingId = null;
    addBtn.style.display = "inline-block";
    updateBtn.style.display = "none";
  });

  // Nút hủy form
  cancelBtn.addEventListener("click", function () {
    formAddBox.style.display = "none";
    nameInput.value = "";
    descInput.value = "";
    editingId = null;
    addBtn.style.display = "inline-block";
    updateBtn.style.display = "none";
  });

  hienThiChuDe(); // Render dữ liệu khi load trang
});
