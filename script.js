const calculatorScreen = document.querySelector('.calculator-screen');


let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Function to update the calculator display
function updateDisplay() {
    calculatorScreen.value = displayValue;
}

// Function to handle digit button clicks
function inputDigit(digit) {
    if (waitingForSecondOperand === true) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        // Replace '0' with digit or append digit
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

// Function to handle the decimal point
function inputDecimal(dot) {
    // Prevent multiple decimals in one number
    if (waitingForSecondOperand === true) {
        displayValue = '0.';
        waitingForSecondOperand = false;
        return;
    }

    if (!displayValue.includes(dot)) {
        displayValue += dot;
    }
}

// Function to handle operator button clicks
function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        // Allow changing the operator before entering the second number
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        // Store the first operand
        firstOperand = inputValue;
    } else if (operator) {
        // Calculate the result if an operator and second operand exist
        const result = operate(firstOperand, inputValue, operator);

        // Update display and store result as the new first operand
        displayValue = String(result);
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

// Function for the actual arithmetic operation
function operate(num1, num2, op) {
    if (op === '+') return num1 + num2;
    if (op === '-') return num1 - num2;
    if (op === '*') return num1 * num2;
    if (op === '/') {
        // Handle division by zero
        if (num2 === 0) {
            return 'Error';
        }
        return num1 / num2;
    }
    return num2;
}

// Function to clear all calculator state
function resetCalculator() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

// Event listener for all button clicks
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;

    // Exit if the clicked element is not a button
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
    } else if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
    } else if (target.classList.contains('all-clear')) {
        resetCalculator();
    } else if (target.classList.contains('equal-sign')) {
        // The '=' button will trigger the calculation within handleOperator logic 
        // by passing an operator (like '*') followed by '='.
        // For simplicity here, we'll ensure the calculation runs and resets the operator.
        if (firstOperand !== null && operator !== null && waitingForSecondOperand === false) {
             const inputValue = parseFloat(displayValue);
             const result = operate(firstOperand, inputValue, operator);
             displayValue = String(result);
             firstOperand = null;
             operator = null;
             waitingForSecondOperand = true; // Wait for new input
        }
    } else {
        // Must be a digit button
        inputDigit(target.value);
    }

    updateDisplay();
});

// Initial display setup
updateDisplay();