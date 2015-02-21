/* FUNCTIONS & VARIABLES FOR GLOBAL USE */
/* stuff that all files and libraries might use */

var util = require('util');
var extend = require('extend');


/*
 * define a global, non-configurable and non-enumerable variables.
 * extra functions for stack at: https://code.google.com/p/v8-wiki/wiki/JavaScriptStackTraceApi
 */
Object.defineProperty(global, '__stack', { // returns an error stack
    get: function() {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) { return stack; };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});
Object.defineProperty(global, '__line', { // returns the code line number from where this function was called
    get: function() {
        return __stack[1].getLineNumber();
    }
});


/*
 * check whether the desired option exists
 * and return the option's value if yes or a default value if not
 *
 * @param {object/undefined} "options" [*required] - the object to check if our option exists inside it.
 * @param {string} "name" [*required] - the name of the option.
 * @param {mixed} "defaultValue" [*required] [mixed] - a default value to return if our option doesn't exist
 *
 * @return {mixed} - a default value or an already existing value (usually a string or a number)
 */
var optionalArg = function optionalArg(options, name, defaultValue) {
    return (options && options[name]!==undefined) ? options[name] : defaultValue;
};
module.exports.optionalArg = optionalArg;


/*
 * converts new-line characters to '<br>' tags
 *
 * @param {string} "str" [*required] - the string to convert its line-breaks chars to '<br>'.
 * @param {boolean} "html5" [optional] - whether to use xhtml '<br />' or else html5 '<br>'. default: true
 *
 * @return {string} - new converted string
 */
var nl2br = function nl2br(str, html5) {
    var breakTag = '<br>';
    if(html5 === false)
        breakTag = '<br>';

    return str.replace(/(\r\n|\n\r|\r|\n)/g, breakTag);
    /*
     USAGE: string.replace(search-value, new-value).
     the 'new-value' can use the special dollar-sign ($).
     $$ = inserts a '$'
     $& = Inserts the matched substring
     $` = Inserts the portion of the string that precedes the matched substring
     $' = Inserts the portion of the string that follows the matched substring
     $n or $nn = Where n or nn are decimal digits, inserts the nth parenthesized submatch string, provided the first argument was a RegExp object
     EXAMPLE: "aaBcc".replace(/(B)/g, 'Z'+'$1'+'W') = "aaZBWcc"
     */
};
module.exports.nl2br = nl2br;


/*
 * dumps variable content recursively - for sending to client's browser or logging to console.
 * relies on node's 'util.inspect'
 *
 * @param {mixed} "variable" [*required] - the variable to dump its content
 * @param {boolean} "consoleDump" [optional] - whether to log the data to the console or return a formatted string for a browser. default: true
 * @param {object} "options" [optional] - options for 'util'
 *
 * @return {string} - a string ready for printing out
 */
var varDump = function varDump(variable, consoleDump, userOptions) {
    if(arguments.length === 2 && typeof consoleDump === "object")
        userOptions = consoleDump;

    if(typeof consoleDump !== "boolean")
        consoleDump = true;

    var options = {
        showHidden: true,
        depth: 4,
        colors: false,
        html5: true
    };
    extend(options, userOptions);

    var output;

    if(typeof(variable) == 'object') {
        if(variable.constructor === Array)
            output = 'array ('+variable.length+')';
        else
            output = 'object ('+Object.keys(variable).length+')';
    }
    else {
        output = typeof(variable);

        if(variable.hasOwnProperty('length'))
            output += ' ('+variable.length+')';
    }

    output += '\n'+util.inspect(variable, options);

    if(!consoleDump) {
        output = output.replace(/(\u0020\u0020)/g, ' &nbsp;'); // replace every 2 spaces into one space + &nbsp
        output = output.replace(/(\t)/g, ' &nbsp;&nbsp;&nbsp;'); // replace every tab into one space + 3 &nbsp
        output = nl2br(output, options.html5);
    }
    else {
        console.log(output);
        output = "variable dumped to the console";
    }

    return output;
};
module.exports.varDump = varDump;


/*
 * logs to console with a pretty formatted tag at the beginning of the line
 *
 * @param {string} "tag" [*required] - tags this log line
 * @param {string} "output" [*required] - the actual string we want to log
 * @N-params {mixed} [optional] - extra parameters of console.log (like when using "bla %d bla %s bla")
 */
var tagLog = function tagLog() {
    var tag = arguments[0],
        tagLength = tag.length,
        formattedTagLength = 12,
        extraSpaces = '';

    for(var i = formattedTagLength - tagLength; i > 0; i--) {
        extraSpaces += ' ';
    }

    arguments[1] = extraSpaces + '['+tag+'] ' + arguments[1]; // format the output with the pretty tag prefixing it
    Array.prototype.shift.apply(arguments); // remove the 'tag' argument. rest of the arguments fit perfectly to console.log

    console.log.apply(this, arguments);
};
module.exports.tagLog = tagLog;


/*
 * logs to console with a pretty formatted tag at the beginning of the line
 *
 * @param {error object} "err" [*required] - an error object to print to the console
 */
var errorLog = function errorLog(err) {
    tagLog('ERROR', err.message);

    var stack = __stack;

    var stackLength = stack.length,
        stackMessage,
        functionString;

    for(var i=1; i < stackLength; i++) {
        functionString = stack[i].getFunction().toString();
        functionString = functionString.split('\n')[0];
        stackMessage = '('+stack[i].getFileName();
        stackMessage += ':'+stack[i].getLineNumber();
        stackMessage += ':'+stack[i].getColumnNumber()+')';
        stackMessage += '  "' + functionString + '"';
        tagLog('>', stackMessage);
    }
};
module.exports.errorLog = errorLog;