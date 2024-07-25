function calculate(number1, operator, number2) {
    switch (operator) {
        case "+":
            return number1 + number2;
        case "-":
            return number1 - number2;
        case "*":
            return number1 * number2;
        case "/":
            return number2 !== 0 ? number1 / number2 : "Division by zero";
        default:
            return "Invalid operator";
    }
}

module.exports = {  calculate };
