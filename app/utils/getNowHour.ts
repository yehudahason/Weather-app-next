export function calcNowHour(tzoffset: number, fixedUTC?: number): number {
  let utcHour = new Date().getUTCHours();
  if (fixedUTC !== undefined) {
    utcHour = fixedUTC; //fixed value for testing
  }
  let localHour = utcHour + tzoffset;
  localHour %= 24;
  if (localHour < 0) {
    localHour += 24;
  }
  // console.log(`localHour:${localHour} tzoffset:${tzoffset}
  //     utcHour:${utcHour}`);
  return localHour;
}
