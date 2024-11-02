const colorize = (text: string, color: string) => {
    const colors: Record<string, string> = {
        green: '\x1b[32m',
        red: '\x1b[31m',
        reset: '\x1b[0m',
    };
    return colors[color] ? `${colors[color]}${text}${colors.reset}` : text;
};

export default colorize;
