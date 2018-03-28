class CalculatorTest {
  /** try adding 11 + 5, the result should be 16 */
  static test01() {
    let cal = new Calc();
    cal.receiveInput(1);
    cal.receiveInput(1);
    cal.receiveInput(Calc.OP.PLUS);
    cal.receiveInput(5);
    cal.receiveInput(Calc.OP.EQ);
    return cal.getDisplayedNumber() === 11 + 5;
  }

  /** try subtracting 7 from 2, the result should be -5 */
  static test02() {
    let cal = new Calc();
    cal.receiveInput(2);
    cal.receiveInput(Calc.OP.MINUS);
    cal.receiveInput(7);
    cal.receiveInput(Calc.OP.EQ);
    return cal.getDisplayedNumber() === 2 - 7;
  }

  /** try multiplying 7 with 2, the result should be 14 */
  static test03() {
    let cal = new Calc();
    cal.receiveInput(2);
    cal.receiveInput(Calc.OP.MULT);
    cal.receiveInput(7);
    cal.receiveInput(Calc.OP.EQ);
    return cal.getDisplayedNumber() === 2 * 7;
  }

  /** try dividing 7 by 2, the result should be about 0.2857142857142857 */
  static test04() {
    let cal = new Calc();
    cal.receiveInput(2);
    cal.receiveInput(Calc.OP.DIV);
    cal.receiveInput(7);
    cal.receiveInput(Calc.OP.EQ);
    return cal.getDisplayedNumber() === 2 / 7;
  }

  /** try handling decimals */
  static test05() {
    let cal = new Calc();
    cal.receiveInput(2);
    cal.receiveInput('.');
    cal.receiveInput(1);
    cal.receiveInput(Calc.OP.PLUS);
    cal.receiveInput(3);
    cal.receiveInput(Calc.OP.EQ);
    return cal.getDisplayedNumber() === 2.1 + 3;
  }

  static test06() {
    let cal = new Calc();
    cal.receiveInput(2);
    cal.receiveInput('.');
    cal.receiveInput(1);
    cal.receiveInput(Calc.OP.MULT);
    cal.receiveInput(3);
    cal.receiveInput('.');
    cal.receiveInput(5);
    cal.receiveInput(Calc.OP.EQ);
    return cal.getDisplayedNumber() === 2.1 * 3.5;
  }

  /** following tests are checking if the display is correct */
  static test07() {
    let cal = new Calc();
    cal.receiveInput(2);
    cal.receiveInput('.');
    cal.receiveInput(1);
    return cal.getDisplayedNumber() === '2.1';
  }

  static test08() {
    let cal = new Calc();
    cal.receiveInput(2);
    cal.receiveInput('.');
    cal.receiveInput(1);
    cal.receiveInput('.');
    cal.receiveInput('.');
    return cal.getDisplayedNumber() === '2.1';
  }

  static test09() {
    let cal = new Calc();
    cal.receiveInput(2);
    cal.receiveInput('.');
    cal.receiveInput(1);
    cal.receiveInput('.');
    cal.receiveInput(0);
    cal.receiveInput(2);
    return cal.getDisplayedNumber() === '2.102';
  }

  /** following are testing transition and transition from transition */

  // todo - add tests here

  /** following are testing trailing and transition from trailing */

  // todo - add tests here

  /** utilities to test all the functions at the same time */

  static getAllTests() {
    return [
      CalculatorTest.test01,
      CalculatorTest.test02,
      CalculatorTest.test03,
      CalculatorTest.test04,
      CalculatorTest.test05,
      CalculatorTest.test06,
      CalculatorTest.test07,
      CalculatorTest.test08,
      CalculatorTest.test09
    ];
  }

  static runAllTests(verbose = false) {
    let output = '';
    CalculatorTest.getAllTests().forEach(function (test, index) {
      if (verbose) {
        console.log(`- TEST ${index + 1} - - - - - -`);
      }
      if (!test(verbose)) {
        output += `FAILED ${index + 1}\n`;
      }
    });
    if (output.length === 0) {
      return 'passed all tests!';
    }
    return output;
  }
}
