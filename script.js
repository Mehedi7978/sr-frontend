


  const API = 'http://localhost:5000'; // Change to your Render URL after deployment
const user = JSON.parse(localStorage.getItem('user'));

if (location.pathname.endsWith('index.html')) {
  document.getElementById('welcome').innerText = `Welcome, ${user?.name || 'Guest'}`;

  if (user && user.email === "admin@example.com") {
    document.getElementById('post-form').style.display = "block";
  }

  loadPosts();
}



//sanitize html 


 function sanitizeHTML(html) {
      const div = document.createElement('div');
      div.textContent = html;
      return div.innerHTML;
    }

let comments=0
 // Load posts from API
    async function loadPosts() {
      try {
        const res = await fetch(`${API}/posts`);
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        const container = document.getElementById('posts');
        container.innerHTML = '';
        data.forEach(post => {
          const div = document.createElement('div');
          div.className = 'post-card';
          div.setAttribute('data-id', post._id);
          div.innerHTML = `
            <h3>${sanitizeHTML(post.title)}</h3>
            <div class="description">${post.description}</div>
            ${post.fileUrl ? `<a href="${post.fileUrl}" target="_blank">View/Download Attachment</a>` : ''}
            <div>
              <button id="update" onclick="updatePost('${post._id}', this.closest('.post-card'))">Update</button>
              <button id="delete" onclick="deletePost('${post._id}', this.closest('.post-card'))">Delete</button>
            </div>
            <div class="comment-input">
              <input type="text" class="comment-text" placeholder="Add a comment...">
              <button onclick="addComment('${post._id}', this.closest('.post-card'))">Comment</button>
            </div>
            <button class="comment-toggle" onclick="toggleComments(this)">Show Comments</button>
            <div class="comments-list">
              <ul>
                ${post.comments ? post.comments.map(comment => `<li><b>${sanitizeHTML(comment.user)}</b>: ${sanitizeHTML(comment.text)}</li>`).join('') : ''}
              </ul>
            </div>
          `;
          container.appendChild(div);
        });
      } catch (err) {
        console.error('Failed to load posts:', err);
        alert('Failed to load posts. Please try again.');
      }
    }


function toggleComments(postId) {
  const commentsDiv = document.getElementById(`comments-${postId}`);
  commentsDiv.classList.toggle('active');
}

function likePost(id) {
  fetch(`${API}/like/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: user.name })
  })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => { throw new Error(err.error); });
      }
      return res.json();
    })
    .then(() => loadPosts())
    .catch(err => alert(err.message));
}

function commentPost(id) {
  const comment = document.getElementById(`cmt-${id}`).value;
  fetch(`${API}/comment/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: user.name, comment })
  }).then(() => loadPosts());
}



