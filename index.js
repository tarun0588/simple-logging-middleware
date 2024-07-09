require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const app = express();
const port = process.env.PORT || 3000;

//middleware 
const requestLogger = (req, res, next) => {
    const { method, url, ip } = req;
    const timestamp = new Date();
    console.log(`${timestamp} ${method} ${url} ${ip}`)
    next();
}
app.use(requestLogger)


const infoLogger = (req, res, next) => {
    console.log(`INFO: ${req.method} request to ${req.url}`);
    next();
}

const debugLogger = (req, res, next) => {
    console.log(`DEBUG: ${req.method} request to ${req.url} with headers: ${JSON.stringify(req.headers)}`);
    next();
}

const logFormat = process.env.LOG_LEVEL === 'debug' ? 'combined' : 'common';
app.use(morgan(logFormat));

const logLevel = process.env.LOG_LEVEL || 'info';
if (logLevel === 'info') {
    app.use(infoLogger)
} else if (logLevel === 'debug') {
    app.use(debugLogger);
}

app.get('/debug', debugLogger, (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'debug route hit'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'error'
        })
    }
})


app.get('/', (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'hello world'
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message: 'error'
        })
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})