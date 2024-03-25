// Copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/PluralRules#using_options

const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });

const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
]);

/**
 * @returns the ordinal form of the number
 * @example
 * formatOrdinals(3) // '3rd'
 * formatOrdinals(21) // '21st'
 */
export default function formatOrdinals(n: number) {
  const rule = pr.select(n);
  const suffix = suffixes.get(rule);

  return `${n}${suffix}`;
}
