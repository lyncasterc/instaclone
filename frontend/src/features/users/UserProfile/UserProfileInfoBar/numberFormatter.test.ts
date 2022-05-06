import numberFormatter from './numberFormatter';

test('adds a comma to numbers in the thousands', () => {
  expect(numberFormatter(0)).toBe('0');
  expect(numberFormatter(1000)).toBe('1,000');
  expect(numberFormatter(8254)).toBe('8,254');
  expect(numberFormatter(9999)).toBe('9,999');
});

test('abbreviates numbers greater than or equal to 10000', () => {
  expect(numberFormatter(10000)).toBe('10k');
  expect(numberFormatter(500000)).toBe('500k');
  expect(numberFormatter(32000000)).toBe('32m');
});

test('returns numbers greater than or equal to 10000 with one digit after decimal point', () => {
  expect(numberFormatter(10300)).toBe('10.3k');
  expect(numberFormatter(504390)).toBe('504.4k');
  expect(numberFormatter(109215777)).toBe('109.2m');
});
