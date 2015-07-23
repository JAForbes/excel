var getByAddress = (table) => (address) =>
  table[address[0].toUpperCase().charCodeAt() - 65][address[1]-1]

module.exports = getByAddress