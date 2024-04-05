import { expect } from "chai";
import bcrypt from "bcrypt";
import { hashPassword, comparePassword } from "./password.util.js";

describe("Bcrypt Util Functions", () => {
  const plainPassword = "password123";

  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const hashedPassword = await hashPassword(plainPassword);
      expect(hashedPassword).to.be.a("string");
      expect(hashedPassword).to.not.equal(plainPassword);
    });

    it("should throw an error for invalid password", async () => {
      try {
        await hashPassword(undefined as any);
        // If no error is thrown, fail the test
        expect.fail("No error thrown");
      } catch (error) {
        expect(error).to.be.an("error");
        expect(error.message).to.equal("Error hashing password");
      }
    });
  });

  describe("comparePassword", () => {
    let hashedPassword: string;

    before(async () => {
      // Generate a hashed password to compare against
      hashedPassword = await bcrypt.hash(plainPassword, 10);
    });

    it("should return true for matching passwords", async () => {
      const match = await comparePassword(plainPassword, hashedPassword);
      expect(match).to.be.true;
    });

    it("should return false for non-matching passwords", async () => {
      const nonMatchingPassword = "wrongpassword";
      const match = await comparePassword(nonMatchingPassword, hashedPassword);
      expect(match).to.be.false;
    });

    it("should throw an error for invalid passwords", async () => {
      try {
        await comparePassword(undefined as any, hashedPassword);
        // If no error is thrown, fail the test
        expect.fail("No error thrown");
      } catch (error) {
        expect(error).to.be.an("error");
        expect(error.message).to.equal("Error comparing passwords");
      }
    });
  });
});
