function repeat (num, ch) {
    var str = ''
    for (var i = 0; i < num; ++i) {
        str += ch
    }
    return str
}

module.exports = repeat
