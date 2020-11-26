$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    console.log(data);
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

    

    $.ajax({
      url: "/api/titlesearch/"+term,
      method: "GET"
    }).then(function(response) {
      $(".searchContent").empty();
      console.log(response);

      // Creating Search result elements
      for (var i = 0; i < response.length; i++) {
        console.log(response[i]);

        let searchCard = $("<div>");

        let searchTitle = $("<p>");
        searchTitle.text(response[i].title);
        searchCard.append(searchTitle);

        let searchDesc = $("<p>");
        searchDesc.text(response[i].description);
        searchCard.append(searchDesc);

        $(".searchContent").prepend(searchCard);
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
