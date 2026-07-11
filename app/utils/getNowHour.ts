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
  console.log(`localHour:${localHour} tzoffset:${tzoffset}
      utcHour:${utcHour}`);
  return localHour;
}
export function calcTodayOrBefore(tzOffset: number, fixedUTC?: number) {
  const utcHour = fixedUTC ?? new Date().getUTCHours();

  const rawHour = utcHour + tzOffset;

  let dayOffset = 0;
  if (rawHour < 0) {
    dayOffset = -1; // previous day
  } else if (rawHour >= 24) {
    dayOffset = 1; // next day
  }

  const localHour = ((rawHour % 24) + 24) % 24;

  return {
    localHour,
    dayOffset, // -1 = yesterday, 0 = today, 1 = tomorrow
  };
}
