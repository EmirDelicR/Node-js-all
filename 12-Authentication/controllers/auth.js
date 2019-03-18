const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const cookieUtil = require("../util/cookie");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn =
  //  cookieUtil.getCookieValue(req.get("Cookie"), "isLoggedIn=") === "true";
  const message = req.flash("error");
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message.length > 0 ? message[0] : null
  });
};

exports.getSignup = (req, res, next) => {
  const message = req.flash("error");
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message.length > 0 ? message[0] : null
  });
};

exports.postLogin = (req, res, next) => {
  // Need to implement validation
  // Setting Cookie
  // res.setHeader("Set-Cookie", "isLoggedIn=true");
  // Using session
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash("error", "Invalid email!");
        return res.redirect("/login");
      }
      return bcrypt
        .compare(password, user.password)
        .then(passwordMatch => {
          if (!passwordMatch) {
            req.flash("error", "Invalid password!");
            return res.redirect("/login");
          }
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save(err => {
            if (err) {
              console.log("Error during save of session in postLogin: ", err);
            }
            res.redirect("/");
          });
        })
        .catch(err => {
          console.log("Error from postLogin - compering passwords: ", err);
          res.redirect("/login");
        });
    })
    .catch(err => console.log("Post Login error: ", err));
};

exports.postSignup = (req, res, next) => {
  const userData = {
    email: req.body.email,
    password: req.body.password,
    cart: { items: [] }
  };
  const confirmPassword = req.body.confirmPassword;

  // @ed Do validation { later }

  // Check if user exist
  User.findOne({ email: userData.email })
    .then(user => {
      if (user) {
        req.flash("error", "Email already exist!");
        return res.redirect("/signup");
      }
      return bcrypt.hash(userData.password, 12);
    })
    .then(hashPassword => {
      userData.password = hashPassword;
      const newUser = new User(userData);
      return newUser.save();
    })
    .then(result => {
      res.redirect("/login");
    })
    .catch(err => {
      console.log("Error from postSignup . Find User: ", err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.log("Error in postLogout for session destroy: ", err);
    }
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  const message = req.flash("error");
  res.render("auth/reset", {
    pageTitle: "Password Reset",
    path: "/reset",
    errorMessage: message.length > 0 ? message[0] : null
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log("Error from postReset for crypto.randomBytes: ", err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash("error", "No account whit that email!");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600 * 1000; // + One hour

        return user.save();
      })
      .then(result => {
        if (result) {
          res.redirect(`/reset/${token}`);
        }
        // Send email
        /*
        transporter
          .sendMail({
            to: req.body.email,
            from: "test@test.com",
            subject: "Password reset",
            html: `
              <p>Password request</p>
              <p>Click <a href="http://localhost:300/reset/${token}">here</a> to reset password!</p>
            `
          })
        */
      })
      .catch(err => {
        console.log("Error from postReset for User.findOne: ", err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  // $gt id Grater then
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      const message = req.flash("error");
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message.length > 0 ? message[0] : null,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log("Error form User.findOne in getNewPassword: ", err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashPassword => {
      resetUser.password = hashPassword;
      resetUser.resetTokenExpiration = undefined;
      resetUser.resetToken = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect("/login");
    })
    .catch(err => {
      console.log("Error form User.findOne in postNewPassword: ", err);
    });
};
