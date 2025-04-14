// Chuyển file ảnh thành base64 và gọi callback với chuỗi base64
function convertImageToBase64(file, callback) {
  let reader = new FileReader();
  reader.onload = function (e) {
    callback(e.target.result); // kết quả là base64 string
  };
  reader.readAsDataURL(file);
}

document.addEventListener("DOMContentLoaded", function () {
  let tableBody = document.getElementById("articleTableBody");
  let formPopup = document.getElementById("articleFormPopup");
  let formTitle = document.getElementById("formTitle");
  let toggleFormBtn = document.getElementById("toggleArticleFormBtn");
  let addBtn = document.getElementById("addArticleBtn");
  let updateBtn = document.getElementById("updateArticleBtn");
  let cancelBtn = document.getElementById("cancelArticleBtn");

  let titleInput = document.getElementById("articleTitle");
  let categorySelect = document.getElementById("articleCategory");
  let moodInput = document.getElementById("articleMood");
  let contentInput = document.getElementById("articleContent");
  let imageInput = document.getElementById("articleImage");
  let countPost = document.getElementsByClassName("badge")[0];

  let articles = JSON.parse(localStorage.getItem("articles")) || [];
  let editingId = null;

  function loadCategories() {
    let categories = JSON.parse(localStorage.getItem("entries")) || [];
    categorySelect.innerHTML = '<option value="">-- Chọn chủ đề --</option>';
    for (let i = 0; i < categories.length; i++) {
      let cat = categories[i];
      let option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    }
  }

  function renderArticles() {
    tableBody.innerHTML = "";
    countPost.textContent = `${articles.length} bài viết`;

    for (let i = 0; i < articles.length; i++) {
      let article = articles[i];
      let row = document.createElement("tr");

      let img = article.imageBase64 ? `<img src="${article.imageBase64}" width="60"/>` : "No Image";
      let contentPreview = article.content.length > 50 ? article.content.slice(0, 50) + "..." : article.content;
      let statusColor = article.status === "public" ? "green" : "red";

      row.innerHTML = `
        <td>${img}</td>
        <td>${article.title}</td>
        <td>${article.category}</td>
        <td>${contentPreview}</td>
        <td><span class="badge" style="color: ${statusColor};">${article.status}</span></td>
        <td>
          <select class="status-dropdown" data-id="${article.id}">
            <option value="public" ${article.status === "public" ? "selected" : ""}>Public</option>
            <option value="private" ${article.status === "private" ? "selected" : ""}>Private</option>
          </select>
        </td>
        <td>
          <button class="edit-btn" data-id="${article.id}">Sửa</button>
          <button class="delete-btn" data-id="${article.id}">Xoá</button>
        </td>
      `;

      tableBody.appendChild(row);
    }

    attachEditEvents();
    attachDeleteEvents();
    attachStatusChangeEvents();
  }

  function attachStatusChangeEvents() {
    let dropdowns = document.querySelectorAll(".status-dropdown");
    for (let i = 0; i < dropdowns.length; i++) {
      let dropdown = dropdowns[i];
      dropdown.addEventListener("change", function () {
        let id = Number(this.dataset.id);
        let article = articles.find(a => a.id === id);
        if (article) {
          article.status = this.value;
          localStorage.setItem("articles", JSON.stringify(articles));
          renderArticles(); // Cập nhật lại
        }
      });
    }
  }

  function attachEditEvents() {
    let editBtns = document.querySelectorAll(".edit-btn");
    for (let i = 0; i < editBtns.length; i++) {
      let btn = editBtns[i];
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        let id = Number(this.dataset.id);
        let article = articles.find(a => a.id === id);
        if (article) {
          editingId = id;
          formTitle.textContent = "Edit Article";
          formPopup.style.display = "flex";
          titleInput.value = article.title;
          categorySelect.value = article.category;
          moodInput.value = article.mood;
          contentInput.value = article.content;
          addBtn.style.display = "none";
          updateBtn.style.display = "inline-block";
        }
      });
    }
  }

  function attachDeleteEvents() {
    let deleteBtns = document.querySelectorAll(".delete-btn");
    for (let i = 0; i < deleteBtns.length; i++) {
      let btn = deleteBtns[i];
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        let id = Number(this.dataset.id);
        if (confirm("Xác nhận xoá bài viết?")) {
          articles = articles.filter(a => a.id !== id);
          localStorage.setItem("articles", JSON.stringify(articles));
          renderArticles();
        }
      });
    }
  }

  toggleFormBtn.addEventListener("click", () => {
    formTitle.textContent = "Add Article";
    formPopup.style.display = "flex";
    addBtn.style.display = "inline-block";
    updateBtn.style.display = "none";
    titleInput.value = "";
    categorySelect.value = "";
    moodInput.value = "";
    contentInput.value = "";
    imageInput.value = null;
    editingId = null;
    loadCategories();
  });

  cancelBtn.addEventListener("click", () => {
    formPopup.style.display = "none";
  });

  addBtn.addEventListener("click", () => {
    let title = titleInput.value.trim();
    let category = categorySelect.value;
    let mood = moodInput.value.trim();
    let content = contentInput.value.trim();
    let status = document.querySelector("input[name='status']:checked").value;
    let imageFile = imageInput.files[0];

    if (!title || !category || !content) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (imageFile) {
      convertImageToBase64(imageFile, function (base64Image) {
        let newArticle = {
          id: articles.length > 0 ? articles[articles.length - 1].id + 1 : 1,
          title,
          category,
          mood,
          content,
          status,
          imageBase64: base64Image,
          author: "Admin"
        };
        articles.push(newArticle);
        localStorage.setItem("articles", JSON.stringify(articles));
        formPopup.style.display = "none";
        renderArticles();
      });
    } else {
      let newArticle = {
        id: articles.length > 0 ? articles[articles.length - 1].id + 1 : 1,
        title,
        category,
        mood,
        content,
        status,
        imageBase64: "",
        author: "Admin"
      };
      articles.push(newArticle);
      localStorage.setItem("articles", JSON.stringify(articles));
      formPopup.style.display = "none";
      renderArticles();
    }
  });

  updateBtn.addEventListener("click", () => {
    let title = titleInput.value.trim();
    let category = categorySelect.value;
    let mood = moodInput.value.trim();
    let content = contentInput.value.trim();
    let status = document.querySelector("input[name='status']:checked").value;
    let imageFile = imageInput.files[0];

    if (!title || !category || !content) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    let article = articles.find(a => a.id === editingId);
    if (article) {
      article.title = title;
      article.category = category;
      article.mood = mood;
      article.content = content;
      article.status = status;

      if (imageFile) {
        convertImageToBase64(imageFile, function (base64Image) {
          article.imageBase64 = base64Image;
          localStorage.setItem("articles", JSON.stringify(articles));
          formPopup.style.display = "none";
          renderArticles();
        });
      } else {
        localStorage.setItem("articles", JSON.stringify(articles));
        formPopup.style.display = "none";
        renderArticles();
      }
    }
  });

  renderArticles();
  loadCategories();
});
