import getTimeSinceDate from './getTimeSinceDate';

describe('time differences less than 60 seconds', () => {
  test('a time difference of 0 seconds returns "0 seconds ago or 0s"', () => {
    expect(getTimeSinceDate(new Date(Date.now()))).toBe('0 seconds ago');

    // comment format
    expect(getTimeSinceDate(new Date(Date.now()), { isCommentFormat: true })).toBe('0s');
  });

  test('a time difference of 30 seconds returns "30 seconds ago or 30s"', () => {
    expect(getTimeSinceDate(new Date(Date.now() - 30 * 1000))).toBe('30 seconds ago');

    // comment format
    expect(getTimeSinceDate(new Date(Date.now() - 30 * 1000), { isCommentFormat: true })).toBe('30s');
  });

  test('a time difference of 59 seconds returns "59 seconds ago or 59s"', () => {
    expect(getTimeSinceDate(new Date(Date.now() - 59 * 1000))).toBe('59 seconds ago');

    // comment format
    expect(getTimeSinceDate(new Date(Date.now() - 59 * 1000), { isCommentFormat: true })).toBe('59s');
  });
});

describe('time differences less than 60 minutes', () => {
  test('a time difference of 1 minute returns "1 minute ago or 1m"', () => {
    expect(getTimeSinceDate(new Date(Date.now() - 60 * 1000))).toBe('1 minute ago');

    // comment format
    expect(getTimeSinceDate(new Date(Date.now() - 60 * 1000), { isCommentFormat: true })).toBe('1m');
  });

  test('a time difference of 37 minutes returns "37 minutes ago or 37m"', () => {
    expect(getTimeSinceDate(new Date(Date.now() - 37 * 60 * 1000))).toBe('37 minutes ago');

    // comment format
    expect(getTimeSinceDate(new Date(Date.now() - 37 * 60 * 1000), { isCommentFormat: true })).toBe('37m');
  });

  test('a time difference of 59 minutes returns "59 minutes ago or 59m"', () => {
    expect(getTimeSinceDate(new Date(Date.now() - 59 * 60 * 1000))).toBe('59 minutes ago');

    // comment format
    expect(getTimeSinceDate(new Date(Date.now() - 59 * 60 * 1000), { isCommentFormat: true })).toBe('59m');
  });
});

describe('time differences less than 24 hours', () => {
  test('a time difference of 1 hour returns "1 hour ago or 1h"', () => {
    expect(getTimeSinceDate(new Date(Date.now() - 60 * 60 * 1000))).toBe('1 hour ago');

    // comment format
    expect(getTimeSinceDate(new Date(Date.now() - 60 * 60 * 1000), { isCommentFormat: true })).toBe('1h');
  });

  test('a time difference of 5 hours returns "5 hours ago or 5h"', () => {
    expect(getTimeSinceDate(new Date(Date.now() - 5 * 60 * 60 * 1000))).toBe('5 hours ago');

    // comment format
    expect(getTimeSinceDate(new Date(Date.now() - 5 * 60 * 60 * 1000), { isCommentFormat: true })).toBe('5h');
  });

  test('a time difference of 23 hours returns "23 hours ago or 23h"', () => {
    expect(getTimeSinceDate(new Date(Date.now() - 23 * 60 * 60 * 1000))).toBe('23 hours ago');

    // comment format
    expect(getTimeSinceDate(new Date(Date.now() - 23 * 60 * 60 * 1000), { isCommentFormat: true })).toBe('23h');
  });
});

describe('time differences less than 7 days', () => {
  test('a time difference of 1 day returns "1 day ago or 1d"', () => {
    expect(getTimeSinceDate(new Date(Date.now() - 24 * 60 * 60 * 1000))).toBe('1 day ago');

    // comment format
    expect(getTimeSinceDate(new Date(Date.now() - 24 * 60 * 60 * 1000), { isCommentFormat: true })).toBe('1d');
  });

  test('a time difference of 3 days returns "3 days ago or 3d"', () => {
    expect(getTimeSinceDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))).toBe('3 days ago');

    // comment format
    expect(getTimeSinceDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), { isCommentFormat: true })).toBe('3d');
  });

  test('a time difference of 6 days returns "6 days ago or 6d"', () => {
    expect(getTimeSinceDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000))).toBe('6 days ago');

    // comment format
    expect(getTimeSinceDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), { isCommentFormat: true })).toBe('6d');
  });
});

describe('time differences less than 1 year', () => {
  test('a time difference of 1 month returns the formatted date', () => {
    const currentDate = new Date();
    const previousDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      currentDate.getDate(),
    );

    // format is "month day"
    const formattedDate = previousDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    expect(getTimeSinceDate(previousDate)).toBe(formattedDate);
  });

  test('a time difference of 6 months returns the formatted date', () => {
    const currentDate = new Date();
    const previousDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 6,
      currentDate.getDate(),
    );

    // format is "month day"
    const formattedDate = previousDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    expect(getTimeSinceDate(previousDate)).toBe(formattedDate);
  });

  test('a time difference of 11 months returns the formatted date', () => {
    const currentDate = new Date();
    const previousDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 11,
      currentDate.getDate(),
    );

    // format is "month day"
    const formattedDate = previousDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    expect(getTimeSinceDate(previousDate)).toBe(formattedDate);
  });
});

describe('time differences less than 1 year for comment format', () => {
  test('a time difference of 1 week returns "1w"', () => {
    expect(getTimeSinceDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), { isCommentFormat: true })).toBe('1w');
  });

  test('a time difference of 3 weeks returns "3w"', () => {
    expect(getTimeSinceDate(new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1000), { isCommentFormat: true })).toBe('3w');
  });

  test('a time difference of 6 weeks returns "6w"', () => {
    expect(getTimeSinceDate(new Date(Date.now() - 6 * 7 * 24 * 60 * 60 * 1000), { isCommentFormat: true })).toBe('6w');
  });

  test('a time difference of 29 weeks returns "29w"', () => {
    expect(getTimeSinceDate(new Date(Date.now() - 29 * 7 * 24 * 60 * 60 * 1000), { isCommentFormat: true })).toBe('29w');
  });

  test('a time difference of 51 weeks returns "51w"', () => {
    expect(getTimeSinceDate(new Date(Date.now() - 51 * 7 * 24 * 60 * 60 * 1000), { isCommentFormat: true })).toBe('51w');
  });
});

describe('time differences greater than or equal to 1 year', () => {
  test('a time difference of 1 year returns the formatted date', () => {
    const currentDate = new Date();
    const previousDate = new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    // format is "month day year"
    const formattedDate = previousDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    expect(getTimeSinceDate(previousDate)).toBe(formattedDate);
  });

  test('a time difference of 1 year and 6 months returns the formatted date', () => {
    const currentDate = new Date();
    const previousDate = new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth() - 6,
      currentDate.getDate(),
    );

    // format is "month day year"
    const formattedDate = previousDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    expect(getTimeSinceDate(previousDate)).toBe(formattedDate);
  });

  test('a time difference of 2 years returns the formatted date', () => {
    const currentDate = new Date();
    const previousDate = new Date(
      currentDate.getFullYear() - 2,
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    // format is "month day year"
    const formattedDate = previousDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    expect(getTimeSinceDate(previousDate)).toBe(formattedDate);
  });

  test('a time difference of 5 years returns the formatted date', () => {
    const currentDate = new Date();
    const previousDate = new Date(
      currentDate.getFullYear() - 5,
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    // format is "month day year"
    const formattedDate = previousDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    expect(getTimeSinceDate(previousDate)).toBe(formattedDate);
  });

  test('a time difference of 10 years returns the formatted date', () => {
    const currentDate = new Date();
    const previousDate = new Date(
      currentDate.getFullYear() - 10,
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    // format is "month day year"
    const formattedDate = previousDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    expect(getTimeSinceDate(previousDate)).toBe(formattedDate);
  });
});

describe('time differences greater than or equal to 1 year for comment format', () => {
  test('a time difference of 1 year returns 52w', () => {
    const currentDate = new Date();
    const previousDate = new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    expect(getTimeSinceDate(previousDate, { isCommentFormat: true })).toBe('52w');
  });

  test('a time difference of 2 years returns 104w', () => {
    const currentDate = new Date();
    const previousDate = new Date(
      currentDate.getFullYear() - 2,
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    expect(getTimeSinceDate(previousDate, { isCommentFormat: true })).toBe('104w');
  });

  test('a time difference of 5 years and 3 weeks returns 264w', () => {
    const currentDate = new Date();
    const previousDate = new Date(
      currentDate.getFullYear() - 5,
      currentDate.getMonth(),
      currentDate.getDate() - 21,
    );

    expect(getTimeSinceDate(previousDate, { isCommentFormat: true })).toBe('264w');
  });
});
