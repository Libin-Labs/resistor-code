function finite(value: number, min = -Number.MAX_VALUE, max = Number.MAX_VALUE): number {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new TypeError('Expected finite number');
  if (value < min || value > max) throw new RangeError('Number outside supported bounds');
  return value;
}
export type BandColor =
  | 'black'
  | 'brown'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'violet'
  | 'gray'
  | 'white'
  | 'gold'
  | 'silver';
const colors: readonly string[] = [
  'black',
  'brown',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'violet',
  'gray',
  'white',
];
const tolerances: Readonly<Record<string, number>> = {
  brown: 1,
  red: 2,
  green: 0.5,
  blue: 0.25,
  violet: 0.1,
  gray: 0.05,
  gold: 5,
  silver: 10,
};
export function decodeResistor(bands: readonly BandColor[]): {
  ohms: number;
  tolerancePercent: number;
} {
  if (!Array.isArray(bands) || (bands.length !== 4 && bands.length !== 5))
    throw new RangeError('Four or five bands required');
  let digits = 0;
  for (let i = 0; i < bands.length - 2; i++) {
    const d = colors.indexOf(bands[i]!);
    if (d < 0 || (i === 0 && d === 0)) throw new RangeError('Invalid significant band');
    digits = digits * 10 + d;
  }
  const multiplier = bands[bands.length - 2]!,
    exponent =
      multiplier === 'gold' ? -1 : multiplier === 'silver' ? -2 : colors.indexOf(multiplier);
  if (exponent < 0 && multiplier !== 'gold' && multiplier !== 'silver')
    throw new RangeError('Invalid multiplier');
  const t = bands[bands.length - 1]!,
    tolerance = Object.hasOwn(tolerances, t) ? tolerances[t] : undefined;
  if (tolerance === undefined) throw new RangeError('Invalid tolerance');
  return { ohms: finite(digits * 10 ** exponent, 0), tolerancePercent: tolerance };
}
function values(items: readonly number[], positive: boolean): void {
  if (!Array.isArray(items) || !items.length || items.length > 10000)
    throw new RangeError('Resistance count');
  for (const v of items) {
    finite(v, 0);
    if (positive && v === 0) throw new RangeError('Positive resistance required');
  }
}
export function seriesResistance(items: readonly number[]): number {
  values(items, false);
  return finite(
    items.reduce((a, b) => a + b, 0),
    0,
  );
}
export function parallelResistance(items: readonly number[]): number {
  values(items, true);
  const minimum = Math.min(...items);
  return finite(minimum / items.reduce((a, b) => a + minimum / b, 0), Number.MIN_VALUE);
}
