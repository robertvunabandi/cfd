'use strict';

const OP = {
  PLUS: 90,
  MINUS: 91,
  MULT: 92,
  DIV: 93,
  EQ: 94,
  NUMBERS: {
    90: 'PLUS',
    91: 'MINUS',
    92: 'MULT',
    93: 'DIV',
    94: 'EQ'
  }
};

const STATE = {
  INITIAL: 190,
  TRANSITION: 191,
  EQUAL: 192,
  TRANSITION_FROM_INITIAL: 193,
  TRANSITION_FROM_TRANSITION: 194,
  TRANSITION_FROM_EQUAL: 195
};

class Calculator {
  static get RESTART() {
    return 95;
  }

  constructor() {
    this.setToInitialState();
  }

  setToInitialState() {
    this.blocks = ['0', '0'];
    this.operation = OP.PLUS;
    this.display = 0;
    this.state = STATE.INITIAL;
  }

  receiveKeyboardInput(keyCode) {
    let input = Calculator.convertKeyboardInput(keyCode);
    this.receiveInput(input);
  }

  static convertKeyboardInput(keyCode) {
    throw new Error('NotImplementedError: convertKeyboardInput');
  }

  receiveInput(input) {
    if (Calculator.isNumber(input)) {
      this.handleNumberInput(input);
    } else if (Calculator.isOperation(input)) {
      this.handleOperationInput(input);
    } else if (Calculator.isEqual(input)) {
      this.handleEqualInput();
    } else if (Calculator.isRestart(input)) {
      this.restart();
    } else {
      throw new Error('invalid input received');
    }

  }

  static isNumber(input) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9][input] !== undefined;
  }

  handleNumberInput(input) {
    switch (this.state) {
      case STATE.INITIAL:
        this.blocks[this.display] = input.toString();
        this.state = STATE.TRANSITION_FROM_INITIAL;
        break;
      case STATE.TRANSITION:
        this.display = 1 - this.display;
        this.blocks[this.display] = input.toString();
        this.state = STATE.TRANSITION_FROM_TRANSITION;
        break;
      case STATE.EQUAL:
        this.display = 1 - this.display;
        this.blocks[this.display] = input.toString();
        this.state = STATE.TRANSITION_FROM_EQUAL;
        break;
      default:
        this.blocks[this.display] += input.toString();
        break;
    }
  }

  static isOperation(input) {
    let input_map = OP[OP.NUMBERS[input]];
    if (input_map !== undefined) {
      return input_map !== OP.EQ;
    }
    return false;
  }

  handleOperationInput(input) {
    this.operation = input;
    switch (this.state) {
      case STATE.TRANSITION_FROM_INITIAL:
        this.blocks[1 - this.display] = this.blocks[this.display];
        this.state = STATE.TRANSITION;
        break;
      default:
        this.state = STATE.TRANSITION;
        break;
    }
  }

  static isEqual(input) {
    return OP[OP.NUMBERS[input]] === OP.EQ;
  }

  handleEqualInput() {
    let operation_result = this.runOperation(this.operation);
    switch (this.state) {
      case STATE.INITIAL:
        break;
      case STATE.TRANSITION_FROM_INITIAL:
        this.state = STATE.INITIAL;
        break;
      default:
        this.blocks[0] = operation_result.toString();
        this.state = STATE.EQUAL;
        break;
    }
  }

  runOperation(operation) {
    switch (operation) {
      case OP.PLUS:
        return Calculator.add(this.blocks);
      case OP.MINUS:
        return Calculator.sub(this.blocks);
      case OP.MULT:
        return Calculator.mul(this.blocks);
      case OP.DIV:
        return Calculator.div(this.blocks);
      default:
        throw new Error('Invalid Operation received');
    }
  }

  static add(block) {
    return parseFloat(block[0]) + parseFloat(block[1]);
  }

  static sub(block) {
    return parseFloat(block[0]) - parseFloat(block[1]);
  }

  static mul(block) {
    return parseFloat(block[0]) * parseFloat(block[1]);
  }

  static div(block) {
    return parseFloat(block[0]) / parseFloat(block[1]);
  }

  static isRestart(input) {
    return input === Calculator.RESTART;
  }

  restart() {
    this.setToInitialState();
    // todo - handle the double press of initial state instead of this
  }
}