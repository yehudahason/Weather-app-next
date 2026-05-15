export function calcNowHour(tzoffset: number, test?: number): number {
  let utcHour;
  if (!test) {
    utcHour = new Date().getUTCHours();
  } else {
    utcHour = test; //fixed value for testing
  }
  let localHour = utcHour + tzoffset;
  localHour %= 24;
  if (localHour < 0) {
    localHour += 24;
  }
  console.log(`localHour:${localHour} tzoffset:${tzoffset}
      utcHour:${utcHour}`);
  return localHour;
}
