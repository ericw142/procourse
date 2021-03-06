$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {

    $(".member-name").text(`${data.firstname}  ${data.lastname}`);
    $('.github').text(`${data.username}`);
    $('.email').text(`${data.email}`);
    let age = `${data.age}`;
    age = age.substring(0,10);
    $('.age').text(age);
  });

  // Modal
  const modal = document.getElementById("myModal");
  const btn = document.getElementById("myBtn");
  const span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  }
  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }


  // View Collaborators
  $(".viewCollab").on("click", function (event) {
    event.preventDefault();
    // Selecting id and corresponding div
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

  // Search Form

  $(".search-form").on("submit", function (event) {
    event.preventDefault();
    let term = $("#term").val();

    // Gets the filter user is searching by
    let filter = $("#searchType").val();

    let queryUrl;

    if (filter === 'title') {
      queryUrl = "/api/titlesearch/" + term;
    } else if (filter === 'user') {
      queryUrl = "/api/usersearch/" + term;
    }
    else {
      alert("Double check your search");
      return;
    }

    $.ajax({
      url: queryUrl,
      method: "GET"
    }).then(function (response) {

      $(".searchContent").empty();

      if (filter === 'title') {
        console.log(response);
        // Creating Search Results from Title
        for (var i = 0; i < response.length; i++) {

            let searchCard = $("<div class='card search'>");

          let searchTitle = $("<a>");
          searchTitle.text(response[i].title);
          searchTitle.data("id", response[i].id);
          searchTitle.attr("href", "/projectdetails/" + response[i].id);
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
            searchCard.addClass('searchCard')

            let searchTitle = $("<a>");
            searchTitle.text(response[i].Projects[x].title);
            searchTitle.data("id", response[i].Projects[x].id);
            searchTitle.attr("href", "/projectdetails/" + response[i].Projects[x].id);
            searchCard.append(searchTitle);

            let searchDesc = $("<p>");
            searchDesc.text(response[i].Projects[x].description);
            searchCard.append(searchDesc);

            $(".searchContent").prepend(searchCard);
          }

        }
      }


    }).then(() => {
      $("#term").val("");
    })

  });


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
        window.location.assign('/members');
      })
      .catch(err => {
        console.log(err);
      })
    } else {
      alert("You do not have permission to delete");
    }
  })
})

// Display number of outstanding requests
  $.ajax({
    url: "/api/requestdisplay",
    method: "GET"
  }).then((response) => {
    console.log(response);
    let requestNum = 0;
    let projectArr = [];
    let tracker = false;
    if (response[0] === undefined) {
      $("#requestDisplay").text("No pending requests");
      return;
    }
    // Filter through every collaborator on every project owned by the user
    for (var i = 0; i < response[0].Projects.length; i++) {
      for (var x = 0; x < response[0].Projects[i].Collaborators.length; x++) {
        if (response[0].Projects[i].Collaborators[x].approved === false) {
          // If there is an outstanding request, increase requestNum
          requestNum++;
          tracker = true;
        }
      }
      // If a request was logged on the current project, add project title into array
      if (tracker === true) {
        projectArr.push(response[0].Projects[i].title);
        tracker = false;
      }
    }
    
    if (requestNum > 0) {
      $("#requestDisplay").text(requestNum + " pending requests");
      for (var y = 0; y < projectArr.length; y++) {
        // Displays the title of each project that has an outstanding request
        let title = $("<p>");
        title.text("On project titled: " + projectArr[y]);
        $(".projectTracker").append(title);
      }
      
    } else {
      $("#requestDisplay").text("No pending requests");
    }
  })

});
