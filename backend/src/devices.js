//Single source for sizes, energy, cost for devices
//We can extend this to support more devices

/**
 * Parameters
 * Length (feet)
 * Energy (MWh)
 * Cost (USD)
 */

const DEVICES = {
    megapackXL: {
        id: 'megapackXL',
        name: 'Megapack XL',
        widthFt: 40,
        depthFt: 10,
        mwh: 4,
        cost: 120000,
        type: 'industrial'
    },
    megapack2: {
        id: 'megapack2',
        name: 'Megapack 2',
        widthFt: 30,
        depthFt: 10,
        mwh: 3,
        cost: 90000,
        type: 'industrial'
        
    },
    megapack: {
        id: 'megapack',
        name: 'Megapack',
        widthFt: 30,
        depthFt: 10,
        mwh: 2.5,
        cost: 80000,
        type: 'industrial'
    },
    powerPack: {
        id: 'powerPack',
        name: 'PowerPack',
        widthFt: 10,
        depthFt: 10,
        mwh: 1,
        cost: 30000,
        type: 'industrial'
    },
    transformer: {
        id: 'transformer',
        name: 'Transformer',
        widthFt: 10,
        depthFt: 10,
        mwh: -0.5, // subtracts energy
        cost: 10000,
        type: 'infrastructure'
    }
};

const INDUSTRIAL_IDS = ['megapackXL', 'megapack2', 'megapack', 'powerPack'];

module.exports = {
    DEVICES,
    INDUSTRIAL_IDS
};