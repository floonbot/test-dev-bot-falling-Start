function getBotChoiceRockPaperScissors() {
    const choices = ["rock", "paper", "scissors"];
    return choices[Math.floor(Math.random() * choices.length)];
}

module.exports = { getBotChoiceRockPaperScissors };
