/**
 * Session model definition
 * Stores user session information
 * device config
 * colors (for color customization)
 * timestamps
 */

const mongoose = require('mongoose');

const ColorSchema = new mongoose.Schema(
    {
        megapackXL: { type: String, default: '#2F80ED' },
        megapack2: { type: String, default: '#9B51E0' },
        megapack: { type: String, default: '#27AE60' },
        powerPack: { type: String, default: '#F2C94C' },
        transformer: { type: String, default: '#4F4F4F' }
    },
    { _id: false }
);

const ConfigSchema = new mongoose.Schema(
    {
        megapackXL: { type: Number, default: 0 },
        megapack2: { type: Number, default: 0 },
        megapack: { type: Number, default: 0 },
        powerPack: { type: Number, default: 0 }
        // transformer is auto-calculated, no need to store it
    },
    { _id: false }
);

const SessionSchema = new mongoose.Schema(
    {
        config: {
            type: ConfigSchema,
            required: true,
        },
        colors: {
            type: ColorSchema,
            default: () => ({}),
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Session', SessionSchema);