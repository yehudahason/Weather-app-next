import { render, screen } from "@testing-library/react";
import { calcNowHour } from "../app/utils/getNowHour";
import "@testing-library/jest-dom";

test("chack function getNowHour", () => {
  expect(calcNowHour(-8, 5)).toBe(21);
});

test("chack function getNowHour", () => {
  expect(calcNowHour(20, 5)).toBe(1);
});

test("chack function getNowHour", () => {
  expect(calcNowHour(-5, 5)).toBe(0);
});
