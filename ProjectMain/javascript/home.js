document.addEventListener("DOMContentLoaded", function () {
  let blogGrid = document.querySelector(".blog-grid"); // Vị trí hiển thị các bài viết
  let recentBlogPostsContainer = document.querySelector(".recent-blog-posts"); // Phần hiển thị các bài viết mới nhất
  let searchInput = document.querySelector(".search"); // Vị trí ô tìm kiếm
  let addArticleBtn = document.querySelector(".add-article"); // Nút thêm bài viết
  let articleForm = document.getElementById("articleForm"); // Form thêm bài viết
  let categorySelect = document.getElementById("categorySelect"); // Dropdown danh mục
  let filters = document.querySelector(".filters"); // Phần lọc theo category
  let articles = JSON.parse(localStorage.getItem("articles")) || []; // Lấy bài viết từ localStorage

  // Phân trang
  let itemsPerPage = 8;
  let currentPage = 1;
  let totalPages = Math.ceil(articles.length / itemsPerPage);
  let paginationContainer = document.querySelector(".pagination");

  // Hàm tìm kiếm bài viết theo tiêu đề
  function searchArticles() {
    let searchTerm = searchInput.value.toLowerCase(); // Lấy giá trị tìm kiếm
    let filteredArticles = articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm) // Lọc các bài viết theo tiêu đề
    );
    renderArticles(filteredArticles);
  }

  // Hàm hiển thị các bài viết ra giao diện
  function renderArticles(filteredArticles) {
    blogGrid.innerHTML = "";
    if (filteredArticles.length === 0) {
      blogGrid.innerHTML = "<p>Không có bài viết nào!</p>";
      paginationContainer.innerHTML = "";
      return;
    }

    totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    for (let i = 0; i < paginatedArticles.length; i++) {
      let article = paginatedArticles[i];
      let card = document.createElement("div");
      card.className = "blog-card";

      let imageSrc = article.imageBase64 || "../image/default.png";
      let contentPreview = article.content.length > 100 ? article.content.slice(0, 100) + "..." : article.content;

      card.innerHTML = `
        <img src="${imageSrc}" alt="Article Image" />
        <p class="date">Date: ${article.date || new Date().toISOString().split("T")[0]}</p>
        <h3><a href="productDetail.html?id=${article.id}">${article.title}</a></h3>
        <p class="desc">${contentPreview}</p>
        <span class="tag">${article.category}</span>
      `;
      blogGrid.appendChild(card);
    }

    renderPagination(filteredArticles);
  }

  // Hàm hiển thị phân trang
  function renderPagination(filteredArticles) {
    paginationContainer.innerHTML = "";

    // Prev button
    let prevBtn = document.createElement("span");
    prevBtn.className = "nav";
    prevBtn.innerText = "« Prev";
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderArticles(filteredArticles);
      }
    };
    paginationContainer.appendChild(prevBtn);

    // Numbered pages
    for (let i = 1; i <= totalPages; i++) {
      let pageBtn = document.createElement("span");
      pageBtn.className = "page" + (i === currentPage ? " active" : "");
      pageBtn.innerText = i;
      pageBtn.onclick = () => {
        currentPage = i;
        renderArticles(filteredArticles);
      };
      paginationContainer.appendChild(pageBtn);
    }

    // Next button
    let nextBtn = document.createElement("span");
    nextBtn.className = "nav";
    nextBtn.innerText = "Next »";
    nextBtn.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderArticles(filteredArticles);
      }
    };
    paginationContainer.appendChild(nextBtn);
  }

  // Hàm hiển thị bài viết mới nhất
  function renderRecentPosts() {
    // ✅ Sắp xếp theo id giảm dần để lấy bài mới nhất
    let sortedArticles = [...articles].sort((a, b) => b.id - a.id);

    let recentArticles = sortedArticles.slice(0, 3);
    recentBlogPostsContainer.innerHTML = '';
    for (let i = 0; i < recentArticles.length; i++) {
      let article = recentArticles[i];
      let card = document.createElement("div");
      card.className = "blog-card";

      let imageSrc = article.imageBase64 || "../image/default.png";
      let contentPreview = article.content.length > 100 ? article.content.slice(0, 100) + "..." : article.content;

      card.innerHTML = `
        <img src="${imageSrc}" alt="Article Image" />
        <p class="date">Date: ${article.date || new Date().toISOString().split("T")[0]}</p>
        <h3><a href="productDetail.html?id=${article.id}">${article.title}</a></h3>
        <p class="desc">${contentPreview}</p>
        <span class="tag">${article.category}</span>
      `;
      recentBlogPostsContainer.appendChild(card);
    }
  }

  // Hàm mở/ẩn form thêm bài viết
  function toggleArticleForm() {
    articleForm.classList.toggle("hidden");
    loadCategories(); // Tải danh sách chủ đề khi form mở
  }

  // Hàm tải danh sách chủ đề từ localStorage
  function loadCategories() {
    let categories = JSON.parse(localStorage.getItem("entries")) || []; // Lấy danh mục từ localStorage
    categorySelect.innerHTML = '<option disabled selected>-- Chọn chủ đề --</option>'; // Reset dropdown

    for (let i = 0; i < categories.length; i++) {
      let cat = categories[i];
      let option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      categorySelect.appendChild(option); // Thêm chủ đề vào dropdown
    }
  }

  // Hàm lọc bài viết theo category
  function filterArticlesByCategory(category) {
    let filteredArticles = [];

    if (category === "all") {
      filteredArticles = articles;
    } else {
      filteredArticles = articles.filter(article => article.category.toLowerCase() === category.toLowerCase());
    }

    renderArticles(filteredArticles);
  }

  // Lọc bài viết khi người dùng click vào category filter
  filters.addEventListener("click", function (e) {
    if (e.target && e.target.matches(".filter-item")) {
      let selectedCategory = e.target.getAttribute("data-category");
      filterArticlesByCategory(selectedCategory);
    }
  });

  // Gọi hàm tìm kiếm mỗi khi người dùng gõ vào ô tìm kiếm
  searchInput.addEventListener("input", searchArticles);

  // Mở/ẩn form khi click vào "Add New Article"
  addArticleBtn.addEventListener("click", toggleArticleForm);

  // Thêm bài viết vào localStorage và render lại
  articleForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let title = document.querySelector("input[name='title']").value.trim();
    let category = categorySelect.value;
    let mood = document.querySelector("input[name='mood']").value.trim();
    let content = document.querySelector("textarea[name='content']").value.trim();
    let statusInput = document.querySelector("input[name='status']:checked");
    let imageFile = document.querySelector("#fileUpload").files[0];

    // Kiểm tra dữ liệu đầu vào
    if (!title || !category || !content || !statusInput) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    let newArticle = {
      id: articles.length > 0 ? articles[articles.length - 1].id + 1 : 1,
      title,
      category,
      mood,
      content,
      status: statusInput.value,
      imageBase64: "",
      author: "Admin",
      date: new Date().toISOString().split("T")[0]
    };

    // Hàm xử lý sau khi thêm bài viết thành công
    function handleAfterAdd() {
      localStorage.setItem("articles", JSON.stringify(articles));
      currentPage = 1;
      renderArticles(articles);
      renderRecentPosts(); // 🔥 cập nhật lại phần bài viết mới nhất
      articleForm.classList.add("hidden");

      // Scroll lên phần bài viết mới nhất
      window.scrollTo({
        top: recentBlogPostsContainer.offsetTop - 80,
        behavior: "smooth"
      });
    }

    // Nếu có ảnh, xử lý base64
    if (imageFile) {
      convertImageToBase64(imageFile, function (base64Image) {
        newArticle.imageBase64 = base64Image;
        articles.push(newArticle);
        handleAfterAdd();
      });
    } else {
      articles.push(newArticle);
      handleAfterAdd();
    }
  });

  // Render bài viết mới nhất khi trang được tải
  renderRecentPosts();

  // Tải danh mục chủ đề khi trang load
  loadCategories();

  // Tải danh sách filter categories
  function loadCategoryFilters() {
    let categories = JSON.parse(localStorage.getItem("entries")) || [];

    // Thêm một mục "All blog posts" vào filter
    filters.innerHTML = '<span class="filter-item active" data-category="all">Tất cả bài viết</span>';

    for (let i = 0; i < categories.length; i++) {
      let cat = categories[i];
      let categoryFilter = document.createElement("span");
      categoryFilter.className = "filter-item";
      categoryFilter.textContent = cat.name;
      categoryFilter.setAttribute("data-category", cat.name);
      filters.appendChild(categoryFilter); // Thêm category vào filter
    }
  }

  loadCategoryFilters();
  renderArticles(articles); // => Hiển thị đầy đủ ban đầu

  // =================== HIỂN THỊ USER ĐANG ĐĂNG NHẬP ===================
  let currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let userInfo = document.getElementById("user-info");
  let authButtons = document.getElementById("auth-buttons");
  let userAvatar = document.getElementById("userAvatar");
  let dropdown = document.getElementById("dropdownMenu");

  if (currentUser) {
    userInfo.style.display = "flex";
    authButtons.style.display = "none";

    userAvatar.src = currentUser.avatar || "../image/icon-user.jpg";
    document.getElementById("dropdownName").textContent = currentUser.fullname || currentUser.email;
    document.getElementById("dropdownEmail").textContent = currentUser.email;

    // Toggle menu
    userAvatar.addEventListener("click", function () {
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", function () {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("isLoggedIn");
      window.location.href = "login.html";
    });
  }
});

// Chuyển file ảnh thành base64 và gọi callback với chuỗi base64
function convertImageToBase64(file, callback) {
  let reader = new FileReader();
  reader.onload = function (e) {
    callback(e.target.result); // Kết quả là base64 string
  };
  reader.readAsDataURL(file);
}
