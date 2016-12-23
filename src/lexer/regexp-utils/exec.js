function exec (regexp, string, column) {
    regexp.lastIndex = column
    var matches = regexp.exec(string)
    return matches && matches[0]
}

module.exports = exec
