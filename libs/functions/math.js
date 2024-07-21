function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function calculate(nombre, symbole, nombre1) {
    switch (symbole) {
        case "+":
            return nombre + nombre1;
        case "-":
            return nombre - nombre1;
        case "*":
            return nombre * nombre1;
        case "/":
            if (nombre1 !== 0) {
                return nombre / nombre1;
            } else {
                return "Division by zero";
            }
        default:
            return "Symbole invalide";
    }
}


module.exports = { rollDice, generateRandomNumber, calculate}