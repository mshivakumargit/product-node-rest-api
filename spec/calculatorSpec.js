describe('calculator test suite', () => {
    let CalcUtils = require('../calculator');

    let calculator = null;
    let helper = null;

    beforeEach(() => {
        helper = new CalcUtils.Helper();

        spyOn(helper, 'addHelp').and.callThrough();

        calculator = new CalcUtils.Calculator(helper);
    });

    it('should add two inputs', () => {
        let inputA = 10;
        let inputB = 20;
        let expectedOutput = 60;
        let actual = calculator.process(inputA, inputB);

        expect(helper.addHelp).toHaveBeenCalledTimes(1);
        expect(actual).toBe(expectedOutput);
    });

    afterEach(() => {
        console.log('Test Cleanup!');
    });
});