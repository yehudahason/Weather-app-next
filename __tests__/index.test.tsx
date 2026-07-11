import { calcTodayOrBefore } from "../app/utils/getNowHour";
import "@testing-library/jest-dom";

test("negative time", () => {
  expect(calcTodayOrBefore(-8, { hours: 5, minutes: 0 })).toEqual({
    localHour: 21,
    dayOffset: -1,
    localMinute: 0,
  });
});

test("greater than 24 hour", () => {
  expect(calcTodayOrBefore(20, { hours: 5, minutes: 0 })).toEqual({
    localHour: 1,
    dayOffset: 1,
    localMinute: 0,
  });
});

test("zero hour", () => {
  expect(calcTodayOrBefore(-5, { hours: 5, minutes: 0 })).toEqual({
    localHour: 0,
    dayOffset: 0,
    localMinute: 0,
  });
});

test("half hour test", () => {
  expect(calcTodayOrBefore(-5, { hours: 5, minutes: 30 })).toEqual({
    localHour: 0,
    dayOffset: 0,
    localMinute: 30,
  });
});

test("normal hour", () => {
  expect(calcTodayOrBefore(5, { hours: 5, minutes: 0 })).toEqual({
    localHour: 10,
    dayOffset: 0,
    localMinute: 0,
  });
});
