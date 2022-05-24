function binarify (input) {
  return input.split("").map(x => x.charCodeAt(0).toString(2)).join(" ");
}

module.exports = binarify;