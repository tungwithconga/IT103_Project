document.addEventListener("DOMContentLoaded", function () {
    let tableBody = document.getElementById("categoryTableBody");
    let badge = document.querySelector(".badge");
  
    let nameInput = document.getElementById("topicName");
    let descInput = document.getElementById("topicDesc");
    let addBtn = document.getElementById("addBtn");
    let updateBtn = document.getElementById("updateBtn");
    let toggleFormBtn = document.getElementById("toggleFormBtn");
    let formAddBox = document.getElementById("formAddBox");
    let cancelBtn = document.getElementById("cancelBtn");
  
    let topics = JSON.parse(localStorage.getItem("entries")) || [];
    let editingId = null;
  
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
  
      badge.textContent = `${topics.length} topics`;
  
      ganSuKienXoa();
      ganSuKienSua();
    }
  
    function ganSuKienXoa() {
      let deleteBtns = document.querySelectorAll(".delete-btn");
  
      deleteBtns.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          let idCanXoa = Number(this.dataset.id);
          if (confirm("Bạn có chắc muốn xóa?")) {
            topics = topics.filter(t => t.id !== idCanXoa);
            localStorage.setItem("entries", JSON.stringify(topics));
            hienThiChuDe();
          }
        });
      });
    }
  
    function ganSuKienSua() {
      let editBtns = document.querySelectorAll(".edit-btn");
  
      editBtns.forEach(function (btn) {
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
      });
    }
  
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
  
    toggleFormBtn.addEventListener("click", function () {
      formAddBox.style.display = "block";
      nameInput.value = "";
      descInput.value = "";
      editingId = null;
      addBtn.style.display = "inline-block";
      updateBtn.style.display = "none";
    });
  
    cancelBtn.addEventListener("click", function () {
      formAddBox.style.display = "none";
      nameInput.value = "";
      descInput.value = "";
      editingId = null;
      addBtn.style.display = "inline-block";
      updateBtn.style.display = "none";
    });
  
    hienThiChuDe();
  });
  