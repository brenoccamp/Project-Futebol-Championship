const testCoverage = require('../utils/testCoverage');
const { getRequirement } = require('../utils/util');

const backEndCoverage = async () => testCoverage('backend');

let backEnd;

beforeAll(async () => {
  backEnd = await backEndCoverage();

  expect(backEnd).toMatchObject({
    path: expect.any(String),
    skipped: expect.any(Number),
    pct: expect.any(Number),
    covered: expect.any(Number),
  });
});

describe.skip(getRequirement(4), () => {
  test('No back-end', () => {
    expect(backEnd.skipped).toStrictEqual(0);
    expect(backEnd.pct).toBeGreaterThanOrEqual(5);
    expect(backEnd.covered).toBeGreaterThanOrEqual(7);
  });
});

describe.skip(getRequirement(6), () => {
  test('No back-end', () => {
    expect(backEnd.skipped).toStrictEqual(0);
    expect(backEnd.pct).toBeGreaterThanOrEqual(10);
    expect(backEnd.covered).toBeGreaterThanOrEqual(19);
  });
});

describe.skip(getRequirement(8), () => {
  test('No back-end', () => {
    expect(backEnd.skipped).toStrictEqual(0);
    expect(backEnd.pct).toBeGreaterThanOrEqual(15);
    expect(backEnd.covered).toBeGreaterThanOrEqual(25);
  });
});

describe.skip(getRequirement(10), () => {
  test('No back-end', () => {
    expect(backEnd.skipped).toStrictEqual(0);
    expect(backEnd.pct).toBeGreaterThanOrEqual(20);
    expect(backEnd.covered).toBeGreaterThanOrEqual(35);
  });
});

describe.skip(getRequirement(12), () => {
  test('No back-end', () => {
    expect(backEnd.skipped).toStrictEqual(0);
    expect(backEnd.pct).toBeGreaterThanOrEqual(30);
    expect(backEnd.covered).toBeGreaterThanOrEqual(45);
  });
});

describe.skip(getRequirement(15), () => {
  test('No back-end', () => {
    expect(backEnd.skipped).toStrictEqual(0);
    expect(backEnd.pct).toBeGreaterThanOrEqual(45);
    expect(backEnd.covered).toBeGreaterThanOrEqual(70);
  });
});

describe.skip(getRequirement(18), () => {
  test('No back-end', () => {
    expect(backEnd.skipped).toStrictEqual(0);
    expect(backEnd.pct).toBeGreaterThanOrEqual(60);
    expect(backEnd.covered).toBeGreaterThanOrEqual(80);
  });
});

describe.skip(getRequirement(22), () => {
  test('No back-end', () => {
    expect(backEnd.skipped).toStrictEqual(0);
    expect(backEnd.pct).toBeGreaterThanOrEqual(80);
    expect(backEnd.covered).toBeGreaterThanOrEqual(100);
  });
});
