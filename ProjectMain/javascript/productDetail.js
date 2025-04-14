document.addEventListener("DOMContentLoaded", function () {
  // Lấy user nếu có (không bắt buộc phải đăng nhập)
  let currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // Lấy ID bài viết từ URL
  let articleId = new URLSearchParams(window.location.search).get("id");
  let articles = JSON.parse(localStorage.getItem("articles")) || [];
  let article = articles.find(a => a.id === parseInt(articleId));

  // DOM elements
  let titleEl = document.getElementById("postTitle");
  let contentEl = document.getElementById("postContent");
  let avatarEl = document.getElementById("avatar");
  let likeCountEl = document.getElementById("likeCount");
  let commentCountEl = document.getElementById("commentCount");
  let commentsSection = document.getElementById("commentsSection");
  let commentForm = document.getElementById("commentForm");
  let commentInput = document.getElementById("commentInput");

  // Nếu không tìm thấy bài viết
  if (!article) {
    titleEl.textContent = "Bài viết không tồn tại!";
    return;
  }

  // Hiển thị thông tin bài viết
  titleEl.textContent = article.title;
  contentEl.textContent = article.content;
  avatarEl.src = article.imageBase64 || "../image/default.png";
  likeCountEl.textContent = article.likes || 0;
  commentCountEl.textContent = article.comments ? article.comments.length : 0;

  // Hiển thị bình luận hiện có
  renderAllComments(article.comments || []);

  // Gửi bình luận mới (nếu đã đăng nhập)
  commentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let text = commentInput.value.trim();
    if (!text) return;

    if (!currentUser) {
      alert("Bạn cần đăng nhập để bình luận.");
      return;
    }

    let newComment = {
      id: Date.now(),
      userId: currentUser.id,
      username: currentUser.email,
      avatar: "../image/icon-user.jpg", // avatar mặc định
      text: text,
      likes: 0,
      replies: 0
    };

    article.comments = article.comments || [];
    article.comments.push(newComment);
    updateArticle(article);

    commentInput.value = "";
    renderAllComments(article.comments);
    commentCountEl.textContent = article.comments.length;
  });

  // Hàm hiển thị toàn bộ bình luận
  function renderAllComments(comments) {
    commentsSection.innerHTML = "";
    comments.forEach(renderComment);
  }

  // Hiển thị từng bình luận
  function renderComment(comment) {
    let div = document.createElement("div");
    div.classList.add("comment");
    div.innerHTML = `
      <img class="comment-avatar" src="${comment.avatar}" alt="avatar">
      <div class="comment-box">
        <p><strong>${comment.username}</strong>: ${comment.text}</p>
        <div class="actions">
          <span><i class="fa-regular fa-thumbs-up"></i> ${comment.likes} Likes</span>
          <span><i class="fa-regular fa-comment-dots"></i> ${comment.replies} Replies</span>
          ${
            currentUser && currentUser.id === comment.userId
              ? `<button onclick="deleteComment(${comment.id})">Xoá</button>`
              : ""
          }
        </div>
      </div>
    `;
    commentsSection.appendChild(div);
  }

  // Cập nhật lại bài viết vào localStorage
  function updateArticle(updated) {
    let newArticles = articles.map(a =>
      a.id === updated.id ? updated : a
    );
    localStorage.setItem("articles", JSON.stringify(newArticles));
  }

  // Xoá bình luận
  window.deleteComment = function (commentId) {
    article.comments = article.comments.filter(c => c.id !== commentId);
    updateArticle(article);
    renderAllComments(article.comments);
    commentCountEl.textContent = article.comments.length;
  };
});
