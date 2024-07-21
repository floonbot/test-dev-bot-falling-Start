const fs = require('fs');
const path = require('path');

const colors = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../json/colors.json'), 'utf-8'));

const formattedColors = Object.fromEntries(
    Object.entries(colors).map(([key, value]) => [key, `\x1b[${value}`])
);

module.exports = formattedColors;
