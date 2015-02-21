# common-essentials
## Common Javascript Essentials which nodejs is missing
This library simply has a few easy to use and efficient functions which people commonly miss in nodejs. some functions were gathered from over the internet and edit, while other functions are home made. if you recognize your code here and want credit please contact me :)

The functions are:

1. **__stack** - an object that can be accessed globally and creates a stack trace
2. **__line** - an object that can be accessed globally and prints its line-number
3. **optionalArg** - a function for retrieving a default value for missing values in an optional options object
4. **nl2br** - a *new-line*-to-*break-tag* like PHP's nl2br function
5. **varDump** - PHP style var_dump for dumping a variable's data to the console or for the browser
6. **tagLog** - normal console logging but with pretty tag prefixing each log
6. **errorLog** - normal console logging for errors with pretty prefixing each line

#### Usage
**installing the library**: write the following line in you terminal
```
npm install common-essentials
```
**using the dependency**:
```
var CE = require('common-essentials');
```

---
**__stack**:
```
var err = __stack;
```
now `err` is an error stack which you can iterate over it and use different functions which V8 engine has. more info about it [here](https://code.google.com/p/v8-wiki/wiki/JavaScriptStackTraceApi).

---
**__line**:
```
someCode;
moreCode;
console.log(__line);
```
this will log `3` to the console because the `__line` was called on line 3 :)

---
**optionalArg**(options, name, defaultValue) - *options* (required) is an object with options. *name* (required) is a string indicating the name of the option we want to check. *defaultValue* (required) is a value to use if the option wasn't set when the function was called
```
var CE = require('common-essentials');
function doEscape(options) {
  var shouldEscapeChars = CE.optionalArg(options, 'escapeChars', true);
}

doEscape( { escapeChars: false } ); // will set the shouldEscapeChars to false
doEscape( { } ); // escapeChars isn't set, so shouldEscapeChars will be its default - true
doEscape(); // options isn't set, so shouldEscapeChars will be its default - true
```

---
**nl2br**(str, html5) - *str* (required) is the string to format. *html5* (optional) is a boolean indicating whether to use html5 `<br>` tags or xhml self-closing `<br />` tags, default is `true`.
```
var CE = require('common-essentials');
var someText = CE.nl2br("a \r\n b \n\r c \n d \r e \r\n\r f \n\r\n g");
// someText = "a <br> b <br> c <br> d <br> e <br><br> f <br><br> g"
```

---
**varDump**(variable, [consoleDump, [userOptions]]) - *variable* (required) is the variable you are going to dump its content. *consoleDump* (optional) a boolean indicating whether to log to the console or to return a string value formatted for the browser, defaults to `true`. *userOptions* (optional) an object which can set a few things - the [util.inspect](http://nodejs.org/api/util.html#util_util_inspect_object_options) options and an `html5` option which is a boolean indicating how to format the text for the browser (in case consoleDump is false)
```
var CE = require('common-essentials');
var someObj = {
  a:1,
  b:"text",
  c:[0,1,2]
};
response.write( CE.varDump(someObj, false) ); // sends the client a formated html variable dump
CE.varDump(someObj, {depth:2}); // console logs the variable with a recursive walk until depth 2
```

---
**tagLog**(tag, text, N-params..) - *tag* (required) is the word to tag the line with. *text* (required) is the text to log, and this text can be formatted like console.log's. *N-params* (optional) extra parameters that console.log can get.
```
var CE = require('common-essentials');
CE.tagLog('DB', 'connected to database'); // logs: [DB] connected to database
CE.tagLog('PORT', 'listening on port %d', 3000); // logs: [PORT] listening on port 3000
```

---
**errorLog**(err) - *err* (required) is an error to be logged and traced with pretty format (using tagLog).
```
var CE = require('common-essentials');
function foo(err, callback) {
  if(err)
    CE.errorLog(err);
}
// outputs something like:
// [ERROR]
//     [>] (/path/index.js:4:12)  "function foo() {"
//     [>] (/path/node_modules/something.js:43:19)  "function () {"
```
