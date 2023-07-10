async function loginator(message, messageType) {
    var cci = {
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
    message ??= " ";
    messageType ??= "info";
    const types = {
        cmdr: ["CMDR", cci.fg.green, cci.bg.brightblack],
        info: ["INFO", cci.fg.cyan, cci.bg.brightblack],
        warn: ["WARN", cci.fg.yellow, cci.bg.brightblack],
        oops: ["OOPS", cci.fg.red, cci.bg.brightblack]
    }

    const timestamp = new Date().toUTCString();
    const format = types[messageType]
    const formattedType = format[0];
    const color = format[1] + format[2];

    const lines = message.split(`\n`);
    const timestampLength = timestamp.length;
    const formattedMessage = lines
        .map((line, index) => {
            if (index === 0) {
                return `${cci.reset}${color}| ${formattedType} |${cci.reset} ${line}${cci.reset}`;
            } else {
                const padding = ` `.repeat(timestampLength + 12);
                return `${padding}${color}|${cci.reset} ${line}${cci.reset}`;
            }
        })
        .join('\n');
    
    let finalMessage = `${cci.bg.white}${cci.fg.black}| ${timestamp} |${cci.reset} ${formattedMessage}\n${cci.reset}`;
    process.stdout.write(finalMessage);
}

module.exports = { loginator }