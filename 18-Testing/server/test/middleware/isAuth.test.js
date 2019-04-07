const expect = require("chai").expect;
const { isAuth } = require("../../middleware/middleware");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

const isAuthMiddlewareTest = () => {
  describe("Testing isAuth middleware", () => {
    const req = {
      value: null,
      get: () => {
        return this.value;
      },
      set: value => {
        this.value = value;
      }
    };

    const res = {};

    const next = () => {};

    it("should throw error if no authorization header is present", () => {
      expect(isAuth.bind(this, req, res, next)).to.throw("Not authenticated!");
    });

    it("should throw error if the authorization header is only one string", () => {
      req.set("Testing");
      expect(isAuth.bind(this, req, res, next)).to.throw();
    });

    it("should throw error if the token cannot be verify", () => {
      req.set("Bearer dummyToken");
      expect(isAuth.bind(this, req, res, next)).to.throw();
    });

    it("should yield a userId after decoding token", () => {
      req.set("Bearer dummyToken");
      // mock jwt.verify() function
      sinon.stub(jwt, "verify");
      jwt.verify.returns({ userId: "abc" });

      isAuth(req, res, next);

      expect(req).to.have.property("userId");
      expect(req).to.have.property("userId", "abc");
      expect(jwt.verify.called).to.be.true;

      jwt.verify.restore();
    });
  });
};

exports.isAuthMiddlewareTest = isAuthMiddlewareTest;
