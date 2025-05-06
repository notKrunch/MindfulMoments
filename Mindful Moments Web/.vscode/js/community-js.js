import auth from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (!auth.isUserAuthenticated()) {
        window.location.href = 'login-html.html';
        return;
    }

    const user = auth.getCurrentUser();
    if (!user) {
        window.location.href = 'login-html.html';
        return;
    }

    // Initialize community features
    initCommunity();
    
    // Load posts
    loadPosts();
    
    // Add event listeners
    addEventListeners();
});

const elements = {
    newPostBtn: document.getElementById('new-post-btn'),
    mobileNewPostBtn: document.getElementById('mobile-new-post-btn'),
    newPostModal: document.getElementById('new-post-modal'),
    postDetailModal: document.getElementById('post-detail-modal'),
    modalOverlay: document.querySelector('.modal-overlay'),
    closeModalBtns: document.querySelectorAll('.close-modal'),
    backToListBtn: document.getElementById('back-to-list'),
    categoryBtns: document.querySelectorAll('.category-btn'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    viewBtns: document.querySelectorAll('.view-btn'),
    discussionsList: document.querySelector('.discussions-list'),
    searchInput: document.getElementById('search-discussions'),
    newPostForm: document.getElementById('new-post-form'),
    cancelPostBtn: document.getElementById('cancel-post'),
    paginationContainer: document.querySelector('.pagination'),
    discussionsContainer: document.querySelector('.discussions-container')
};

function initCommunity() {
    // Initialize post creation form
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', handlePostSubmission);
    }

    // Initialize post filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadPosts(button.dataset.filter);
        });
    });

    if (elements.newPostBtn) {
        elements.newPostBtn.addEventListener('click', () => {
            elements.newPostModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (elements.mobileNewPostBtn) {
        elements.mobileNewPostBtn.addEventListener('click', () => {
            elements.newPostModal.classList.add('active');
        });
    }

    if (elements.modalOverlay) {
        elements.modalOverlay.addEventListener('click', (e) => {
            if (e.target === elements.modalOverlay) {
                closeAllModals();
            }
        });
    }

    elements.closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    if (elements.backToListBtn) {
        elements.backToListBtn.addEventListener('click', () => {
            elements.postDetailModal.classList.remove('active');
            elements.discussionsContainer.classList.remove('detail-view');
        });
    }

    elements.categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterPostsByCategory(btn.dataset.category);
        });
    });

    elements.viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            elements.discussionsList.className = `discussions-list ${btn.dataset.view}-view`;
        });
    });

    document.querySelectorAll('.join-discussion').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const postId = this.closest('.discussion-card').dataset.id;
            elements.postDetailModal.classList.add('active');
            elements.discussionsContainer.classList.add('detail-view');
            loadPostDetail(postId);
        });
    });

    if (elements.cancelPostBtn) {
        elements.cancelPostBtn.addEventListener('click', () => {
            elements.newPostModal.classList.remove('active');
            elements.newPostForm.reset();
        });
    }

    if (elements.newPostForm) {
        elements.newPostForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                title: elements.newPostForm.querySelector('#post-title').value,
                category: elements.newPostForm.querySelector('#post-category').value,
                content: elements.newPostForm.querySelector('#post-content').value
            };

            saveDiscussion(formData);
            elements.newPostModal.classList.remove('active');
            elements.newPostForm.reset();

            showNotification('Post created successfully');
            loadDiscussions();
        });
    }

    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            if (!searchTerm) {
                loadDiscussions();
                return;
            }

            const discussions = document.querySelectorAll('.discussion-card');
            let visibleCount = 0;

            discussions.forEach(discussion => {
                const title = discussion.querySelector('.discussion-title').textContent.toLowerCase();
                const content = discussion.querySelector('.discussion-content').textContent.toLowerCase();
                const author = discussion.querySelector('.discussion-author').textContent.toLowerCase();

                if (title.includes(searchTerm) || content.includes(searchTerm) || author.includes(searchTerm)) {
                    discussion.style.display = 'block';
                    visibleCount++;
                } else {
                    discussion.style.display = 'none';
                }
            });

            updateResultsCount(visibleCount);
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.matches('.reply-btn')) {
            const commentContainer = e.target.closest('.comment');
            const existingForm = commentContainer.querySelector('.reply-form');

            if (existingForm) {
                existingForm.classList.toggle('active');
                if (existingForm.classList.contains('active')) {
                    existingForm.querySelector('textarea').focus();
                }
            } else {
                const replyForm = createReplyForm();
                commentContainer.appendChild(replyForm);
                replyForm.querySelector('textarea').focus();

                replyForm.querySelector('.submit-reply').addEventListener('click', () => {
                    const content = replyForm.querySelector('textarea').value;
                    if (content.trim()) {
                        addComment(commentContainer.dataset.id, content);
                        replyForm.querySelector('textarea').value = '';
                        replyForm.classList.remove('active');
                        showNotification('Reply added successfully');
                    }
                });
            }
        }
    });
}

function closeAllModals() {
    elements.newPostModal.classList.remove('active');
    elements.postDetailModal.classList.remove('active');
    elements.discussionsContainer.classList.remove('detail-view');
    document.body.style.overflow = 'auto';
}

function filterPostsByCategory(category) {
    const discussions = document.querySelectorAll('.discussion-card');
    let visibleCount = 0;

    discussions.forEach(discussion => {
        if (category === 'all' || discussion.dataset.category === category) {
            discussion.style.display = 'block';
            visibleCount++;
        } else {
            discussion.style.display = 'none';
        }
    });

    updateResultsCount(visibleCount);
}

function updateResultsCount(count) {
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        resultsCount.textContent = `${count} discussion${count !== 1 ? 's' : ''} found`;
    }
}

function createReplyForm() {
    const form = document.createElement('div');
    form.className = 'reply-form active';
    form.innerHTML = `
        <div class="form-group">
            <textarea class="reply-input" placeholder="Write your reply..."></textarea>
        </div>
        <div class="form-actions">
            <button type="button" class="btn btn-primary submit-reply">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
                Send Reply
            </button>
            <button type="button" class="btn btn-text cancel-reply">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                Cancel
            </button>
        </div>
    `;
    return form;
}

function initMobileMenu() {
    const mobileMenuTrigger = document.querySelector('.mobile-menu-trigger');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuTrigger && sidebar) {
        mobileMenuTrigger.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        document.addEventListener('click', (event) => {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(event.target) && 
                !mobileMenuTrigger.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}

function loadPostDetail(postId) {
    const post = document.querySelector(`.discussion-card[data-id="${postId}"]`);
    if (!post) return;

    const detailContent = document.querySelector('.post-detail-content');
    if (!detailContent) return;

    detailContent.innerHTML = `
        <div class="post-header">
            <div class="post-meta">
                <div class="post-author">
                    <div class="author-avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                    <div class="author-info">
                        <span class="author-name">${post.querySelector('.discussion-author').textContent}</span>
                        <span class="post-date">${post.querySelector('.discussion-date').textContent}</span>
                    </div>
                </div>
                <div class="post-actions">
                    <button class="btn btn-icon like-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span class="like-count">${post.querySelector('.like-count').textContent}</span>
                    </button>
                </div>
            </div>
            <h2 class="post-title">${post.querySelector('.discussion-title').textContent}</h2>
            <div class="post-category">${post.querySelector('.discussion-category').textContent}</div>
        </div>
        <div class="post-content">
            ${post.querySelector('.discussion-content').textContent}
        </div>
        <div class="post-comments">
            <h3>Comments</h3>
            <div class="comments-list">
                ${generateMockComments()}
            </div>
            <div class="comment-form">
                <textarea placeholder="Write a comment..."></textarea>
                <button class="btn btn-primary">Post Comment</button>
            </div>
        </div>
    `;
}

function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 24px';
    notification.style.borderRadius = '4px';
    notification.style.backgroundColor = type === 'error' ? '#f44336' : '#4caf50';
    notification.style.color = 'white';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function saveDiscussion(data) {
    if (!data.title || !data.content) {
        showError('Please fill in all required fields');
        return false;
    }

    if (data.title.length < 5) {
        showError('Title must be at least 5 characters long');
        return false;
    }

    if (data.content.length < 20) {
        showError('Content must be at least 20 characters long');
        return false;
    }

    const discussions = JSON.parse(localStorage.getItem('discussions') || '[]');
    const newDiscussion = {
        id: Date.now().toString(),
        title: data.title,
        content: data.content,
        category: data.category,
        author: JSON.parse(localStorage.getItem('currentUser'))?.name || 'Anonymous',
        date: new Date().toISOString(),
        likes: 0,
        comments: []
    };

    discussions.push(newDiscussion);
    localStorage.setItem('discussions', JSON.stringify(discussions));
    return true;
}

function addComment(discussionId, content) {
    if (!content) {
        showError('Please write a comment');
        return false;
    }

    if (content.length < 5) {
        showError('Comment must be at least 5 characters long');
        return false;
    }

    const discussions = JSON.parse(localStorage.getItem('discussions') || '[]');
    const discussion = discussions.find(d => d.id === discussionId);

    if (discussion) {
        const newComment = {
            id: Date.now().toString(),
            content,
            author: JSON.parse(localStorage.getItem('currentUser'))?.name || 'Anonymous',
            date: new Date().toISOString()
        };

        discussion.comments.push(newComment);
        localStorage.setItem('discussions', JSON.stringify(discussions));
        return true;
    }

    return false;
}

function likeDiscussion(discussionId) {
    const discussions = JSON.parse(localStorage.getItem('discussions') || '[]');
    const discussion = discussions.find(d => d.id === discussionId);

    if (discussion) {
        discussion.likes++;
        localStorage.setItem('discussions', JSON.stringify(discussions));
        return true;
    }

    return false;
}

async function loadDiscussions(page = 1) {
    try {
        const discussions = JSON.parse(localStorage.getItem('discussions') || '[]');
        const sortedDiscussions = sortDiscussions(discussions);
        const { paginatedDiscussions, totalPages } = paginateDiscussions(sortedDiscussions, page);
        updateDiscussionsList(paginatedDiscussions);
        updatePagination(page, totalPages);
    } catch (error) {
        showError('Error loading discussions');
    }
}

function sortDiscussions(discussions) {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    return [...discussions].sort((a, b) => {
        if (activeFilter === 'latest') return new Date(b.date) - new Date(a.date);
        if (activeFilter === 'popular') return b.likes - a.likes;
        return b.comments.length - a.comments.length;
    });
}

function paginateDiscussions(discussions, page) {
    const perPage = 10;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
        paginatedDiscussions: discussions.slice(start, end),
        totalPages: Math.ceil(discussions.length / perPage)
    };
}

function updateDiscussionsList(discussions) {
    if (!elements.discussionsList) return;

    elements.discussionsList.innerHTML = discussions.map(discussion => `
        <div class="discussion-card" data-id="${discussion.id}" data-category="${discussion.category}">
            <div class="discussion-header">
                <div class="discussion-meta">
                    <span class="discussion-author">${discussion.author}</span>
                    <span class="discussion-date">${formatDate(discussion.date)}</span>
                </div>
                <div class="discussion-category">${discussion.category}</div>
            </div>
            <h3 class="discussion-title">${discussion.title}</h3>
            <p class="discussion-content">${discussion.content}</p>
            <div class="discussion-footer">
                <button class="btn btn-text join-discussion">Join Discussion</button>
                <div class="discussion-stats">
                    <span class="comments-count">${discussion.comments.length} comments</span>
                    <button class="btn btn-icon like-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span class="like-count">${discussion.likes}</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updatePagination(currentPage, totalPages) {
    if (!elements.paginationContainer) return;

    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="btn btn-text page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }
    elements.paginationContainer.innerHTML = paginationHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
        return date.toLocaleDateString();
    } else if (days > 0) {
        return `${days}d ago`;
    } else if (hours > 0) {
        return `${hours}h ago`;
    } else if (minutes > 0) {
        return `${minutes}m ago`;
    } else {
        return 'Just now';
    }
}

function generateMockComments() {
    return `
        <div class="comment" data-id="1">
            <div class="comment-author">John Doe</div>
            <div class="comment-content">This is a great discussion!</div>
            <div class="comment-actions">
                <button class="btn btn-text reply-btn">Reply</button>
            </div>
        </div>
    `;
}

async function handlePostSubmission(event) {
    event.preventDefault();

    const content = document.getElementById('postContent').value.trim();
    if (!content) {
        showError('Please enter some content for your post');
        return;
    }

    const post = {
        content,
        author: auth.getCurrentUser(),
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: []
    };

    try {
        // This will be replaced with actual API call
        // await createPost(post);
        
        // For now, we'll just show success and clear the form
        showSuccess('Post created successfully!');
        clearPostForm();
        loadPosts(); // Reload posts
    } catch (error) {
        console.error('Error creating post:', error);
        showError('Failed to create post. Please try again.');
    }
}

function clearPostForm() {
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.reset();
    }
}

async function loadPosts(filter = 'all') {
    try {
        // This will be replaced with actual API call
        // const posts = await getPosts(filter);
        
        // For now, we'll just show a placeholder
        const postsContainer = document.querySelector('.posts-container');
        if (postsContainer) {
            postsContainer.innerHTML = '<p>Posts will be displayed here</p>';
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        showError('Failed to load posts. Please try again.');
    }
}

async function handleLike(postId) {
    try {
        // This will be replaced with actual API call
        // await likePost(postId);
        
        // For now, we'll just reload the posts
        loadPosts();
    } catch (error) {
        console.error('Error liking post:', error);
        showError('Failed to like post. Please try again.');
    }
}

async function handleComment(postId, comment) {
    if (!comment.trim()) {
        showError('Please enter a comment');
        return;
    }

    try {
        // This will be replaced with actual API call
        // await addComment(postId, {
        //     content: comment,
        //     author: auth.getCurrentUser(),
        //     timestamp: new Date().toISOString()
        // });
        
        // For now, we'll just reload the posts
        loadPosts();
    } catch (error) {
        console.error('Error adding comment:', error);
        showError('Failed to add comment. Please try again.');
    }
}

function addEventListeners() {
    // Add event listeners for like buttons
    document.addEventListener('click', (event) => {
        if (event.target.matches('.like-btn')) {
            const postId = event.target.dataset.postId;
            handleLike(postId);
        }
    });

    // Add event listeners for comment forms
    document.addEventListener('submit', (event) => {
        if (event.target.matches('.comment-form')) {
            event.preventDefault();
            const postId = event.target.dataset.postId;
            const commentInput = event.target.querySelector('.comment-input');
            handleComment(postId, commentInput.value);
            commentInput.value = '';
        }
    });
}

loadDiscussions();