/**
 * Returns number formatted with commas and abbreviations.
 *
 * Numbers will be abbreviated after 10000.
 * @param number - number to be formatted.
  @example
  console.log(numberFormatter(1000)) // -> '1,000'
  console.log(numberFormatter(10000)) // -> '10k'
  console.log(numberFormatter(100345)) // -> '100.3k'
  console.log(numberFormatter(1800373)) // -> '1.8m'
 */
const numberFormatter = (number: number) => {
  if (number < 10000) return number.toLocaleString();
  if (number < 1000000) return `${parseFloat((number / 1000).toFixed(1))}k`;
  return `${parseFloat((number / 1000000).toFixed(1))}m`;
};

export default numberFormatter;
