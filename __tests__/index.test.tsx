import { calcTodayOrBefore } from "../app/utils/getNowHour";
import "@testing-library/jest-dom";

// test("test negative hour", () => {
//   expect(calcNowHour(-8, 5)).toBe(21);
// });

// test("test greater than 24  hour", () => {
//   expect(calcNowHour(20, 5)).toBe(1);
// });

// test("test zero hour", () => {
//   expect(calcNowHour(-5, 5)).toBe(0);
// });

test("negative time", () => {
  expect(calcTodayOrBefore(-8, 5)).toEqual({
    localHour: 21,
    dayOffset: -1,
  });
});

test("greater than 24 hour", () => {
  expect(calcTodayOrBefore(20, 5)).toEqual({
    localHour: 1,
    dayOffset: 1,
  });
});

test("zero hour", () => {
  expect(calcTodayOrBefore(-5, 5)).toEqual({
    localHour: 0,
    dayOffset: 0,
  });
});

test("normal hour", () => {
  expect(calcTodayOrBefore(5, 5)).toEqual({
    localHour: 10,
    dayOffset: 0,
  });
});
