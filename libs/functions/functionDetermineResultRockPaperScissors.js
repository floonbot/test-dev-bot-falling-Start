function determineResult(userChoice, botChoice) {
  if (userChoice === botChoice) {
    return "It's a tie";
  } else if (
    (userChoice === "rock" && botChoice === "scissors") ||
    (userChoice === "paper" && botChoice === "rock") ||
    (userChoice === "scissors" && botChoice === "paper")
  ) {
    return "You win";
  } else {
    return "You lose";
  }
}

module.exports = { determineResult };
