import { formatDuration } from '../youtube.js';

describe('formatDuration', () => {
  it.each([
    ['PT45S', '0:45'],
    ['PT5S', '0:05'],
    ['PT1M48S', '1:48'],
    ['PT5M20S', '5:20'],
    ['PT10M5S', '10:05'],
    ['PT3M', '3:00'],
    ['PT1H2M30S', '1:02:30'],
    ['PT2H15M45S', '2:15:45'],
    ['PT1H5S', '1:00:05'],
    ['PT3H', '3:00:00'],
    ['PT1H30M', '1:30:00'],
  ])('%s => %s', (input, expected) => {
    const actual = formatDuration(input);
    expect(actual).toBe(expected);
  });
});
