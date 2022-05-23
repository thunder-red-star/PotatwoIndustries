// Evaluates a mathematical equation.

module.exports = function (equation) {
    // Valid operator regex.
    let reg = /(?:[a-z$_][a-z\d$_]*)|(?:[;={}\[\]"'!&<>^\\?:])/ig, valid = true;

    // Detect valid JS identifier names and replace them
    exp = equation.replace(reg, function ($0) {
        // If the name is a direct member of Math, allow
        if (Math.hasOwnProperty($0))
            return "Math."+$0;
        // Otherwise the expression is invalid
        else
            valid = false;
    });

    // If the expression is invalid, return undefined
    if (!valid) {
        return undefined;
    } else {
        try {
            return eval(exp);
        } catch (e) {
            return undefined;
        }
    }
}