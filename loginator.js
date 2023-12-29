/*
simple colored console message prefixes
Usage:

const Loginator = require(`./loginator.js`)
const logger = new Loginator(4, false, {
    "info": {fg: "brightblack", bg: "white"},
    "chat": {fg: "white", bg: "brightblack"},
    "warn": {fg: "brightwhite", bg: "yellow"},
    "uhoh": {fg: "yellow", bg: "red"},
});
logger.init();

*/

class Loginator {
    constructor(autoRemoveScriptLength = 0, disableTimestamps = false, customStyles = {}) {
        this.autoRemoveScriptLength = autoRemoveScriptLength;
        this.disableTimestamps = disableTimestamps;
        this.customStyles = customStyles;

        this.cci = {
            reset: "\x1b[0m",
            bright: "\x1b[1m",
            dim: "\x1b[2m",
            underscore: "\x1b[4m",
            blink: "\x1b[5m",
            reverse: "\x1b[7m",
            hidden: "\x1b[8m",
            fg: {
                black: "\x1b[30m",
                red: "\x1b[31m",
                green: "\x1b[32m",
                yellow: "\x1b[33m",
                blue: "\x1b[34m",
                magenta: "\x1b[35m",
                cyan: "\x1b[36m",
                white: "\x1b[37m",
                brightblack: "\x1b[90m",
                brightred: "\x1b[91m",
                brightgreen: "\x1b[92m",
                brightyellow: "\x1b[93m",
                brightblue: "\x1b[94m",
                brightmagenta: "\x1b[95m",
                brightcyan: "\x1b[96m",
                brightwhite: "\x1b[97m",
            },
            bg: {
                black: "\x1b[40m",
                red: "\x1b[41m",
                green: "\x1b[42m",
                yellow: "\x1b[43m",
                blue: "\x1b[44m",
                magenta: "\x1b[45m",
                cyan: "\x1b[46m",
                white: "\x1b[47m",
                brightblack: "\x1b[100m",
                brightred: "\x1b[101m",
                brightgreen: "\x1b[102m",
                brightyellow: "\x1b[103m",
                brightblue: "\x1b[104m",
                brightmagenta: "\x1b[105m",
                brightcyan: "\x1b[106m",
                brightwhite: "\x1b[107m",
            }
        };

        this.types = this.generateTypes();
    }

    generateTypes() {
        const defaultTypes = {
            chat: ["CHAT", this.cci.fg.white, this.cci.bg.brightblack],
            info: ["INFO", this.cci.fg.black, this.cci.bg.brightcyan],
            warn: ["WARN", this.cci.fg.brightred, this.cci.bg.brightyellow],
            oops: ["OOPS", this.cci.fg.brightblack, this.cci.bg.brightred]
        };

        // Merge default types with custom styles
        Object.keys(this.customStyles).forEach((type) => {
            const customStyle = this.customStyles[type];
            defaultTypes[type] = [
                type.toUpperCase(),
                this.cci.fg[customStyle.fg],
                this.cci.bg[customStyle.bg]
            ];
        });

        return defaultTypes;
    }

    generateFunction(type) {
        return (message) => {
            const timestamp = this.disableTimestamps ? "" : new Date().toUTCString();
            const format = this.types[type];
            const formattedType = format[0];
            const color = format[1] + format[2];

            const lines = message.split(`\n`);
            const timestampLength = timestamp.length;

            const formattedMessage = lines
                .map((line, index) => {
                    if (index === 0) {
                        return `${this.cci.reset}${color}| ${formattedType} |${this.cci.reset} ${line}${this.cci.reset}`;
                    } else {
                        const padding = ` `.repeat(timestampLength + 12);
                        return `${padding}${color}|${this.cci.reset} ${line}${this.cci.reset}`;
                    }
                })
                .join('\n');

            let finalMessage = `${this.cci.bg.white}${this.cci.fg.black}| ${timestamp} |${this.cci.reset} ${formattedMessage}\n${this.cci.reset}`;
            process.stdout.write(finalMessage);
        };
    }

    init() {
        Object.keys(this.types).forEach((type) => {
            this[type] = this.generateFunction(type);
        });
    }
}

module.exports = Loginator;