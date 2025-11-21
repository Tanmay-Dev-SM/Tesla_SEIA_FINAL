const {
    getIndustrialCount,
    calculateTransformers,
    buildFullConfig,
    calculateTotals,
    buildLayoutGrid,
    validateConfig,
} = require("../src/layoutLogic");

const {
    DEVICES,
    INDUSTRIAL_IDS
} = require("../src/devices")

// Helper to create a config with values mapped by index into INDUSTRIAL_IDS
function makeIndustrialConfig(valuesByIndex = []) {
    const cfg = {};
    INDUSTRIAL_IDS.forEach((id, idx) => {
        cfg[id] = valuesByIndex[idx] ?? 0;
    });
    return cfg;
}

describe("getIndustrialCount", () => {
    it("sums all industrial IDs correctly", () => {
    // first 2 industrial types: 2 and 3, rest 0
    const config = makeIndustrialConfig([2, 3]);

    const result = getIndustrialCount(config);
    expect(result).toBe(5);
});

it("ignores invalid or negative values", () => {
        const cfg = {};
        cfg[INDUSTRIAL_IDS[0]] = -1;
        cfg[INDUSTRIAL_IDS[1]] = "abc"; // NaN
        // rest default to 0
        const result = getIndustrialCount(cfg);
        expect(result).toBe(0);
    });
});

describe("calculateTransformers", () => {
it("uses ceil(industrial / 2)", () => {
        expect(calculateTransformers(0)).toBe(0);
        expect(calculateTransformers(1)).toBe(1);
        expect(calculateTransformers(2)).toBe(1);
        expect(calculateTransformers(3)).toBe(2);
        expect(calculateTransformers(4)).toBe(2);
    });
});

describe("buildFullConfig", () => {
it("adds transformer count and _meta correctly", () => {
    const config = makeIndustrialConfig([3, 1]); // 4 total
    const full = buildFullConfig(config);

    const industrialCount = 4;
    const transformers = calculateTransformers(industrialCount);

    expect(full.transformer).toBe(transformers);
    expect(full._meta).toEqual({
        industrialCount,
        transformers,
        });
    });
});

describe("validateConfig", () => {
it("cleans valid non-negative integers and fills missing as 0", () => {
    const someId = INDUSTRIAL_IDS[0];

    const input = {
    [someId]: "5",
      // others missing → should default to 0
    };

    const { hasErrors, errors, cleaned } = validateConfig(input);

    expect(hasErrors).toBe(false);
    expect(errors).toEqual({});

    // all industrial ids must appear
    INDUSTRIAL_IDS.forEach((id) => {
        expect(cleaned).toHaveProperty(id);
    });

    expect(cleaned[someId]).toBe(5);
});

it("flags negative, non-integer and > 1000 values", () => {
    const badId1 = INDUSTRIAL_IDS[0];
    const badId2 = INDUSTRIAL_IDS[1];
    const badId3 = INDUSTRIAL_IDS[2];

    const input = {
      [badId1]: -1,    // negative
      [badId2]: 3.5,   // non-integer
      [badId3]: 2000,  // > 1000
    };

    const { hasErrors, errors } = validateConfig(input);

        expect(hasErrors).toBe(true);
        expect(errors[badId1]).toBe("Must be a non-negative integer");
        expect(errors[badId2]).toBe("Must be a non-negative integer");
        expect(errors[badId3]).toBe("Maximum allowed is 1000");
    });
});

describe("calculateTotals", () => {
it("sums cost and mwh correctly and computes dimensions", () => {
    const baseConfig = makeIndustrialConfig([2, 1]); // example
    const fullConfig = buildFullConfig(baseConfig);
    const layoutRowsCount = 3;

    const result = calculateTotals(fullConfig, layoutRowsCount);

    // expected totals from DEVICES
    let expectedCost = 0;
    let expectedMwh = 0;
    for (const key of Object.keys(DEVICES)) {
        const device = DEVICES[key];
        const qty = Number(fullConfig[key] || 0);
        if (!Number.isFinite(qty) || qty < 0) continue;

      expectedCost += device.cost * qty;
      expectedMwh += device.mwh * qty;
    }

    expect(result.totalCost).toBe(expectedCost);
    expect(result.totalMwh).toBe(expectedMwh);

    // From your constants: MAX_COLS = 10, CELL_FT = 10
    expect(result.siteWidthFt).toBe(100); // 10 * 10 ft
    expect(result.siteDepthFt).toBe(30);  // 3 * 10 ft

    // meta passthrough
        expect(result.industrialCount).toBe(fullConfig._meta.industrialCount);
        expect(result.transformers).toBe(fullConfig._meta.transformers);
    });
});

describe("buildLayoutGrid", () => {
it("returns empty layout and 0 rows for empty config", () => {
    const emptyConfig = makeIndustrialConfig([]);
    const fullConfig = buildFullConfig(emptyConfig);

    const { layout, rowsCount } = buildLayoutGrid(fullConfig);

    expect(layout).toEqual([]);
    expect(rowsCount).toBe(0);
});

it("packs items into rows without exceeding 10 columns", () => {
    // Give some positive quantity to first industrial id
    const cfg = makeIndustrialConfig([5]);
    const fullConfig = buildFullConfig(cfg);

    const { layout, rowsCount } = buildLayoutGrid(fullConfig);

    expect(layout.length).toBeGreaterThan(0);
    expect(rowsCount).toBeGreaterThan(0);

    // no item should exceed MAX_COLS = 10
    layout.forEach((item) => {
        const device = DEVICES[item.type];
        const colSpan = device.widthFt / 10; // CELL_FT = 10

        expect(item.colSpan).toBe(colSpan);
        expect(item.colStart + item.colSpan).toBeLessThanOrEqual(10);
    });

    // rowsCount = highest row index + 1
    const maxRow = layout.reduce((max, item) => Math.max(max, item.row), 0);
        expect(rowsCount).toBe(maxRow + 1);
    });
});