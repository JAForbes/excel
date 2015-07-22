var m = require("mithril")

function cellProp(current){
  function gettersetter(set){
    if( typeof set != "undefined" ){
      console.log("set",set)
      if(set == "" || isNaN(set)){
        current = set.replace(/\n/g,"")
      } else {
        current = Number(set)
      }
    }
    return current
  }
  current = gettersetter(current)
  return gettersetter
}

var app = {


  controller: function(){

    return {
      focused: null,
      table: [
        [cellProp(1),cellProp("=A1 * 2"),cellProp(3)],
        [cellProp(4),cellProp(5),cellProp(6)],
        [cellProp(7),cellProp(8),cellProp(9)]
      ]
    }
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

      var original_str =  (cell()+"");
      var expression = original_str
        .replace("=","")


      var evald = "#REF"
      try {

        ;(expression .match(/([A-z][0-9])/g) || []).forEach(function( match ){

          var row = match[0].toUpperCase().charCodeAt() - 65;
          var col = match[1]-1

          expression = expression .replace(match, ctrl.table[row][col]() )
        })
        evald = eval(expression)
      } catch (e) {
      }

      return m("input[type=text]", {
          value: ctrl.focused != rowI+":"+cellI ? (
            original_str[0] == "=" ? evald : original_str
          ) : original_str
          ,
          oninput: m.withAttr("value", ctrl.table[rowI][cellI] ),
          onfocus: function(){
            ctrl.focused = rowI+":"+cellI
          },
          onblur: function(){
            if( ctrl.focused == rowI+":"+cellI){
              ctrl.focused = null
            }
          }
        }
      )
    }
  },

  view: function(ctrl){

    return [
      m("label",
        m("input[type=text]", { oninput: console.log.bind(console) })
      ),
      app.views.table( ctrl, ctrl.table )
    ]
  }
}

global.ctrl = app.controller()
var loop = function(){
  m.render(document.body, app.view(ctrl))
  requestAnimationFrame(loop)
}
loop()

//global.component = component
global.app = app
global.m = m
global.cellProp = cellProp