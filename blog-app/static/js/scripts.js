/*!
    * Start Bootstrap - SB Admin v6.0.2 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    (function($) {
    "use strict";

    // Add active state to sidbar nav links
    var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
        $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function() {
            if (this.href === path) {
                $(this).addClass("active");
            }
        });

    // Toggle the side navigation
    $("#sidebarToggle").on("click", function(e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
    });
})(jQuery);

// Add Post
let currentDate = new Date().toDateString();
function doPost(form){

    let formData = {
            author : form.author.value,
            title : form.title.value, 
            category:form.category.value, 
            content : form.content.value,
            image : imagePath,
            date : currentDate
        }
    
    $.ajax({
        url:"/do-post",
        method : "POST",
        data: formData,
        success : (res)=>{
            alert(res);
            window.location = "/"
        }
    });

    return false;
}

//Update post
function doEditPost(form){
   
    if(imagePath == ""){
        imagePath = form.imagePath.value;
    }
    let formData = {
            author : form.author.value,
            title : form.title.value, 
            category:form.category.value, 
            content : form.content.value,
            image : imagePath,
            date : currentDate,
            id: form.id.value
        }
    
    $.ajax({
        url:"/do-update-post",
        method : "POST",
        data: formData,
        success : (res)=>{
            alert(res);
            window.location = "/"
        }
    });

    return false;
}


//delete Post
function doDelete(postId,image){
    let data = {
       id:postId,
       image:image
    }
    $.ajax({
        url:"/do-delete",
        method:"POST",
        data:data,
        success:(res)=>{
            alert(res);
            window.location = "/"
        }
    });
}



// Upload Image
let imagePath = "";
$("#form-upload").on("submit",(e)=>{
    e.preventDefault();
    $.ajax({
        url:"/do-upload-image",
        method:"POST",
        data: new FormData(document.getElementById("form-upload")),
        contentType:false,
        cache:false,
        processData:false,
        success:(res)=>{
            imagePath = res;
            $("#myModal").modal("hide");
        }
    });
});


// Update Image
$("#form-update").on("submit",(e)=>{
    e.preventDefault();
    $.ajax({
        url:"/do-update-image",
        method:"POST",
        data: new FormData(document.getElementById("form-update")),
        contentType:false,
        cache:false,
        processData:false,
        success:(res)=>{
            imagePath = res;
            $("#myModal").modal("hide");
        }
    });
});

