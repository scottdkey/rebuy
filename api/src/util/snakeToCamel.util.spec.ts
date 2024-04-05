import { expect } from "chai";
import { snakeToCamel } from "./snakeToCamel.util.js"; 

describe("snakeToCamel Function", () => {
  it("should convert snake_case keys to camelCase", () => {
    const input = {
      user_id: 1,
      first_name: "John",
      last_name: "Doe",
      contact_info: {
        email_address: "johndoe@example.com",
        phone_number: "123-456-7890"
      },
      hobbies: [
        { hobby_id: 1, hobby_name: "Reading" },
        { hobby_id: 2, hobby_name: "Gaming" }
      ]
    };

    const expectedOutput = {
      userId: 1,
      firstName: "John",
      lastName: "Doe",
      contactInfo: {
        emailAddress: "johndoe@example.com",
        phoneNumber: "123-456-7890"
      },
      hobbies: [
        { hobbyId: 1, hobbyName: "Reading" },
        { hobbyId: 2, hobbyName: "Gaming" }
      ]
    };

    const result = snakeToCamel(input);
    expect(result).to.deep.equal(expectedOutput);
  });

  it("should handle null input", () => {
    const result = snakeToCamel(null);
    expect(result).to.be.null;
  });

  it("should handle non-object input", () => {
    const input = "not an object";
    const result = snakeToCamel(input);
    expect(result).to.equal(input);
  });

  it("should handle empty object", () => {
    const input = {};
    const result = snakeToCamel(input);
    expect(result).to.deep.equal(input);
  });

  it("should handle arrays with snake_case keys", () => {
    const input = [
      { user_id: 1, first_name: "John" },
      { user_id: 2, first_name: "Jane" }
    ];

    const expectedOutput = [
      { userId: 1, firstName: "John" },
      { userId: 2, firstName: "Jane" }
    ];

    const result = snakeToCamel(input);
    expect(result).to.deep.equal(expectedOutput);
  });
});
