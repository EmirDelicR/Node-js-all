const expect = require("chai").expect;
const sinon = require("sinon");
const User = require("../../models/user");
const AuthController = require("../../controllers/auth");

const authControllerTest = () => {
  describe("Testing auth controller - Login function", () => {
    beforeEach(() => {
      /** Mock User model function findOne */
      sinon.stub(User, "findOne");
      const err = new Error();
    });

    afterEach(() => {
      User.findOne.restore();
    });

    const req = {
      body: {
        email: "test@test.com",
        password: "tester"
      }
    };

    const err = new Error();
    const res = {};

    const next = error => {
      err.statusCode = error.statusCode || 500;
      err.data = error.data || null;
      err.message = error.message;
    };

    it("should throw error with code 500 if accessing the database fails", async () => {
      User.findOne.throws();
      await AuthController.login(req, res, next);
      expect(err).to.be.an("error");
      expect(err).to.have.property("statusCode", 500);
      expect(err).to.have.property("message", "Error");
    });

    it("should throw error with code 401 if user can not be found", async () => {
      await AuthController.login(req, res, next);
      expect(err).to.be.an("error");
      expect(err).to.have.property("statusCode", 401);
      expect(err).to.have.property(
        "message",
        "A user with this email could not be found!"
      );
    });

    // TODO mock response from User.findOne to return user
  });
};

exports.authControllerTest = authControllerTest;
