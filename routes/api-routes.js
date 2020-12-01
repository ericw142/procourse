// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const Sequelize = require('sequelize');
const { create } = require("express-handlebars");
const Op = Sequelize.Op;

// Nodemailer
const nodemailer = require("nodemailer");

module.exports = function (app) {
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

    let errors = [];

    if (!req.body.title) {
      errors.push({ text: "Did Not Add A Title, Project Not Saved, Click Home To Return " });
      res.render('error', { errors })

    }
    else if (!req.body.description) {
      errors.push({ text: "Did Not Add A Description, Project Not Saved, Click Home To Return" });
      res.render('error', { errors })
    }

    else {
      db.Project.create({
        title: req.body.title,
        description: req.body.description,
        UserId: req.user.id,
        tag: req.body.tag
      }).then(() => {
        res.redirect('back');
      })
        .catch(err => {
          res.status(401).json(err);
      });  
    }
  })

  // Project Details Page
  app.get("/projectdetails/:id", (req, res) => {
    let projectID = req.params.id;
      db.Project.findOne({
        where: {
          id: projectID
        }
      }).then((project) => {
        res.render("project", { project });
      })
    
  })

  // Show Collaborators
  app.get("/viewcollab/:id", (req, res) => {
    let collabId = req.params.id;
    db.Collaborator.findAll({
      where: {
        ProjectId: collabId,
        approved: true
      }
    }).then((collab) => {
      return res.json(collab);
    })
    .catch(err => {
      res.status(401).json(err);
    })
  })

  // Request to Collaborate
  app.post("/api/newcollab", (req, res) => {
    async function sendMail() {
      let testAccount = await nodemailer.createTestAccount();

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "procourse48@gmail.com",
          pass: "jH^Vx660nZcI"
        },
      });

      let info = await transporter.sendMail({
        from: 'procourse48@gmail.com',
        to: req.body.requesterEmail,
        subject: "You sent a request on Procourse!",
        text: "You have successfully sent a collaborate request!",
        html: "<b>You have successfully sent a collaborate request!</b><p>The owner of the project may contact you with questions. Thank you for using Procourse!</p>",
      });
    }

    sendMail().catch(console.error);

    db.Collaborator.create({
      requesterId: req.body.requesterId,
      requesterUsername: req.body.requesterUsername,
      requesterEmail: req.body.requesterEmail,
      requesterMessage: req.body.requesterMessage,
      approved: false,
      ProjectId: req.body.ProjectId
    }).then(() => {
      res.redirect('back');
    })
      .catch(err => {
        res.status(401).json(err);
    });  
  })
  // View Requests
  app.get("/viewRequests/:id", (req, res) => {
    let collabId = req.params.id;
    db.Collaborator.findAll({
      where: {
        ProjectId: collabId,
        approved: false
      }
    }).then((collab) => {
      return res.json(collab);
    })
    .catch(err => {
      res.status(401).json(err);
    })
  })
    //-------------APPROVE--BUTTON---------------------
    app.put("/projectdetails/api/approveRequest/:id", (req, res) => {
    let urlId = req.params.id;
     db.Collaborator.update(
       {
      approved: true
  
     },
     {
       where: {
         id: urlId
       }
     }
     ).then((result) => {
       return res.json(result);
     })
    })

  //-------------APPROVE--BUTTON---------------------
  app.put("api/approveRequest/:id", (req, res) => {
    console.log(requestId);
   db.Collaborator.update(
     {
    approved: true

   },
   {
     where: {
       id: req.params.id
     }
   }
   ).then(() => {
     location.reload();
   })
  })


  // Project Search

  app.get("/api/titlesearch/:term", (req, res) => {
    let term = req.params.term;

    db.Project.findAll({
      where: {
        title: { [Op.like]: '%' + term + '%' }
      }
    })
      .then((searchResults) => {
        return res.json(searchResults);
      })
      .catch(err => {
        res.status(401).json(err);
      })

  })

  app.get("/api/usersearch/:term", (req, res) => {
    let term = req.params.term;

    db.User.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: '%' + term + '%' } },
          { lastName: { [Op.like]: '%' + term + '%' } },
          { username: { [Op.like]: '%' + term + '%' } },
          { email: { [Op.like]: '%' + term + '%' } }
        ]
      },
      include: [db.Project]
    })
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

  // --------Update------
  app.get("/api/update/:id", (req, res) => {
    db.Project.findOne({
      where: {
        id: req.params.id
      },

    })
      .then((project) => {
        res.render("update", { project });
        console.log(project);
      })
      .catch(err => {
        res.status(401).json(err);
      })

  });


  app.put("/api/update", function (req, res) {
    console.log(req.body);
    db.Project.update(

      {
        title: req.body.title,
        description: req.body.description
      },
      {
        where: {
          id: req.body.id
        }

      }
    ).then(result => {
      res.render("update", result)
    })
  });

};
