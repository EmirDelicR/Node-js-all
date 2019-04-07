const expect = require("chai").expect;
const { cors } = require("../../middleware/middleware");

const corsMiddlewareTest = () => {
  describe("Testing cors middleware", () => {
    const req = {};
    const res = {};
    const next = () => {};

    it("check - cors", () => {
      // TODO check how to test this and error also
      // cors(req, res, next);
      // expect(cors.bind(this, req, res, next)).to.throw("Not authenticated!");
    });
  });
};

exports.corsMiddlewareTest = corsMiddlewareTest;
