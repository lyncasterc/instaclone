interface Options {
  isCommentFormat?: boolean;
}

type TimeUnits = 'Seconds' | 'Hours' | 'Minutes' | 'Days' | undefined;

const MS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;
const DAYS_IN_YEAR = 365;

const TIME_UNITS_MAP = {
  Seconds: { short: 's', singular: ' second ago', plural: ' seconds ago' },
  Minutes: { short: 'm', singular: ' minute ago', plural: ' minutes ago' },
  Hours: { short: 'h', singular: ' hour ago', plural: ' hours ago' },
  Days: { short: 'd', singular: ' day ago', plural: ' days ago' },
};

/**
 * Calculates the time elapsed since a given date and returns a formatted string representation.
 * @param {Date} date - The date to calculate the time since.
 * @param {object} options - Optional parameters.
 * @param {boolean} options.isCommentFormat Optional. If true, the output will be formatted for
 * comments (e.g., "2w" for 2 weeks). Default is false.
 * @returns {string} A string representation of the time elapsed since the given date.
 *
 * @example
 * // Returns "5 minutes ago"
 * getTimeSinceDate(new Date(Date.now() - 5 * 60 * 1000));
 *
 * @example
 * // Returns "2w" (2 weeks)
 * getTimeSinceDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), { isCommentFormat: true });
 *
 * @example
 * // Returns "June 1, 2022"
 * getTimeSinceDate(new Date('2022-06-01'));
 *
 * @example
 * // Returns "June 1, 2021"
 * getTimeSinceDate(new Date('2021-06-01'));
 */
function getTimeSinceDate(
  date: Date,
  { isCommentFormat = false }: Options = {},
): string {
  let timeSinceDateOutput = '';
  const timeSinceDateInMS = Number(new Date(Date.now())) - Number(date);
  const timeSinceDateInSeconds = Math.floor(timeSinceDateInMS / MS_IN_SECOND);
  const timeSinceDateInMinutes = Math.floor(
    timeSinceDateInMS / (MS_IN_SECOND * SECONDS_IN_MINUTE),
  );
  const timeSinceDateInHours = Math.floor(timeSinceDateInMS / (
    MS_IN_SECOND
    * SECONDS_IN_MINUTE
    * MINUTES_IN_HOUR
  ));
  const timeSinceDateInDays = Math.floor(timeSinceDateInHours / HOURS_IN_DAY);
  const timeSinceDateInYears = Math.floor(timeSinceDateInDays / DAYS_IN_YEAR);

  let timeUnit: TimeUnits;

  // for isCommentFormat only
  const timeSinceDateInWeeks = Math.floor(timeSinceDateInDays / DAYS_IN_WEEK);

  const dateInMonthDay = date.toLocaleString('en-US', { month: 'long', day: 'numeric' });
  const dateInMonthDayYear = date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  if (timeSinceDateInSeconds < SECONDS_IN_MINUTE) { // less than 60 seconds
    timeSinceDateOutput += timeSinceDateInSeconds;
    timeUnit = 'Seconds';
  } else if (timeSinceDateInMinutes < MINUTES_IN_HOUR) { // less than 60 minutes
    timeSinceDateOutput += timeSinceDateInMinutes;
    timeUnit = 'Minutes';
  } else if (timeSinceDateInHours < HOURS_IN_DAY) { // less than 1 day
    timeSinceDateOutput += timeSinceDateInHours;
    timeUnit = 'Hours';
  } else if (timeSinceDateInDays < DAYS_IN_WEEK) { // less than 1 week
    timeSinceDateOutput += timeSinceDateInDays;
    timeUnit = 'Days';
  } else if (isCommentFormat) {
    timeSinceDateOutput = `${timeSinceDateInWeeks}w`;

    return timeSinceDateOutput;
  } else {
    timeSinceDateOutput = timeSinceDateInYears < 1 ? dateInMonthDay : dateInMonthDayYear;

    return timeSinceDateOutput;
  }

  const unit = TIME_UNITS_MAP[timeUnit];

  if (isCommentFormat) {
    timeSinceDateOutput += unit.short;
  } else {
    timeSinceDateOutput += timeSinceDateOutput === '1' ? unit.singular : unit.plural;
  }

  return timeSinceDateOutput;
}

export default getTimeSinceDate;
