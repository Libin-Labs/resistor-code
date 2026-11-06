import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('four bands', () => {
  assert.deepEqual(api.decodeResistor(['yellow', 'violet', 'red', 'gold']), {
    ohms: 4700,
    tolerancePercent: 5,
  });
});
test('five bands', () => {
  assert.deepEqual(api.decodeResistor(['brown', 'black', 'black', 'brown', 'brown']), {
    ohms: 1000,
    tolerancePercent: 1,
  });
});
test('fractional multiplier', () => {
  assert.equal(api.decodeResistor(['red', 'red', 'silver', 'silver']).ohms, 0.22);
});
test('series and parallel references', () => {
  assert.equal(api.seriesResistance([100, 200, 300]), 600);
  assert.equal(api.parallelResistance([100, 100]), 50);
  assert.equal(api.parallelResistance([1e300, 1e300]), 5e299);
});
test('invalid band and circuits', () => {
  for (const b of [
    [],
    ['black', 'red', 'red', 'gold'],
    ['red', 'red', 'red', 'black'],
    ['red', 'red', 'oops', 'gold'],
  ])
    assert.throws(() => api.decodeResistor(b));
  assert.throws(() => api.parallelResistance([0]));
  assert.throws(() => api.seriesResistance([1, , 2]));
});
test('reciprocal oracle', () => {
  for (let i = 1; i < 50; i++) {
    const got = api.parallelResistance([i, 2 * i, 3 * i]);
    assert.ok(Math.abs(got - 1 / (1 / i + 1 / (2 * i) + 1 / (3 * i))) < 1e-12);
  }
});
