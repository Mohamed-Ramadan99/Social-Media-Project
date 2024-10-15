setupUI();
getUser();
getPosts();
function getCurrentUserId(){
    const urlParam =  new URLSearchParams(window.location.search);
     const id = urlParam.get('userid');
     return id ;
}
function getUser(){
    let id = getCurrentUserId();
    axios.get(`${baseUrl}/users/${id}`)
    .then(response => {
        const user = response.data.data ;
        document.getElementById("email").innerHTML = user.email ;
        document.getElementById("name").innerHTML = user.name ;
        document.getElementById("username").innerHTML = user.username ;
        document.getElementById("main-info-image").src = user.profile_image ;
        document.getElementById("name-posts").innerHTML = user.username;
        // Posts and comments counts
        document.getElementById("posts-count").innerHTML = user.posts_count ;
        document.getElementById("comments-count").innerHTML = user.comments_count ;
})}

function getPosts(){
   let id = getCurrentUserId();
   
    axios.get(`${baseUrl}/users/${id}/posts`).then(response => {
    let posts = response.data.data ;
    document.getElementById("user-posts").innerHTML="";
    for(post of posts){
      let author = post.author;
      let postTitle = "";
      if(post.title!==null)
      postTitle=post.title ;
      let user = getCurrentUser();
      let isMyPost = user!== null && author.id == user.id ;
      let editBtn=``;
      if(isMyPost){
       editBtn = ` <button class="btn btn-danger" style=" margin-left:5px ; float:right" onclick="deletePostBtn('${encodeURIComponent(JSON.stringify(post))}')">delete</button>
        <button class="btn btn-secondary" style="float:right" onclick="editPostBtn('${encodeURIComponent(JSON.stringify(post))}')">edit</button>`
      
       }
       let content = `<div class="card w-100 shadow " >
                <div class="card-header">
                  <img src="${author.profile_image}" alt="" style="width: 40px; height: 40px;" class="rounded-circle border border-3">
                  <b>@${author.username}</b>
                  ${editBtn}
                </div>
                <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer">
                  <img src="${post.image}" class="w-100" alt="">
                  <h6 class="mt-1" style="color: rgb(193, 193, 193);"> ${post.created_at}</h6>
                  <h5> ${post.title? post.title : `Welcome to my First post`}</h5>
                  <p> ${post.body} </p>
                  <hr>
                  <div class="comments">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                      </svg>
                    <span>(${post.comments_count}) Comments 
                      <span id="post-tags-${post.id}"> 
                        
                        </span>
                      
                      </span>
                  </div>
                </div>
              </div>`;
              document.getElementById("user-posts").innerHTML+=content;
              let postIdTag = `post-tags-${post.id}`;
               document.getElementById(postIdTag).innerHTML="";
              
              for( tag of post.tags){
                console.log(tag);
                let tagContent = ` <button class="btn btn-sm rounded-5" style="background-color : gray; color : white" >
                          ${tag.name}
                          </button>` ;
                          document.getElementById(postIdTag).innerHTML+=tagContent;

              }

    }
  });
 }



