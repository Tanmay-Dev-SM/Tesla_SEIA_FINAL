/**
 * Layout Logic Module
 * This module handles the layout configurations and logic for the application.
 * It is a pure function module no Express and No DB calls here.
 */

const { DEVICES, INDUSTRIAL_IDS } = require('./devices');

const MAX_COLS = 10;    // 10 * 10ft = 100ft
const CELL_FT = 10;     // 1 grid cell = 10ft depth/width

// 1. Count industrial batteries
function getIndustrialCount(config) {
    let total = 0;

    for (const id of INDUSTRIAL_IDS) {
        const qty = Number(config[id] || 0);

        if (!Number.isFinite(qty) || qty < 0) continue;
        total += qty;
    }
    return total;
}

// 2. Transformers required: ceil(industrial / 2)
function calculateTransformers(indeustrialCount) {
    return Math.ceil(indeustrialCount / 2);
}

// 3. Build a full config with calculated transformers
function buildFullConfig(config) {
    const industrialCount = getIndustrialCount(config);
    const transformers = calculateTransformers(industrialCount);

    return {
        ...config,
        transformer: transformers,
        _meta: {
            industrialCount,
            transformers
        }
    };
}

// 4. Totals: cost, energy, dimensions
function calculateTotals(fullConfig, layoutRowsCount) {
    let totalCost = 0;
    let totalMwh = 0;

    for (const key of Object.keys(DEVICES)) {
        const device = DEVICES[key];
        const qty = Number(fullConfig[key] || 0);
        
        if (!Number.isFinite(qty) || qty < 0) continue;

        totalCost += device.cost * qty;
        totalMwh += device.mwh * qty;
    }

    const siteWidthFt = MAX_COLS * CELL_FT;
    const siteDepthFt = layoutRowsCount * CELL_FT;

    return {
        totalCost,
        totalMwh,
        siteWidthFt,
        siteDepthFt,
        industrialCount: fullConfig._meta.industrialCount,
        transformers: fullConfig._meta.transformers
    };
}

// 5. Layout grid (left-aligned row packing)
function buildLayoutGrid(fullConfig) {
    const items = [];

    for (const key of Object.keys(DEVICES)) {
        const device = DEVICES[key];
        const qty = Number(fullConfig[key] || 0);
        
        if (!Number.isFinite(qty) || qty < 0) continue;

        const colSpan = device.widthFt / CELL_FT;

        for (let i = 0; i < qty; i++){
            items.push({
                id: `${key}-${i + 1}`,
                type: key,
                colSpan
            });
        }
    }

    // Pack into rows
    const layout = [];
    let currentRow = 0;
    let currentWidth = 0;

    for (const item of items) {
        const { colSpan } = item;

        if (currentWidth + colSpan > MAX_COLS) {
            // Start new row
            currentRow += 1;
            currentWidth = 0;
        }

        layout.push({
            id: item.id,
            type: item.type,
            row: currentRow,
            colStart: currentWidth,
            colSpan: item.colSpan
        });

        currentWidth += colSpan;
    }

    const rowsCount = layout.length === 0 ? 0 : (layout[layout.length - 1].row + 1);

    return { layout, rowsCount };
}

// Helper: validate incoming config
function validateConfig(config) {
    const errors = {};
    const cleaned = {};

    for (const id of INDUSTRIAL_IDS) {
        let raw = config[id];

        if (raw === undefined || raw === null || raw === '') {
            raw = 0;
        }

        const value = Number(raw);

        if (!Number.isInteger(value) || value < 0) {
            errors[id] = 'Must be a non-negative integer';
        }else if (value > 1000) {
            errors[id] = 'Maximum allowed is 1000';
        } else {
            cleaned[id] = value;
        }
    }

    const hasErrors = Object.keys(errors).length > 0;

    return {hasErrors, errors, cleaned};
}

module.exports = {
    getIndustrialCount,
    calculateTransformers,
    buildFullConfig,
    calculateTotals,
    buildLayoutGrid,
    validateConfig
};
