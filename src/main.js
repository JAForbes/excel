var m = require("mithril")


var getByAddress = require("./utils/getByAddress")
var flatten = require("./utils/flatten")

var calculate = require("./calculate")


var cell = (address, formula, calculated) => ({
  address: address,
  formula: String(formula || ""),
  calculated: calculated || "",
})




var app = {


  controller: function(){
    var c = cell;
    var instance = {
      focused: null,
      blurCell: ( cell ) => instance.focused == cell.address && (instance.focused = null),
      table: [
        [ c("A1", "Gross"), c("A2", "Tax"), c("A3", "Net"), c("A4") ],
        [ c("B1", 3000), c("B2","=0.37 * B1"), c("B3","=B1 - B2"), c("B4") ],
        [ c("C1","=add = (a,b) => a + b"), c("C2", "= sum = (list) => list.reduce(add)"), c("C3", "=sum([B1, B2, B3])"), c("C4") ],
      ]
    }
    calculate( instance.table, flatten(instance.table) )
    return instance;
  },

  views: {
    row: function(ctrl, cells, rowI){
      return m("tr",
        cells.map(
          app.views.cell.bind(null, ctrl, rowI)
        )
      )
    },
    table: function(ctrl, rows){
      return m("table",
        rows.map(
          app.views.row.bind(null, ctrl)
        )
      )
    },
    cell: function(ctrl, rowI, cell, cellI){


      try {
        var evaluated = cell.formula[0] == "=" && eval(cell.calculated) || cell.formula
      } catch (e) {}

      return m("input[type=text]", {
          value: ctrl.focused == cell.address ? cell.formula : evaluated,
          oninput: m.withAttr("value",
            (( value ) => {

              cell.formula = value;

              try {
                calculate(ctrl.table, flatten(ctrl.table))
              } catch (e) {
                console.error(e)
              }
            })
          ),
          onfocus: () => ctrl.focused = cell.address,
          onblur:  () => {
            ctrl.blurCell(cell)
          }
        }
      )
    }
  },

  view: function(ctrl){

    return [
      app.views.table( ctrl, ctrl.table )
    ]
  }
}


global.component = m.mount(document.body, { view: app.view, controller: app.controller })


//global.component = component
global.app = app