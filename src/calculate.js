var getByAddress = require("./utils/getByAddress")

var address_pattern = /([A-z][0-9])/g

var get = (property) => (target) => target[property]

var pluck = (property) => (list) =>
  list.map( get(property) )

var flatten = require("./utils/flatten")


var cellIsPending = (calculated) => (address) =>  !calculated[address]
var replaceCellReference = (calculated, matching_cell) => calculated.replace( matching_cell.address, matching_cell.calculated )

function calculate(table, cells){
  var stack = cells.slice();
  var calculated = {}
  while( stack.length ){
    var cell = stack.shift()

    var matches = cell.formula.match(address_pattern);

    if( matches){

      var pending = matches.some( cellIsPending(calculated) )
      if( pending ){

        //add the matching cells to be calculated

        [].push.apply( stack, matches.map( getByAddress(table) ) )
        stack.push(cell)
      } else {

        cell.calculated = matches
          .map(getByAddress(table))
          .reduce(replaceCellReference, cell.formula)

          calculated[cell.address] = true
      }

    } else {
      cell.calculated = cell.formula
      calculated[cell.address] = true
    }

    if(calculated[cell.address]){
      cell.calculated = cell.calculated.replace("=","")
    }


  }
}



module.exports = calculate