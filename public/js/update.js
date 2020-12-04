$(document).ready(() => {
// Submit function for update page
  $("#updForm").on("submit", function (event) {
    console.log("CLICK");
    event.preventDefault();

    if (!$("#title").val().trim() || !$("#description").val().trim()) {
      return;
    }
    var id = $(this).data("id")
    var newProject = {
      id: id,
      title: $("#title").val().trim(),
      description: $("#description").val().trim(),
    };

    console.log(newProject);
    updateProject(newProject);

  });


  function updateProject(project) {

    console.log(project);
    $.ajax({
      method: "PUT",
      url: "/api/update/",
      data: project
    })
      .then(function () {
        window.location.href = "/members";
      });
  }
});