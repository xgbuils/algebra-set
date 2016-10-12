# math.function

Function to work with mathemathic concepts.

Javascript function does not have useful properties like domain and image. This package solves it creating a constructor that returns a function with this properties.

## Version
0.1.0

## Install
``` bash
npm install math.function
```

## Usage
``` javascript
var MFunction = require('math.function')
var MSet = require('math.set')

var sum = new MFunction(intervalSum)

sum.domain // returns [new MSet('-Infinity, Infinity'), new MSet('-Infinity, Infinity')]
sum.image // returns (-Infinity, Infinity) instance of math.set

sum(5, 6) // returns 11

sum.domain = ['(2, 3] U {4}', '(1, 2) U {3}']
sum.domain // returns [new MSet('(2, 3] U {4}'), new MSet('(1, 2) U {3}')]
sum.image // returns new MSet('(3, 5) U (5, 6] U {7}')

sum(2, 3) // throws an error (2 does not belongs to domain)

function intervalSum (a, b) {
    return [{
        value: a[0].value + b[0].value,
        limit: a[0].limit || b[0].limit
    }, {
        value: a[1].value + b[1].value,
        limit: a[1].limit || b[1].limit
    }]
}
```

## API

### Function
#### constructor(intervalFunction, domain)

Constructor creates an instance of javascript Function. This function is constructed based on a function parameter `intervalFunction` that defines the behaviour of the created function when it is applied to intervals with this [data structure](https://github.com/xgbuils/math.interval-utils#interval).

For example, in sum operation, given intervals `(a, b]` and `[c, d)`, the result is the interval `(a + c, b + d)`. Investigating a bit, it is posible to deduce that the function that given two intervals returns the interval that represents the sum of intervals is:
``` javascript
function intervalSum (interval1, interval2) {
    return [{
        value: interval1[0].value + interval2[0].value,
        limit: interval1[0].limit || interval2[0].limit
    }, {
        value: interval1[1].value + interval2[1].value,
        limit: interval1[1].limit || interval2[1].limit
    }]
}
```
Then, passing this function as parameter the sum function is created:
``` javascript
var MFunction = require('math.function')
var sum = new MFunction(intervalSum)
sum(2, 6) // returns 8
sum(5, 5) // returns 10
```
##### intervalFunction (...intervals)
It is the parameter that given interval parameters, it returns the interval resulting of the operation.

##### domain
`domain` parameter is an array of SetCastable values that defines the domain of created function.

#### .domain
`domain` property is an array of instances of [`math.set`](https://github.com/xgbuils/math.set). The length of array corresponds with the number of parameters of function instance. The `domain` property is an array of Real sets by default:

```
var MFunction = require('math.function')
var MSet = require('math.set')

var sum = new MFunction(intervalSum)
sum.domain // it returns default value new [new MSet('(-Infinity, Infinity)'), new MSet('(-Infinity, Infinity)')]
```
Besides, if domain is set with an array of  [SetCastable](https://github.com/xgbuils/math.set#setcastable) values, it return a set that represents this value:
``` javascript
sum.domain = ['(2, 4)', '{3, 4, 5} U [0, 1)']
sum.domain // now it returns [new MSet('(2, 4)'), new MSet('{3, 4, 5} U [0, 1)')]
```



#### .image
`image` property is an instance of [`math.set`](https://github.com/xgbuils/math.set) that depends on the domain of function instance and `intervalFunction` constructor parameter. For example:
``` javascript
var MFunction = require('math.function')
var MSet = require('math.set')

var sum = MFunction(intervalSum)

sum.domain = ['[2, 3]'), '{5}']
sum.image // returns new MSet('[7, 8]')

sum.domain = ['(2, 3] U {4}', '(1, 2) U {3}']
sum.image // returns new MSet('(3, 5) U (5, 6] U {7}')
```

## LICENSE
MIT
