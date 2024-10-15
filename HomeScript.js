let currentPage = 1;
let lastPage = 1;

// Infinite Scroll
window.addEventListener("scroll", function () {
    const endOfPage = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;
    if (endOfPage && currentPage < lastPage) {
        currentPage++;
        getPosts(false, currentPage);
    }
});

// Function to get posts
function getPosts(reload = true, page = 1) {
    toggleLoader(true);
    axios.get(`${baseUrl}/posts?limit=5&page=${page}`).then(response => {
        toggleLoader(false);
        let posts = response.data.data;
        lastPage = response.data.meta.last_page;
        if (reload) {
            document.getElementById("posts").innerHTML = "";
        }
        for (post of posts) {
            let author = post.author;
            let postTitle = post.title ? post.title : 'Welcome to my First post';
            let user = getCurrentUser();
            let isMyPost = user !== null && author.id === user.id;
            let editBtn = isMyPost ? `
                <button class="btn btn-danger" style="margin-left:5px; float:right" onclick="deletePostBtn('${encodeURIComponent(JSON.stringify(post))}')">delete</button>
                <button class="btn btn-secondary" style="float:right" onclick="editPostBtn('${encodeURIComponent(JSON.stringify(post))}')">edit</button>` : ``;

            let content = `
                <div class="card w-100 shadow">
                    <div class="card-header">
                        <span onclick="userClicked(${author.id})" style="cursor: pointer;">
                            <img src="${author.profile_image}" alt="" style="width: 40px; height: 40px;" class="rounded-circle border border-3">
                            <b>@${author.username}</b>
                        </span>
                        ${editBtn}
                    </div>
                    <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer">
                        <img src="${post.image}" class="w-100" alt="">
                        <h6 class="mt-1" style="color: rgb(193, 193, 193);"> ${post.created_at}</h6>
                        <h5>${postTitle}</h5>
                        <p>${post.body}</p>
                        <hr>
                        <div class="comments">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg>
                            <span>(${post.comments_count}) Comments 
                                <span id="post-tags-${post.id}"></span>
                            </span>
                        </div>
                    </div>
                </div>`;

            document.getElementById("posts").innerHTML += content;

            let postIdTag = `post-tags-${post.id}`;
            document.getElementById(postIdTag).innerHTML = "";
            for (tag of post.tags) {
                let tagContent = `<button class="btn btn-sm rounded-5" style="background-color: gray; color: white;">${tag.name}</button>`;
                document.getElementById(postIdTag).innerHTML += tagContent;
            }
        }
    });
}

function postClicked(postId) {
    window.location = `postDetails.html?postId=${postId}`;
}

function addBtnClicked() {
    document.getElementById("post-idd").value = "";
    document.getElementById("post-modal-title").innerHTML = "Create Post";
    document.getElementById("CreateTitle").value = "";
    document.getElementById("text-post").value = "";
    let postModal = new bootstrap.Modal(document.getElementById("post-modal"), {});
    postModal.toggle();
}

function userClicked(userId) {
    window.location = `profile.html?userid=${userId}`;
}


