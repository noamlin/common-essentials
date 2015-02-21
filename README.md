# common-essentials
## Common Javascript Essentials which nodejs is missing
This library simply has a few easy to use and efficient functions which people commonly miss in nodejs. some functions were gathered from over the internet and edit, while other functions are home made. if you recognize your code here and want credit please contact me :)

The functions are:

1. **__stack** - an object that can be accessed globally and creates a stack trace
2. **__line** - an object that can be accessed globally and prints its line-number
3. **optionalArg** - a function for retrieving a default value for missing values in an optional options object
4. **nl2br** - a *new-line*-to-*break-tag* like PHP's nl2br function
5. **varDump** - PHP style var_dump for dumping a variables data to the console or for the browser
6. **tagLog** - normal console logging but with pretty tag prefixing each log
6. **errorLog** - normal console logging for errors with pretty prefixing each line

#### Usage
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
function doEscape(options) {
  var shouldEscapeChars = optionalArg(options, 'escapeChars', true);
}

doEscape( { escapeChars: false } ); // will set the shouldEscapeChars to false
doEscape( { } ); // escapeChars isn't set, so shouldEscapeChars will be its default - true
doEscape(); // options isn't set, so shouldEscapeChars will be its default - true
```
---
**nl2br**(str, html5) - *str* (required) is the string to format. *html5* (optional) is a boolean indicating whether to use html5 `<br>` tags or xhml self-closing `<br />` tags, default is `true`.
