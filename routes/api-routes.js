// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    // console.log('.................................................')
    // console.log(req);
    // console.log(req.user.dataValues);
    let userData = {
      firstname: req.user.dataValues.firstname,
      lastname: req.user.dataValues.lastname,
      username: req.user.dataValues.username,
      email: req.user.email,
      id: req.user.id
    }
    res.json(userData);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      username: req.body.userName,
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        username: req.user.username,
        email: req.user.email,
        id: req.user.id
      });
    }
  });



  // Create Project Form
  app.post("/api/create_project", (req, res) => {

    db.Project.create({
      title: req.body.title,
      description: req.body.description,
      UserId: req.user.id
    })
      .then(() => {
        res.redirect('back');
      })
      .catch(err => {
        res.status(401).json(err);
      });
  })

  // Search Projects

  app.get("/api/titlesearch/:term", (req, res) => {
   
    const term = req.params.term;

    db.Project.findAll({
      where: { title: { [Op.like]: '%'+ term + '%'}
    }})
    .then((searchResults) => {
      return res.json(searchResults);
    })
    .catch(err => {
      res.status(401).json(err);
    })

  })

  // delete project
  app.delete("/api/delete_project/:id", (req, res) => {
    let a = req.params.id;
    db.Project.destroy({
      where: {
        id: a
      }
    })
    .then((dbProjects) => {
      res.reload(dbProjects);
    })
    .catch(err => {
      res.status(401).json(err);
    });

  })


  
};
