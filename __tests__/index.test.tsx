import { render, screen } from "@testing-library/react";
import { calcNowHour } from "../app/utils/getNowHour";
import "@testing-library/jest-dom";

test("test negative hour", () => {
  expect(calcNowHour(-8, 5)).toBe(21);
});

test("test greater than 24  hour", () => {
  expect(calcNowHour(20, 5)).toBe(1);
});

test("test zero hour", () => {
  expect(calcNowHour(-5, 5)).toBe(0);
});
