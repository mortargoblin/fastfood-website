const fs = require('fs');

const current_log = './logs/runtime.log';
let initialized = false;

const LOGTYPE = {
    INFO: 0,
    WARN: 1,
    ERROR: 2,
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