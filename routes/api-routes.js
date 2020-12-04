const db = require("../models");
const passport = require("../config/passport");
const Sequelize = require('sequelize');
const { create } = require("express-handlebars");
const Op = Sequelize.Op;

// Nodemailer
const nodemailer = require("nodemailer");

// Passport Authentication
module.exports = function (app) {
  // Route for logging in
  app.post("/api/login", passport.authenticate("local"), (req, res) => {

    let userData = {
      firstname: req.user.dataValues.firstname,
      lastname: req.user.dataValues.lastname,
      username: req.user.dataValues.username,
      email: req.user.email,
      id: req.user.id
    }
    res.json(userData);
  });
  // Route for signing up
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
        age: req.user.createdAt,
        id: req.user.id
      });
    }
  });


  // HOMEPAGE ROUTES
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

  // Project Search
  // Route to search by title
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

  ///////////////////////////////////////////////////////////////
  // project feeds/////////////////////////////////////////////

  app.get("/feeds", (req, res) => {
    db.Project.findAll({
      limit: 20
    })
    .then((project) =>{
      res.render('feeds', {project})
    })
    .catch((err) => {
      console.log('Sorry, Something went wrong, : ', err)
    });
  })
  //////////////////////////////////////////////////////////////////
  // kanban //////////////////////////////////////
  /// get tasks ///////////////////////////////
  app.get("/kanban", (req, res) => {
    db.Kanban.findAll({

    })
    .then((kanban) => {
      res.render('project', {kanban})
    })
    .catch((err) => {
      console.log('Sorry, wrong task name, : ', err)
    });
  })
  //// create new todo///////////////////////
  app.post("/api/create_todo", (req, res) => {
    let errors = []
    console.log('am here')
    if(!req.body.todo){
      errors.push({ text: "Please Add a Task, todo Not Saved, " });
      res.render('error', { errors })
    }else{
      db.Kanban.create({
        todo: req.body.todo,
        inProgress: req.body.inProgress,
        completed: req.body.completed,
        ProjectId: req.body.projectID
      }).then((result) => {
        console.log(result);
        return res.json(result);
      })
        .catch(err => {
          res.status(401).json(err);
        });
    }
  })
  ////// move todo to inprogress////////////
  app.put('/api/inprogress',(req,res) => {
    let todoId = req.params.id;
    db.Kanban.update(
      {
        inProgress: true

      },
      {
        where: {
          id: todoId
        }
      }
    ).then((result) => {
      return res.json(result);
    })
  })
  ///// move todo to completed////////////////////
  app.put('/api/completed',(req,res) => {
    let todoId = req.params.id;
    db.Kanban.update(
      {
        completed: true

      },
      {
        where: {
          id: todoId
        }
      }
    ).then((result) => {
      return res.json(result);
    })
  })
  /////////////////////////////////////////////////

  // Route to search by username
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


  // Delete project
  app.delete("/api/delete_project/:id", (req, res) => {
    let a = req.params.id;
    db.Project.destroy({
      where: {
        id: a
      }
    })
      .then((result) => {
        return res.json(result);
      })
      .catch(err => {
        res.status(401).json(err);
      });

  })

  // Update Project Page
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

  // Route to complete the update
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

  // PROJECT DETAILS PAGE
  // Route to get project info
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
    }).then((result) => {
      return res.json(result);
    })
      
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
  //Approve Button
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

  //Deny Button
  app.delete("/projectdetails/api/denyRequest/:id", (req, res) => {
    let id = req.params.id;
    db.Collaborator.destroy(
      {
        where: {
          id: id
        }
      }
    ).then((result) => {
      return res.json(result);
    })
  })


  // View all Requests
  app.get("/api/requestdisplay", (req, res) => {
    db.User.findAll({
      where: {
        id: req.user.id
      },
      include: [{
        model: db.Project,
        required: true,
        include: [{model: db.Collaborator, required: true}]
      }]
    }).then((result) => {
      return res.json(result);
    })
  })
};
