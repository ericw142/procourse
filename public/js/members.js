$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    
    $(".member-name").text(`${data.firstname}  ${data.lastname}`);
  });

  // MODAL
    const modal = document.getElementById("myModal");
    const btn = document.getElementById("myBtn");
    const span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
      modal.style.display = "block";
    }
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  

  // SEARCH FORM

  $(".search-form").on("submit", function(event) {
    event.preventDefault();
    let term = $("#term").val();
   
    // Gets the filter user is searching by
    let filter = $("#searchType").val();

    let queryUrl;

    // TODO -- CREATE IF STATEMENT TO CHECK DIFFERENT TYPES OF SEARCHES AND CREATE AJAX QUERYURL
    if (filter === 'title') {
      queryUrl = "/api/titlesearch/"+term;
    } else if (filter === 'user') {
      queryUrl = "/api/usersearch/"+term;
    }
    else {
      alert("Double check your search");
      return;
    }

    $.ajax({
      url: queryUrl,
      method: "GET"
    }).then(function(response) {
      $(".searchContent").empty();
      
      if (filter === 'title') {
          // Creating Search Results from Title
          for (var i = 0; i < response.length; i++) {

            let searchCard = $("<div>");

            let searchTitle = $("<p>");
            searchTitle.text(response[i].title);
            searchCard.append(searchTitle);

            let searchDesc = $("<p>");
            searchDesc.text(response[i].description);
            searchCard.append(searchDesc);

            $(".searchContent").prepend(searchCard);
          }
      }
      
      if (filter === 'user') {
        console.log(response);
        // Creating Search Results from User
        for (var i = 0; i < response.length; i++) {
          // Prepends all projects from matching users
          for (var x = 0; x < response[i].Projects.length; x++) {
            let searchCard = $("<div>");

            let searchTitle = $("<p>");
            searchTitle.text(response[i].Projects[x].title);
            searchCard.append(searchTitle);

            let searchDesc = $("<p>");
            searchDesc.text(response[i].Projects[x].description);
            searchCard.append(searchDesc);

            $(".searchContent").prepend(searchCard);
          }
          
        }
      }


    })

  });
  

  //  delete projects
  $(".del").on('click', function() {
     let id = $(this).data('value');
     console.log(id);
    $.ajax({
      method: "DELETE",
      url: "/api/delete_project/"  + id
    })
    .then(() =>{
      alert('project deleted');
    })
    .catch(err => {
      console.log(err);
    })
  })
    
});
