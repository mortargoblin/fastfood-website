const fs = require('fs');

const current_log = './logs/runtime.log';
let initialized = false;

/**
 * Enum for log severity levels.
 * @readonly
 * @enum {number}
 */
const LOGTYPE = {
    /** Informational message */
    INFO: 0,
    /** Warning message */
    WARN: 1,
    /** Error message */
    ERROR: 2,
    /** Fatal error message */
    FATAL: 3,
}

const COLORS = {
    RESET: "\x1b[0m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    RED: "\x1b[31m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m"
};

/**
 * Initializes the logger by creating the log directory and runtime log file.
 * Clears any existing runtime log on startup.
 * @returns {void}
 */
function init()
{
    if (!fs.existsSync('./logs'))
    {
        fs.mkdirSync('./logs');
    }
    if (!fs.existsSync(current_log))
    {
        fs.writeFileSync(current_log, '');
    }
    fs.writeFileSync("./logs/runtime.log", "")
    fs.appendFileSync(current_log, "[START] " + new Date().toLocaleString() + "\n");
    initialized = true;
}

/**
 * Logs a message to both the console (with color) and the runtime log file.
 * Automatically initializes the logger if it has not been initialized yet.
 * @param {LOGTYPE} type - The severity level of the log message.
 * @param {string} message - The message to log.
 * @returns {void}
 */
function log(type, message)
{
    if (!initialized)
    {
        init();
    }

    let log_message = '';
    let color = COLORS.RESET;

    switch (type)
    {
        case LOGTYPE.INFO:
            log_message = '[INFO] ';
            color = COLORS.GREEN;
            break;

        case LOGTYPE.WARN:
            log_message = '[WARN] ';
            color = COLORS.YELLOW;
            break;

        case LOGTYPE.ERROR:
            log_message = '[ERROR] ';
            color = COLORS.RED;
            break;

        case LOGTYPE.FATAL:
            log_message = '[FATAL] ';
            color = COLORS.MAGENTA;
            break;

        default:
            log_message = '[UNK] ';
            color = COLORS.CYAN;
            break;
    }

    log_message += message;

    // Colored console output
    console.log(color + log_message + COLORS.RESET);

    // Plain text log file
    fs.appendFileSync(current_log, log_message + "\n");
}

module.exports = 
{
    LOGTYPE: LOGTYPE,
    log
}