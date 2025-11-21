/**
 * Main server file for the backend application.
 * Sets up the Express server and routes.
 * Middeware and other configurations would typically go here.
 * Entry point for the backend service.
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const {
    validateConfig,
    buildFullConfig,
    buildLayoutGrid,
    calculateTotals

} = require('./layoutLogic');

const {
    DEVICES,
    INDUSTRIAL_IDS
} = require('./devices');

const Session = require('./models/Session');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Routes

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// GET Devices metadata (important for frontend)
app.get('/devices', (req, res) => {
    res.json({
        devices: DEVICES,
        industrialIds: INDUSTRIAL_IDS
    });
});

// POST /layout/calc
app.post('/layout/calc', (req, res) => {
    const body = req.body || {};

    const { hasErrors, errors, cleaned } = validateConfig(body);

    if (hasErrors) {
        return res.status(400).json({
            message: 'Invalid configuration',
            errors
        });
    }

    const fullConfig = buildFullConfig(cleaned);
    const { layout, rowsCount } = buildLayoutGrid(fullConfig);
    const totals = calculateTotals(fullConfig, rowsCount);

    return res.json({
        config: {
            ...cleaned,
            transformer: fullConfig._meta.transformers
        },
        totals,
        layout
    });
});

// POST /session (save config + colors)
app.post('/session', async (req, res) => {
    try {
        const { config, colors } = req.body || {};

        const { hasErrors, errors, cleaned } = validateConfig(config || {});

        if (hasErrors) {
            return res.status(400).json({
                message: 'Invalid configuration',
                errors
            });
        }

        const session = new Session({
            config: cleaned,
            colors: colors || {}
        });

        await session.save();

        return res.status(201).json({
            id: session._id.toString()
        });
    } catch (err) {
        console.error('Error saving session', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /sessions (list all sessions)
app.get('/sessions', async (req, res) => {
    try {
        const sessions = await Session.find({});

        return res.json({
            count: sessions.length,
            items: sessions
        });
    } catch (err) {
        console.error('Error loading sessions', err);
        return res.status(500).json({ message: 'Internal server error' });
        
    }
})

// GET /session/:id (load config + colors)
app.get('/session_id/:id', async (req, res) => {
try {
    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) {
        return res.status(404).json({ message: 'Session not found' });
    }

    return res.json({
        config: session.config,
        colors: session.colors
        });
    } catch (err) {
    console.error('Error loading session', err);
    return res.status(500).json({ message: 'Internal server error' });
}
});

// MongoDB connection + server start
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Backend listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect MongoDB', err);
        process.exit(1);
    });

