// API URL
const API_URL = 'http://localhost:3000/posts';

// State
let currentFilter = 'all';
let editingPostId = null;

// DOM Elements
const postForm = document.getElementById('post-form');
const postIdInput = document.getElementById('post-id');
const postTitleInput = document.getElementById('post-title');
const postViewsInput = document.getElementById('post-views');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const postsList = document.getElementById('posts-list');
const filterButtons = document.querySelectorAll('.btn-filter');

// Statistics elements
const totalPostsEl = document.getElementById('total-posts');
const activePostsEl = document.getElementById('active-posts');
const deletedPostsEl = document.getElementById('deleted-posts');
const totalViewsEl = document.getElementById('total-views');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    postForm.addEventListener('submit', handleSubmit);
    cancelBtn.addEventListener('click', resetForm);

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            loadPosts();
        });
    });
}

// Load posts from API
async function loadPosts() {
    try {
        const response = await fetch(API_URL);
        const posts = await response.json();

        // Filter posts based on current filter
        let filteredPosts = posts;
        if (currentFilter === 'active') {
            filteredPosts = posts.filter(post => !post.isDeleted);
        } else if (currentFilter === 'deleted') {
            filteredPosts = posts.filter(post => post.isDeleted);
        }

        renderPosts(filteredPosts);
        updateStatistics(posts);
    } catch (error) {
        console.error('Error loading posts:', error);
        postsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <p>Không thể tải dữ liệu. Vui lòng kiểm tra JSON Server đã chạy chưa.</p>
                <p style="margin-top: 0.5rem; font-size: 0.875rem;">Chạy lệnh: <code>npx json-server db.json</code></p>
            </div>
        `;
    }
}

// Render posts
function renderPosts(posts) {
    if (posts.length === 0) {
        postsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <p>Không có post nào để hiển thị</p>
            </div>
        `;
        return;
    }

    postsList.innerHTML = posts.map(post => {
        const deletedClass = post.isDeleted ? 'deleted' : '';
        const actionButtons = post.isDeleted
            ? `<button class="btn btn-restore" onclick="restorePost('${post.id}')">
                   <span>♻️ Khôi phục</span>
               </button>`
            : `<button class="btn btn-edit" onclick="editPost('${post.id}')">
                   <span>✏️ Sửa</span>
               </button>
               <button class="btn btn-delete" onclick="deletePost('${post.id}')">
                   <span>🗑️ Xóa</span>
               </button>`;

        return `
            <div class="post-item ${deletedClass}">
                <div class="post-content">
                    <div class="post-title">${post.title}</div>
                    <div class="post-meta">
                        <span>🆔 ID: ${post.id}</span>
                        <span>👁️ ${post.views} lượt xem</span>
                        ${post.isDeleted ? '<span style="color: var(--danger-color);">🗑️ Đã xóa</span>' : ''}
                    </div>
                </div>
                <div class="post-actions">
                    ${actionButtons}
                </div>
            </div>
        `;
    }).join('');
}

// Update statistics
function updateStatistics(posts) {
    const activePosts = posts.filter(p => !p.isDeleted);
    const deletedPosts = posts.filter(p => p.isDeleted);
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

    totalPostsEl.textContent = posts.length;
    activePostsEl.textContent = activePosts.length;
    deletedPostsEl.textContent = deletedPosts.length;
    totalViewsEl.textContent = totalViews.toLocaleString('vi-VN');
}

// Get next ID (maxId + 1)
async function getNextId() {
    try {
        const response = await fetch(API_URL);
        const posts = await response.json();

        if (posts.length === 0) return "1";

        // Find max ID
        const maxId = Math.max(...posts.map(p => parseInt(p.id) || 0));
        return String(maxId + 1);
    } catch (error) {
        console.error('Error getting next ID:', error);
        return "1";
    }
}

// Handle form submit
async function handleSubmit(e) {
    e.preventDefault();

    const title = postTitleInput.value.trim();
    const views = parseInt(postViewsInput.value) || 0;

    if (!title) {
        alert('Vui lòng nhập tiêu đề!');
        return;
    }

    try {
        if (editingPostId) {
            // Update existing post
            await fetch(`${API_URL}/${editingPostId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, views }),
            });
        } else {
            // Create new post with auto-increment ID
            const nextId = await getNextId();
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: nextId,
                    title,
                    views,
                    isDeleted: false
                }),
            });
        }

        resetForm();
        loadPosts();
    } catch (error) {
        console.error('Error saving post:', error);
        alert('Có lỗi xảy ra khi lưu post!');
    }
}

// Edit post
async function editPost(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const post = await response.json();

        editingPostId = id;
        postIdInput.value = id;
        postTitleInput.value = post.title;
        postViewsInput.value = post.views;

        formTitle.textContent = '✏️ Sửa Post';
        submitBtn.querySelector('span').textContent = 'Cập nhật';
        cancelBtn.style.display = 'inline-flex';

        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Error loading post for edit:', error);
        alert('Có lỗi xảy ra khi tải post!');
    }
}

// Soft delete post (set isDeleted = true)
async function deletePost(id) {
    if (!confirm('Bạn có chắc muốn xóa post này?')) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isDeleted: true }),
        });

        loadPosts();
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Có lỗi xảy ra khi xóa post!');
    }
}

// Restore deleted post
async function restorePost(id) {
    if (!confirm('Bạn có chắc muốn khôi phục post này?')) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isDeleted: false }),
        });

        loadPosts();
    } catch (error) {
        console.error('Error restoring post:', error);
        alert('Có lỗi xảy ra khi khôi phục post!');
    }
}

// Reset form
function resetForm() {
    editingPostId = null;
    postForm.reset();
    postIdInput.value = '';
    formTitle.textContent = '➕ Thêm Post Mới';
    submitBtn.querySelector('span').textContent = 'Thêm Post';
    cancelBtn.style.display = 'none';
}

// Make functions globally accessible
window.editPost = editPost;
window.deletePost = deletePost;
window.restorePost = restorePost;
