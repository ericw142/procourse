$(document).ready(() => {
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
})
