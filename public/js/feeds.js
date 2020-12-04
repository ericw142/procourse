
$(document).ready(() => {
  function getFeeds(event){
    $.ajax({
        url: "/api/feeds",
        method: "GET"
    }).then((res) => {
          
        $('.feeds').empty();
        console.log(res);
    })

}
  
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
  
