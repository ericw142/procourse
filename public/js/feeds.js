$(document).ready(() => {
    //  Delete Projects
    $(".del").on('click', function () {
      let id = $(this).data('value');
      let usersId = $(this).data('id')
      $.ajax({
        url: "/api/user_data",
        method: "GET"
      }).then(function (response) {
  
  
        if (response.id === usersId) {
      
      $.ajax({
        method: "DELETE",
        url: "/api/delete_project/" + id
      })
        .then(() => {
          window.location.assign('/feeds');
        })
        .catch(err => {
          console.log(err);
        })
      } else {
        alert("You do not have permission to delete");
      }
    })
  })
  
  $(".viewCollab").on("click", function (event) {
      event.preventDefault();
   
      let id = $(this).data("value");
      let jquerySelector = ".collabSection" + id;
  
      $.ajax({
        url: "/viewcollab/" + id,
        method: "GET"
      }).then(function (response) {
        $(jquerySelector).empty();
        console.log(response.length);
        if (response.length < 1) {
          let noCollab = $("<p>");
          noCollab.text("No collaborators");
          $(jquerySelector).append(noCollab)
        }
        else {
  
          for (var i = 0; i < response.length; i++) {
            let collabName = $("<p>");
            collabName.text(response[i].requesterUsername);
            $(jquerySelector).append(collabName);
          }
        }
      })
    })
  })
  