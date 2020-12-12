// Modal
const modal = document.getElementById("myModal");
const btn = document.getElementById("requestBtn");
const span = document.getElementsByClassName("close")[0];
let requesterId = 0;
let requesterUsername = "";
let requesterEmail = "";
let projectId = 0;
let projectVal = 0;

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
        collabName.text(" - " + response[i].requesterUsername);
        $(jquerySelector).append(collabName);
      }
    }
  })
})

// ==========================================
// Request to Join
$(btn).on("click", function (event) {
  event.preventDefault();

  projectId = $(this).data("id");

  projectVal = $(this).data("value");

  $.ajax({
    url: "/api/user_data",
    method: "GET"
  }).then(function (userData) {
    console.log(userData);
    // If current user is owner of project, display message
    $.ajax({
      url: "/api/collabver/" + projectVal,
      method: "GET"
    }).then(function (response) {
      console.log(response)

      if (response[0].UserId === userData.id) {
        alert("You are the owner of this project");
      } else {
        requesterId = userData.id;
        requesterUsername = userData.username;
        requesterEmail = userData.email;


        if (response[0].Collaborators.length === 0) {
          modal.style.display = "block";
        } else {
          let collabCheck = response[0].Collaborators.some(function (Collaborators) {
            if (Collaborators.requesterId === userData.id) {
              console.log(Collaborators.requesterId, userData.id, "REQ")

              return true;
            }
            else {
              return false;
            }

          })
          if (collabCheck === false) {
            modal.style.display = "block";
          }
          else {
            alert("Request previously sent");

          }
        }
      }
    }
    )
  })
})
// =========================================

$("#collab-form").on("submit", function (event) {
  event.preventDefault();


  let message = $("input[name='message']").val()
  console.log("new", {
    requesterId: requesterId,
    requesterUsername: requesterUsername,
    requesterEmail: requesterEmail,
    requesterMessage: message,
    ProjectId: projectVal
  });

  $.ajax({
    method: "POST",
    url: "/api/newcollab",
    data: {
      requesterId: requesterId,
      requesterUsername: requesterUsername,
      requesterEmail: requesterEmail,
      requesterMessage: message,
      ProjectId: projectVal
    }
  }).then((response) => {
    alert("Successfully created request");
    modal.style.display = "none";
    window.location.assign('/projectdetails/' + projectVal);
  })
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
          collabName.text("Username: " + res[i].requesterUsername);

          let collabEmail = $("<p>");
          collabEmail.text("Email: " + res[i].requesterEmail);
          collabName.addClass("underline");
          collabEmail.addClass("underline")

          $(jquerySelector).append(collabName);
          $(jquerySelector).append(collabEmail);
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


