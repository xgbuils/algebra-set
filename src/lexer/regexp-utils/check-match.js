function checkMatch (match, regexp, column) {
    var lastIndex = regexp.lastIndex
    return match && lastIndex - column === match.length
}

module.exports = checkMatch
