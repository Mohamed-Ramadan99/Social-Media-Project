
const baseUrl = `https://tarmeezacademy.com/api/v1`;
// Posts request
function setupUI (){
    const token = localStorage.getItem('token');
    const loginBtnDiv = document.getElementById('login-Div');
    const logoutDiv = document.getElementById('logout-div');
    const addBTn = document.getElementById("add-btn");
    if(!token){
      if(addBTn!== null) {
        addBTn.style.setProperty('display' , "none" , "important") ;
      }
      
      logoutDiv.style.setProperty('display' , "none" , "important") ;
      loginBtnDiv.style.setProperty('display' , "flex" , "important") ;
    } else {
      // for Logged in user
      if(addBTn!== null) {
        addBTn.style.setProperty('display' , "block" , "important") ;
      }
      logoutDiv.style.setProperty('display' , "flex" , "important") ;
      loginBtnDiv.style.setProperty('display' , "none" , "important") ;
      const user = getCurrentUser();
      document.getElementById("nav-username").innerHTML= user.username;
      document.getElementById("nav-img-profile").src = user.profile_image;

    }
   }

  //  ====Auth Function====//
  function RegisterBtnClicked(){
    let userName = document.getElementById('user-register').value
    let password = document.getElementById('password-register').value
    let name = document.getElementById('Name').value
    let img = document.getElementById("image-profile").files[0];
   
    // Because of image then we sent the request not in Json form but in FromData form
   const formData = new FormData();
   //               key   : body
   formData.append("username" , userName);
   formData.append("name" , name);
   formData.append("password" , password);
   formData.append("image" , img);
   
   const url = `${baseUrl}/register`;
   toggleLoader(true);
    axios.post(url , formData , {
     headers: {
       "Content-Type" : "multipart/from-data" ,
     }
    }).then(response => {
      toggleLoader(false);
     console.log(response.data)
     // to make the user login immediately after registered in 
     localStorage.setItem("token" , response.data.token);
     localStorage.setItem("user" , JSON.stringify(response.data.user));
     // to hide modal login
     const modal = document.getElementById('register-modal');
     const modalInstance = bootstrap.Modal.getInstance(modal);
     modalInstance.hide();
     setupUI();
      showSuccessAlert('Register success' , "primary");
    }).catch(error => {
     let message= error.response.data.message;
     alert(message);
    }).finally((()=> {
      toggleLoader(false);
    }))
    
      
      }
   function logout(){
     localStorage.removeItem('token');
     localStorage.removeItem('user')
      showSuccessAlert('logout success' , "primary");
     setupUI();
   }

   function loginBtnClicked(){
    let userName = document.getElementById('user').value
     let password = document.getElementById('password').value
    const params = {
      
      "username" :  userName ,
      "password" : password
    }
    const url = `${baseUrl}/login`;
    toggleLoader(true);
    
     axios.post(url , params).then(response => {
      toggleLoader(false);
      localStorage.setItem("token" , response.data.token);
      localStorage.setItem("user" , JSON.stringify(response.data.user));
      // to hide modal login
      const modal = document.getElementById('login-modal');
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      setupUI();
       showSuccessAlert('login success' , "primary");
     }).catch(err => {
    
      
     }).finally(()=> {
      toggleLoader(false);
     })
     
       }
       function getCurrentUser() {
        let user = null;
        const storageUser = localStorage.getItem('user');
        if (storageUser !== null) {
          try {
            user = JSON.parse(storageUser); // Parse if it's a JSON object
          } catch (error) {
            user = storageUser; // If it's just a plain string, return the string
          }
        }
        return user;
      }
       function showSuccessAlert(message , type){
        // const alertPlaceholder = document.getElementById("success-alert");
        // const alert = (message , type) => {
        //   const wrapper = document.createElement("div")
        //   wrapper.innerHTML= []
          
        var alert = document.createElement('div');
      alert.className = 'alert alert-' + type;
      alert.setAttribute('role', 'alert');
    
      // If dismissible, add the close button and Bootstrap's dismissal behavior
      var closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'btn-close';
      closeBtn.setAttribute('data-bs-dismiss', 'alert');
      closeBtn.setAttribute('aria-label', 'Close');
      
      alert.textContent = message; // Set alert message
      alert.appendChild(closeBtn); // Append the close button
      // setTimeout(function(){
    
      // } , 3000)
    
      // Find the target element and append the alert
      // var targetElement = document.querySelector(target);
      // if (targetElement) {
      //   targetElement.appendChild(alert);
      //   new bootstrap.Alert(alert); // Initialize Bootstrap alert for dismissal
      // } else {
      //   console.warn("Target container not found: " + target);
      // }
    }
    function  deletePostBtn(postObj){
      let post = JSON.parse(decodeURIComponent(postObj));
      document.getElementById("delete-post-id-input").value= post.id;
        let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"),{});
        postModal.toggle();
     }
    function confirmDeletePost(){
      let postId = document.getElementById("delete-post-id-input").value;
      let token = localStorage.getItem("token");
      let user = localStorage.getItem("user");
      
        const url = `${baseUrl}/posts/${postId}`;
        
         axios.delete(url , {
          headers: {
      "Content-Type" : "multipart/from-data" ,
      "authorization" : `Bearer ${token}`
         }
         }).then(response => {
        
          
          // to hide modal login
          const modal = document.getElementById('delete-post-modal');
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          setupUI();
           showSuccessAlert('delete success' , "primary");
         }).catch(err => {
          const message = err.response.data.message ;
          
         })
    }
      
    function editPostBtn(postObj){
      let post = JSON.parse(decodeURIComponent(postObj));
      console.log(post)
      document.getElementById("post-idd").value= post.id ;
      document.getElementById("post-modal-title").innerHTML="Edit Post"
      document.getElementById("CreateTitle").value = post.title ;
      document.getElementById("text-post").value = post.body ;
      // make one modal common with 2 different functions
      let postModal = new bootstrap.Modal(document.getElementById("post-modal"),{});
      postModal.toggle();
    }
    function CreatePostClicked(){
      let postId = document.getElementById("post-idd").value;
      let isCreateNotEdited = postId== null || postId == "" ;
    
  let title = document.getElementById('CreateTitle').value;
  let body = document.getElementById('text-post').value;
  let img = document.getElementById("img-post").files[0];
  
  // Because of image that we sent the request not in Json form but in FromData form
  const formData = new FormData();
  //               key   : body
  formData.append("body" , body);
  formData.append("title" , title);
  formData.append("image" , img);
  const token = localStorage.getItem("token");
  
  let url = ``;
  if(isCreateNotEdited){
    url = `${baseUrl}/posts`;
   
  } else {
    formData.append("_method" , "put");
    url = `${baseUrl}/posts/${postId}`;
  }
  toggleLoader(true);
  axios.post(url , formData , {  
    headers: {
      "Content-Type" : "multipart/from-data" ,
    "authorization" : `Bearer ${token}`
    }
     
  })
  .then(response => {
    const modal = document.getElementById('post-modal');
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    setupUI();
     showSuccessAlert('Post has created successfully' , "primary");
     getPosts();
  
   }).catch(err => {
    showSuccessAlert(err , "danger");
   }).finally(()=> {
    toggleLoader(false);
   })
  
     }
     function profileClicked(){
      const user = getCurrentUser();
      const userId = user.id ;
      window.location = `profile.html?userid=${userId}`
     }
    
     function toggleLoader(show = true){
      if(show){
        document.getElementById("Loader").style.visibility = "visible";
        
      } else {
        document.getElementById("Loader").style.visibility = "hidden" ; 
      }
      }
