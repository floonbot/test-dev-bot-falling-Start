function generateProgressBarLove(value) {
    const totalBars = 17;
    const filledBars = Math.round((value / 100) * totalBars);
    const emptyBars = totalBars - filledBars;

    const filled = '🟪'.repeat(filledBars);
    const empty = '⬜'.repeat(emptyBars);

    return `${filled}${empty} ${value}%`;
}

module.exports = { generateProgressBarLove}