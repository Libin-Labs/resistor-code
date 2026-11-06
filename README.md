# @lp-labs/resistor-code

Four/five-band resistor values and circuit resistance math.

Original, standalone MIT TypeScript implementation with **zero runtime or peer dependencies**. ESM/CommonJS exports and separate declarations; Node18+ and compatible ES2022 browsers. No service, filesystem, network, clock or browser globals accessed on import. Compiler/formatter dependencies are development-only.

## Install

```sh
npm install @lp-labs/resistor-code
```

## Working example

```js
import { decodeResistor, parallelResistance } from '@lp-labs/resistor-code';
if (
  decodeResistor(['yellow', 'violet', 'red', 'gold']).ohms !== 4700 ||
  parallelResistance([100, 100]) !== 50
)
  throw new Error('Resistance');
```

CommonJS: `const api = require('@lp-labs/resistor-code')`.

## Behavior, customization and limits

decodeResistor accepts four or five named color bands (lowercase): two/three significant digits, multiplier and tolerance. First digit cannot black; multipliers black..white plus gold/silver; tolerances brown1%, red2%, green0.5%, blue0.25%, violet0.1%, gray0.05%, gold5%, silver10%. Returns ohms and tolerancePercent. seriesResistance permits nonnegative values, parallelResistance requires positive values; array sizes1..10000. All results finite; O(bands or values). No component safety/rating validation.

Use the explicit function arguments and public types below to customize the documented behavior. There are no hidden environment settings or sibling-library requirements. Array inputs must be dense; sparse entries are invalid. Inputs are validated before a successful result is returned. Outputs do not mutate caller-owned inputs. Hostile proxies/getters and concurrent mutation are outside the contract.

## Errors and integration

Invalid data never produces an empty success-shaped substitute. TypeError reports incompatible runtime types/nonfinite numbers; RangeError reports unsupported ranges, invalid syntax, inconsistent states and exceeded budgets. Functions that explicitly return null, false or empty arrays describe those legitimate outcomes above. Errors propagate to callers; UI applications should catch at their boundary and visibly notify users. Numerical calculations use JavaScript IEEE754 unless the API explicitly uses bigint; compare approximate numerical results with application-appropriate tolerances.

## Complete public API

```ts
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
export declare function decodeResistor(bands: readonly BandColor[]): {
  ohms: number;
  tolerancePercent: number;
};
export declare function seriesResistance(items: readonly number[]): number;
export declare function parallelResistance(items: readonly number[]): number;
```

## Performance and portability

Complexity and resource ceilings are specified above. Buffered synchronous algorithms do not create workers or timers; callers can move expensive work to their own worker. Limits are enforced, not silently truncated. No runtime imports from any other library. No compatibility or completeness claims beyond the stated scope.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
