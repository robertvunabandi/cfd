class CalculatorTest {
  /** try adding 11 + 5, the result should be 16 */
  static test01() {
    let cal = new Calculator();
    cal.receiveInput(1);
    cal.receiveInput(1);
    cal.receiveInput(OP.PLUS);
    cal.receiveInput(5);
    cal.receiveInput(OP.EQ);
    return cal.getDisplay() === 16;
  }

  /** try subtracting 7 from 2, the result should be -5 */
  static test02() {
    let cal = new Calculator();
    cal.receiveInput(2);
    cal.receiveInput(OP.MINUS);
    cal.receiveInput(7);
    cal.receiveInput(OP.EQ);
    return cal.getDisplay() === -5;
  }

  /** try multiplying 7 with 2, the result should be 14 */
  static test03() {
    let cal = new Calculator();
    cal.receiveInput(2);
    cal.receiveInput(OP.MULT);
    cal.receiveInput(7);
    cal.receiveInput(OP.EQ);
    return cal.getDisplay() === 14;
  }

  /** try dividing 7 by 2, the result should be about 0.2857142857142857 */
  static test04() {
    let cal = new Calculator();
    cal.receiveInput(2);
    cal.receiveInput(OP.DIV);
    cal.receiveInput(7);
    cal.receiveInput(OP.EQ);
    return cal.getDisplay() === 2/7;
  }

  /** following tests are checking if the display is correct */
  // todo - add tests here

  static getAllTests() {
    return [
      CalculatorTest.test01,
      CalculatorTest.test02,
      CalculatorTest.test03,
      CalculatorTest.test04
    ];
  }

  static runAllTests() {
    let output = '';
    CalculatorTest.getAllTests().forEach(function (test, index) {
      if (!test()) {
        output += `FAILED ${index + 1}\n`;
      }
    });
    if (output.length === 0) {
      return 'passed all tests!';
    }
    return output;
  }
}
