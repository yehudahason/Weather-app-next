export function calcTodayOrBefore(
  tzOffset: number,
  fixedUTC?: { hours: number; minutes: number },
) {
  const now = new Date();

  const utcHours = fixedUTC?.hours ?? now.getUTCHours();
  const utcMinutes = fixedUTC?.minutes ?? now.getUTCMinutes();

  const totalUtcMinutes = utcHours * 60 + utcMinutes;
  const totalLocalMinutes = totalUtcMinutes + tzOffset * 60;

  let dayOffset = 0;

  if (totalLocalMinutes < 0) {
    dayOffset = -1;
  } else if (totalLocalMinutes >= 24 * 60) {
    dayOffset = 1;
  }

  const wrapped = ((totalLocalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);

  return {
    localHour: Math.floor(wrapped / 60),
    localMinute: wrapped % 60,
    dayOffset,
  };
}
