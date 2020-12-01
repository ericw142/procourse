$(document).ready(() => {
  // Getting references to our form and input
  const signUpForm = $("form.signup");
  const fNameInput = $("input#firstname-input");
  const lNameInput = $("input#lastname-input");
  const githubInput = $("input#github-input");
  const emailInput = $("input#email-input");
  const passwordInput = $("input#password-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      firstName: fNameInput.val().trim(),
      lastName: lNameInput.val().trim(),
      github: githubInput.val().trim(),
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password || !userData.email || !userData.firstName || !userData.lastName || !userData.github) {
      handleLoginErr();
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.firstName, userData.lastName, userData.github, userData.email, userData.password);
    fNameInput.val("");
    lNameInput.val("");
    githubInput.val("");
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser( firstName, lastName, github, email, password) {
    $.post("/api/signup", {
      firstName: firstName,
      lastName: lastName,
      github: github,
      email: email,
      password: password,
    })
      .then(() => {
        window.location.replace("/members");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text("All feilds are required for new users, Existing users please visit log in");
    $("#alert").fadeIn(500);
  }
});
