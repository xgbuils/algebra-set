var toGlobal = require('./regexp-utils/to-global')
var exec = require('./regexp-utils/exec')

function TokenCalculator (string, creators) {
    this.string = string
    this.creators = creators.map(function (creator) {
        var builders = creator.builder
        return {
            regexp: toGlobal(creator.regexp),
            builder: Array.isArray(builders) ? builders : [builders]
        }
    })
}

TokenCalculator.prototype.calculate = function (column) {
    var creators = this.creators
    var string = this.string
    var regexp
    for (var i = 0; i < creators.length; ++i) {
        var creator = creators[i]
        regexp = creator.regexp
        var builders = creator.builder
        var key = this.key = exec(regexp, this.string, column - 1)
        for (var j = 0; j < builders.length; ++j) {
            var token = builders[j]
                .withKey(key)
                .withColumn(column)
                .build()
            if (token) {
                return token
            }
        }
    }
    throw Error('Unexpected `' + string.slice(column - 1, string.length) + '` in column ' + column + '.')
}

module.exports = TokenCalculator
