function getLoveLevelMessage(result) {
  if (result >= 90) {
    return "❤️ You are a perfect match! True love is in the air!";
  } else if (result >= 70) {
    return "💓 You have a strong connection! Love is definitely possible.";
  } else if (result >= 50) {
    return "💛 There's potential for love. Keep working on it!";
  } else if (result >= 30) {
    return "💙 It might take some effort, but there's a chance for love.";
  } else {
    return "💔 It looks tough, but never give up on love!";
  }
}
module.exports = { getLoveLevelMessage };
