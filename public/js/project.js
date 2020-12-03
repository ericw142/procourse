$(document).ready(() => {
  // Modal
  const modal = document.getElementById("myModal");
  const btn = document.getElementById("requestBtn");
  const span = document.getElementsByClassName("close")[0];

  span.onclick = function () {
    modal.style.display = "none";
  }
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  let iD = $(".viewCollab").data("value");
  let jquerySelect = ".collabSection" + iD;
  console.log(iD);

  $.ajax({
    url: "/viewcollab/" + iD,
    method: "GET"
  }).then(function (response) {
    $(jquerySelect).empty();

    console.log(response.length, "resp");
    let collabLength = response.length;
    let numOfcollab = $("<p>");
    numOfcollab.text("This project has " + collabLength + " collaborators")
    $("#detail").append(numOfcollab);

  })

  // View Collaborators
  $(".viewCollab").on("click", function (event) {
    event.preventDefault();
    // Selecting id and corresponding div
    let id = $(this).data("value");
    let jquerySelector = ".collabSection" + id;
    console.log(id);

    $.ajax({
      url: "/viewcollab/" + id,
      method: "GET"
    }).then(function (response) {
      $(jquerySelector).empty();
      console.log(response.length, "resp");
      if (response.length < 1) {
        let noCollab = $("<p>");
        noCollab.text("No collaborators");
        $(jquerySelect).append(noCollab)
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

  // Request to Join
  $(btn).on("click", function (event) {
    event.preventDefault();

    let projectId = $(this).data("id");

    // If current user is owner of project, display message
    $.ajax({
      url: "/api/user_data",
      method: "GET"
    }).then(function (response) {
      // Store requester's info for later

      let requesterId = response.id;
      let requesterUsername = response.username;
      let requesterEmail = response.email;

      if (requesterId === projectId) {
        alert("You are the owner of this project");
      } else {
        // Else, display modal form for request to join the project

        modal.style.display = "block";

        $("#collab-form").on("submit", function (event) {
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
            modal.style.display = "none";
            window.location.assign('/projectdetails/' + projectId);
          })
        })
      }
    })

  })



  //======================================
  let id = $("#showReq").data("value");
  let jquerySelector = ".requestSection" + id;

  $.ajax({
    url: "/viewRequests/" + id,
    method: "GET"
  }).then(function (res) {
    $(jquerySelector).empty();

    let reqLength = res.length;
    let numOfReq = $("<p>");
    numOfReq.text("This project has " + reqLength + " requests to join")
    $("#detail").append(numOfReq);
  })


  $("#showReq").on("click", function (event) {
    event.preventDefault();

    //------------------------------------------

    // ViewRequest-----------
    let userId = $(this).data("id");

    // If current user is owner of project, display message
    $.ajax({
      url: "/api/user_data",
      method: "GET"
    }).then(function (response) {
      // Store requester's info for later
      let requesterId = response.id;
      let requesterUsername = response.username;
      let requesterEmail = response.email;

      if (requesterId === userId) {


        //==============================================
        // Selecting id and corresponding div
        let id = $("#showReq").data("value");
        let jquerySelector = ".requestSection" + id;
        console.log(id);

        $.ajax({
          url: "/viewRequests/" + id,
          method: "GET"
        }).then(function (res) {
          $(jquerySelector).empty();

          for (var i = 0; i < res.length; i++) {
            let collabName = $("<p>");
            collabName.text(res[i].requesterUsername);
            $(jquerySelector).append(collabName);
            let message = $("<p>");
            message.text(res[i].requesterMessage);
            $(jquerySelector).append(message);
            // Approve Button
            let approveBtn = $("<button data-requestvalue=" + res[i].id + ">");
            approveBtn.addClass("approveButton");
            approveBtn.text("approve");
            let denyBtn = $("<button data-value=" + res[i].id + ">");
            denyBtn.addClass("denyButton");
            denyBtn.text("deny");
            $(jquerySelector).append(approveBtn, denyBtn);
          }

          $(".approveButton").on("click", function (event) {
            event.preventDefault();

            let requestId = $(this).data("requestvalue");

            $.ajax({
              url: "api/approveRequest/" + requestId,
              method: "PUT"
            }).then(() => {
              alert("Approved!");
              location.reload()
            })
          })

          $(".denyButton").on("click", function (event) {
            event.preventDefault();

            let requestId = $(this).data("value");
            console.log(requestId);
            $.ajax({
              url: "api/denyRequest/" + requestId,
              method: "DELETE"
            }).then(() => {
              alert("Not Approved!");
              location.reload();
            })
          })

        })
      }
      else {
        alert("Only owners have access to requests")
      }
    })
  })
})


