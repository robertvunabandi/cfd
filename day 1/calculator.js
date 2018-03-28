'use strict';

/**
 * Scroll to the bottom for instructions about states.
 * */

// operations
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

// define the calculator class and its methods
class Calculator {

  constructor() {
    this.setToInitialState();
  }

  setToInitialState() {
    this.blocks = ['0', '0'];
    this.operation = OP.PLUS;
    this.display = 0;
    this.state = Calculator.STATE.INITIAL;
  }

  // states that the calculator can get into
  static get STATE() {
    return {
      INITIAL: 190,
      TRANSITION: 191,
      EQUAL: 192,
      TRANSITION_FROM_INITIAL: 193,
      TRANSITION_FROM_TRANSITION: 194,
      TRANSITION_FROM_EQUAL: 195
    };
  }

  getDisplay() {
    return parseFloat(this.blocks[this.display]);
  }

  static convertKeyboardInput(keyCode) {
    /**
     * TODO: IMPLEMENT THIS METHOD BY LOOKING AT ASCII CODES OR KEYBOARD EVENTS WHEN NEEDED
     * */
    throw new Error('NotImplementedError: convertKeyboardInput');
  }

  receiveInput(input) {
    if (Calculator.isNumber(input)) {
      this.handleNumberInput(input);
    } else if (Calculator.isOperation(input)) {
      this.handleOperationInput(input);
    } else if (Calculator.isEqual(input)) {
      this.handleEqualInput();
    } else if (Calculator.isReset(input)) {
      this.reset();
    } else {
      throw new Error('invalid input received');
    }
  }

  static isNumber(input) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9][input] !== undefined;
  }

  // todo - handle dot for decimals possibly?
  handleNumberInput(input) {
    switch (this.state) {
      case Calculator.STATE.INITIAL:
        this.blocks[this.display] = input.toString();
        this.state = Calculator.STATE.TRANSITION_FROM_INITIAL;
        break;
      case Calculator.STATE.TRANSITION:
        this.display = 1 - this.display;
        this.blocks[this.display] = input.toString();
        this.state = Calculator.STATE.TRANSITION_FROM_TRANSITION;
        break;
      case Calculator.STATE.EQUAL:
        this.display = 1 - this.display;
        this.blocks[this.display] = input.toString();
        this.state = Calculator.STATE.TRANSITION_FROM_EQUAL;
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
      case Calculator.STATE.TRANSITION_FROM_INITIAL:
        this.blocks[1 - this.display] = this.blocks[this.display];
        this.state = Calculator.STATE.TRANSITION;
        break;
      default:
        this.state = Calculator.STATE.TRANSITION;
        break;
    }
  }

  static isEqual(input) {
    return OP[OP.NUMBERS[input]] === OP.EQ;
  }

  handleEqualInput() {
    let operation_result = this.runOperation(this.operation);
    switch (this.state) {
      case Calculator.STATE.INITIAL:
        break;
      case Calculator.STATE.TRANSITION_FROM_INITIAL:
        this.state = Calculator.STATE.INITIAL;
        break;
      default:
        this.display = 0;
        this.blocks[this.display] = operation_result.toString();
        this.state = Calculator.STATE.EQUAL;
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

  static isReset(input) {
    return input === Calculator.RESET;
  }

  static get RESET() {
    return 95;
  }

  reset() {
    switch (this.state) {
      case Calculator.STATE.INITIAL:
        this.setToInitialState();
        break;
      case Calculator.STATE.TRANSITION_FROM_INITIAL:
        this.setToInitialState();
        break;
      case Calculator.STATE.TRANSITION:
        this.setToInitialState();
        break;
      case Calculator.STATE.TRANSITION_FROM_TRANSITION:
        if (this.blocks[1] === '0') {
          this.setToInitialState();
        } else {
          this.blocks[1] = '0';
          this.state = Calculator.STATE.TRANSITION_FROM_TRANSITION;
        }
        break;
      case Calculator.STATE.EQUAL:
        if (this.blocks[0] === '0') {
          this.setToInitialState();
        } else {
          this.blocks[0] = '0';
          this.state = Calculator.STATE.TRANSITION_FROM_EQUAL;
        }
        break;
      case Calculator.STATE.TRANSITION_FROM_EQUAL:
        this.setToInitialState();
        break;
      default:
        throw new Error('Not at valid state. Something has gone wrong!');
    }
  }
}

/*
state descriptions:
F: first, S: second, OP: operation, D: display
use tuple representation, i.e. (F,S,OP,D)

the BASE_INITIAL state is: (0,0,+,F)
inputs can be numbers (d0, dk, s0, sk), operations (OP),
equality (EQ), or reset (RES).

INITIAL:
  (0,0,+,F)
  INITIAL + d0 -> TRANSITION_FROM_INITIAL: (d0,+,0,F)
  INITIAL + OP -> TRANSITION: (0,OP,0,F)
  INITIAL + EQ -> INITIAL: (0,0,+,F)
  INITIAL + RES -> INITIAL: BASE_INITIAL

TRANSITION_FROM_INITIAL:
  (d0...dk,+,0,F)
  TRANSITION_FROM_INITIAL + dk -> TRANSITION_FROM_INITIAL: (d0...dk,+,0,F)
  TRANSITION_FROM_INITIAL + OP -> TRANSITION: (d0...dk,+,d0...dk,F)
  TRANSITION_FROM_INITIAL + EQ -> INITIAL: (d0...dk-op-0,+,0,F)
  TRANSITION_FROM_INITIAL + RES -> RESET: INITIAL: BASE_INITIAL

TRANSITION:
  (d0...dk,OP,d0...dk,F)
  TRANSITION + s0 -> (d0...dk,OP,s0,S)
  TRANSITION + OP -> TRANSITION: (d0...dk,OP,d0...dk,F)
  TRANSITION + EQ -> EQUAL: (d0...dk-op-d0...dk,OP,d0...dk,F)
  TRANSITION + RESET -> INITIAL: BASE_INITIAL

TRANSITION_FROM_TRANSITION:
  (d0...dk,OP,s0...sk,S)
  TRANSITION_FROM_TRANSITION + sk -> TRANSITION_FROM_TRANSITION: (d0...dk,OP,s0...sk,S)
  TRANSITION_FROM_TRANSITION + OP -> TRANSITION: (d0...dk-op-s0...sk,OP,s0...sk,F)
  TRANSITION_FROM_TRANSITION + EQ -> EQUAL: (d0...dk-op-s0...sk,OP,s0...sk,F)
  TRANSITION_FROM_TRANSITION + RES -> TRANSITION_FROM_TRANSITION: (d0...dk,OP,0,S)

EQUAL:
  (F-op-S,OP,s0...sk,F)
  EQUAL + d0 -> TRANSITION_FROM_EQUAL: (d0,OP,s0...sk,F)
  EQUAL + OP -> TRANSITION: (F-op-S,OP,F-op-S,F)
  EQUAL + EQ -> EQUAL: ((F-op-S)-op-s0...sk,OP,s0...sk,F)
  EQUAL + RES -> TRANSITION_FROM_EQUAL: (0,OP,s0...sk,F)

TRANSITION_FROM_EQUAL:
   (d0...dk,OP,s0...sk,F)
   TRANSITION_FROM_EQUAL + dk -> (d0...dk,OP,s0...sk,F)
   TRANSITION_FROM_EQUAL + OP -> TRANSITION: (d0...dk,OP,d0...dk,F)
   TRANSITION_FROM_EQUAL + EQ -> EQUAL: (d0...dk-op-s0...sk,OP,s0...sk,F)
   TRANSITION_FROM_EQUAL + RES -> BASE_INITIAL
*/