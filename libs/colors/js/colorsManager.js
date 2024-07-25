const fs = require('fs');
const path = require('path');

const colorsFilePath = path.resolve(__dirname, '../json/colors.json');
const colors = JSON.parse(fs.readFileSync(colorsFilePath, 'utf-8'));


const formattedColors = Object.fromEntries(
    Object.entries(colors).map(([key, value]) => [key, `\x1b[${value}`])
);

module.exports = formattedColors;
