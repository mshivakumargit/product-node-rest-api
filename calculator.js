class Helper {
    addHelp(a, b) {
        return a + b;
    }
}

class Calculator {
    constructor(helper) {
        this.helper = helper || new Helper();
    }

    process(inputA, inputB) {
        let result = this.helper.addHelp(inputA, inputB);

        result *= 2;

        return result;
    }
}

module.exports = {
    Helper,
    Calculator
};
