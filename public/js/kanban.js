// Make sure we wait to attach our handlers until the DOM is fully loaded.
$( document ).ready(function() {
  
    $( function() {
      $( ".draggable" ).sortable({connectWith: '.droppable'});
      $( ".droppable" ).sortable({
        receive: function( event, ui ) {
          let taskName = $(ui.item).html();
          let id =$(ui.item).attr('id');
          console.log($(ui.item).attr('id'));
          let newTask = { todo: taskName, inProgress: true, completed: true, id:id };
          console.log(taskName + newTask)
          console.log(newTask);
           // Send the PUT request.
           console.log($(ui.item))
           console.log(ui)
  
        $.ajax("/api/create_todo", {
          method: "PUT",
          data: newTask
        }).then(
          function() {
            console.log("todo changed to", inprogress);
            // Reload the page to get the updated list
            location.reload();
          }
        );
          console.log('inside drop function')
        }
      });
    } );

    $(function() {
      $("#kanban").on("click", function(event) {
        let id = $(this).data("id");
        let inProgress = $(this).data("inProgress");
    
        let newTask= {
          state: inProgress
        };
        let projectId = $(this).data("value");
        // Send the PUT request.
        $.ajax("/api/create_todo" + id, {
          method: "PUT",
          data: newTask
        }).then( function() {
            console.log("todo changed to", inProgress);
            // Reload the page to get the updated list
            location.reload();
          }
        );
      });
    });

    $("#kanban").on("submit", function(event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();
        console.log(event);

        let id = $(this).data("id")
        let newTask = {
          todo: $("#ca").val().trim(),
          inProgress: false,
          completed: false,
          projectid: id
        };
    
        // Send the POST request.
        $.ajax("/api/create_todo", {
          type: "POST",
          data: newTask
        }).then(
          function() {
            alert("Added a new Task");
            // Reload the page to get the updated list
            location.reload();
          }
        );
      });
});