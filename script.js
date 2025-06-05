// Refrence display element
const display = document.getElementById('display');

// Track if we have performed a calculation 
let justCalculated = false;

function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

function getLastChar() {
    return display.value.slice(-1);
}

function safeEval(expression) {
    try {
        // Replace x and ÷ with * and /
        let jsExpression = expression
            .replace(/x/g, '*')
            .replace(/÷/g, '/');

        // Only allow numbers, operators, parentheses, dots, and spaces
        if (!/^[0-9+\-*/.() ]+$/.test(jsExpression)) {
            throw new Error('Invalid characters in expression');
        }

        // Evaluate the expression
        const result = Function('"use strict";return (' + jsExpression + ')')();

        // Check if result is a finite number
        if (!isFinite(result)) {
            throw new Error('Result is not a finite number');
        }

        return result;
    } catch (error) {
        console.error('Calculation error:', error);
        return 'Error';
    }
}

function appendToDisplay(value) {
    console.log('Button pressed', value);

    let currentValue = display.value;

    // Handle negative sign at the start (replace 0 with -)
    if (value === '-' && currentValue === '0') {
        display.value = '-';
        justCalculated = false;
        console.log('Display updated to: ', display.value);
        return;
    }

    // Only allow one operator in the expression (except for leading minus)
    if (isOperator(value)) {
        // Don't allow operator at the start except for minus (handled above)
        if (currentValue === '' || currentValue === '-') {
            return;
        }
        // If last char is operator, replace it
        if (isOperator(getLastChar())) {
            display.value = currentValue.slice(0, -1) + value;
            justCalculated = false;
            console.log('Display updated to: ', display.value);
            return;
        }
        // If there's already an operator (not at the start), block new operator
        // (skip leading minus)
        let checkValue = currentValue.startsWith('-') ? currentValue.slice(1) : currentValue;
        if (/[+\-*/]/.test(checkValue)) {
            return;
        }
        display.value = currentValue + value;
        justCalculated = false;
        console.log('Display updated to: ', display.value);
        return;
    }

    // If just calculated and a number is pressed, start new entry
    if (justCalculated && !isNaN(value)) {
        display.value = value;
        justCalculated = false;
        return;
    }

    // If just calculated and operator is pressed, continue calculation
    if (justCalculated && isOperator(value)) {
        display.value = currentValue + value;
        justCalculated = false;
        return;
    }

    // Handle decimal
    if (value === '.') {
        // Get the last number on the display
        let lastNumber = currentValue.split(/[+\-*/]/).pop();
        // Only add the decimal if the current number does not have it
        if (!lastNumber.includes('.')) {
            display.value = currentValue + value;
        }
        justCalculated = false;
        console.log('Display updated to: ', display.value);
        return;
    }

    // Handle numbers
    if (!isNaN(value)) {
        if (currentValue === '0') {
            display.value = value;
        } else if (currentValue === '-0') {
            display.value = '-' + value;
        } else {
            display.value = currentValue + value;
        }
        justCalculated = false;
        console.log('Display updated to: ', display.value);
        return;
    }
}

function clearDisplay(){
    console.log('Clear button pressed');
    display.value = '0';
    justCalculated = false;
    
    display.style.backgroundColor = '#f0f0f0';
    setTimeout(() => {
        display.style.backgroundColor = '';
    },350);
}

function deleteLast(){
    console.log('Backspace button pressed');

    let currentValue = display.value;

    // If there's only one character or it's 0, reset to 0
    if (currentValue.length <= 1 || currentValue === '0') {
        display.value ='0';
    } else {
        display.value = currentValue.slice(0, -1);
    }
}

function calculate() {
    let expression = display.value;

    //Dont calc if display is empty
    if (expression ===  '0' || expression === '') {
        return;
    }

    // Dont calc if last char is an operator
    if (isOperator(getLastChar())) {
        return;
    }

    let result = safeEval(expression);

    if (result === 'Error') {
        display.value = 'Error';
        setTimeout(() => {
            clearDisplay()
        }, 2000);
    } else {
        if (Number.isInteger(result)) {
            display.value = result.toString();
        } else {
            display.value = parseFloat(result.toFixed(10)).toString();
        } 


        justCalculated = true;
    }

    display.style.backgroundColor = '#d4edda';
    setTimeout(() => {
        display.style.backgroundColor = '';
    }, 300);
}

document.addEventListener('keydown' , function (event) {
    console.log('key pressed', event.key);

    if (event.key >= '0'&& event.key <= '9') {
        appendToDisplay(event.key);
    } else if (event.key === '.') {
        appendToDisplay('.');
    } else if (event.key === '+') {
        appendToDisplay('+');
    } else if (event.key === '-') {
        appendToDisplay('-');
    } else if (event.key === '*') {
        appendToDisplay('*');
    } else if (event.key === '/') {
        event.preventDefault();
        appendToDisplay('/');
    } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    } else if (event.key === 'Escape' || event.key === 'C' || event.key === 'c' ) {
        clearDisplay();
    } else if (event.key === 'Backspace' || event.key === '⌫') {
        deleteLast();
    }
})

document.addEventListener('DOMContentLoaded', function() {
    console.log('Calculator loaded successfully');
    console.log('Display element', display);

    if (display) {
        console.log('Current display value', display.value);
    } else {
        console.log('Display element not found');
    }
});