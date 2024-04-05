import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { signJWT, verifyJWT } from "./jwt.util.js";

import { expect } from "chai";

describe("JWT Functions", () => {
  const mockPayload: JwtPayload = { id: "12345", username: "testuser" };
  const mockToken = jwt.sign(mockPayload, "testkey", {
    expiresIn: "24h",
    jwtid: mockPayload.id, 
    subject: mockPayload.username
  });

  describe("signJWT", () => {
    it("should return a JWT token", () => {
      const token = signJWT(mockPayload);
      expect(token).to.be.a("string");
    });

    it("should throw an error if JWT key is undefined", () => {
      config.jwtKey = undefined as any;
      expect(() => signJWT(mockPayload)).to.throw("unable to find key in config");
    });
  });

  describe("verifyJWT", () => {
    it("should return decoded payload for valid JWT token", () => {
      config.jwtKey = "testkey";

      const decoded = verifyJWT(mockToken) as JwtPayload;
      expect({
        id: decoded.id,
        username: decoded.username
      }).to.deep.equal(mockPayload);
    });

    it("should return an error for invalid JWT token", () => {
      const invalidToken = "invalid.token.string";
      const result = verifyJWT(invalidToken);
      expect(result).to.have.property("success").equal(false);
      expect(result).to.have.property("error").that.is.a("string");
    });

    it("should return an error if JWT key is undefined", () => {
      config.jwtKey = undefined as any;
      const result = verifyJWT(mockToken) as any;
      expect(result).to.have.property("success").equal(false);
      expect(result).to.have.property("error").that.is.a("string");
      expect(result.error).to.equal("unable to find key in config");
    });
  });
});
