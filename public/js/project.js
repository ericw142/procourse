$(document).ready(() => {
  // Modal
  const modal = document.getElementById("myModal");
  const btn = document.getElementById("requestBtn");
  const span = document.getElementsByClassName("close")[0];

  span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  $.get("/api/user_data").then(data => {
    
    $(".userid").text(`${data.firstname}  ${data.lastname}`);
  });

    // View Collaborators
$(".viewCollab").on("click", function(event) {
    event.preventDefault();
    // Selecting id and corresponding div
    let id = $(this).data("value");
    let jquerySelector = ".collabSection"+id;
    console.log(id);

    $.ajax({
      url: "/viewcollab/"+id,
      method: "GET"
    }).then(function(response) {
      $(jquerySelector).empty();

      console.log(response);

      for (var i = 0; i < response.length; i++) {
        let collabName = $("<p>");
        collabName.text(response[i].requesterUsername);
        $(jquerySelector).append(collabName);
      }
    })
  })

  //-----------------APPROVE----BUTTON-----------
       // ViewRequest-----------
$("#showReq").on("click", function(event) {
  event.preventDefault();
  // Selecting id and corresponding div
  let id = $(this).data("value");
  let jquerySelector = ".requestSection"+id;
  console.log(id);

  $.ajax({
    url: "/viewRequests/"+id,
    method: "GET"
  }).then(function(response) {
    $(jquerySelector).empty();

    console.log(response);

    for (var i = 0; i < response.length; i++) {
      let collabName = $("<p>");
      collabName.text(response[i].requesterUsername);
      $(jquerySelector).append(collabName);
      let message = $("<p>");
      message.text(response[i].requesterMessage);
      $(jquerySelector).append(message);
      let approveBtn = $("<button data-value=" + response[i].id + ">");
      approveBtn.addClass("approveButton");
      approveBtn.text("approve");
      // approveBtn.data("value", response[i].id);
      $(jquerySelector).append(approveBtn);
    }

    $(".approveButton").on("click", function(event){
      event.preventDefault();
      
      let requestId = $(this).data("value");
    
      $.ajax({
        url: "api/approveRequest/" + requestId,
        method: "PUT"
      }).then(()=>{
        alert("Youve Approved!");
      })
    })
  })
})

  // Request to Join
  $(btn).on("click", function(event) {
    event.preventDefault();

    let projectId = $(this).data("value");

    // If current user is owner of project, display message
    $.ajax({
      url: "/api/user_data",
      method: "GET"
    }).then(function(response) {
      // Store requester's info for later
      let requesterId = response.id;
      let requesterUsername = response.username;
      let requesterEmail = response.email;

      if (requesterId === projectId) {
        alert("You are the owner of this project");
      } else {
        // Else, display modal form for request to join the project
        
          modal.style.display = "block";

          $("#collab-form").on("submit", function(event) {
            event.preventDefault();

            let message = $("input[name='message']").val()
            console.log(message);

            $.ajax({
              method: "POST",
              url: "/api/newcollab",
              data: {
                requesterId: requesterId,
                requesterUsername: requesterUsername,
                requesterEmail: requesterEmail,
                requesterMessage: message,
                ProjectId: projectId
              }
            }).then((response) => {
              alert("Successfully created request");
            })
          })
      }
    })
    
  })

})
