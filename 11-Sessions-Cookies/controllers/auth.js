const User = require("../models/user");
const cookieUtil = require("../util/cookie");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn =
  //  cookieUtil.getCookieValue(req.get("Cookie"), "isLoggedIn=") === "true";

  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  // Need to implement validation
  // Setting Cookie
  // res.setHeader("Set-Cookie", "isLoggedIn=true");
  // Using session
  User.findById("5c84ea1dd53d6531c5d83634")
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        if (err) {
          console.log("Error during save of session in postLogin: ", err);
        }
        res.redirect("/");
      });
    })
    .catch(err => console.log("Post Login error: ", err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.log("Error in postLogout for session destroy: ", err);
    }
    res.redirect("/");
  });
};
