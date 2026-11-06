import { decodeResistor, parallelResistance } from '@lp-labs/resistor-code';
if (
  decodeResistor(['yellow', 'violet', 'red', 'gold']).ohms !== 4700 ||
  parallelResistance([100, 100]) !== 50
)
  throw new Error('Resistance');
// @ts-expect-error invalid argument must be rejected by declarations
decodeResistor('red');
