
function getChoiceBot() {
    const choices = ["pierre", "papier", "ciseaux"];
    return choices[Math.floor(Math.random() * choices.length)];
}

function determineResult(userChoice, botChoice) {
    if (userChoice === botChoice) {
        return "Match nul";
    } else if (
        (userChoice === "pierre" && botChoice === "ciseaux") ||
        (userChoice === "papier" && botChoice === "pierre") ||
        (userChoice === "ciseaux" && botChoice === "papier")
    ) {
        return "Vous avez gagné";
    } else {
        return "Vous avez perdu";
    }
}

module.exports = { getChoiceBot, determineResult}