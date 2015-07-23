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
        [ c("A1"), c("A2"), c("A3"), c("A4") ],
        [ c("B1"), c("B2"), c("B3"), c("B4") ],
        [ c("C1"), c("C2"), c("C3"), c("C4") ],
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
        var evaluated = eval(cell.calculated) || ""
      } catch (e) {
        console.error(e.message)
      }
      return m("input[type=text]", {
          value: ctrl.focused == cell.address ? cell.formula : evaluated,
          oninput: m.withAttr("value",
            ( value ) => (cell.formula = value) && calculate(ctrl.table, flatten(ctrl.table))
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