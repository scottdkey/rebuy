import { formatTime } from "./formatTimeForTimers.util.ts";

describe("formatTime Function", () => {
  it("should format time correctly", () => {
    expect(formatTime(0)).toEqual("00:00");
    expect(formatTime(59)).toEqual("00:59");
    expect(formatTime(60)).toEqual("01:00");
    expect(formatTime(125)).toEqual("02:05");
    expect(formatTime(3600)).toEqual("60:00");
    expect(formatTime(3665)).toEqual("61:05");
  });

  it("should handle negative time values", () => {
    expect(formatTime(-59)).toEqual("-00:59");
    expect(formatTime(-125)).toEqual("-02:05");
  });
});
