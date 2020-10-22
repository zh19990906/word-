/**
 * Created by vxg on 2018/05/07.
 */
//eslint-disable-line
function importFile(file,callback) {
  var fileName = file.name;
  var index = fileName.lastIndexOf('.');
  var fileExt = fileName.substr(index + 1).toLowerCase();
  if (fileExt === 'xlsx') {
    importSpreadFromExcel(file,callback);
  } else {
    alert('文件格式不正确');
  }
}

function importSpreadFromExcel(file,callback, options) {
  var excelIO = new window.GC.Spread.Excel.IO();

  var PASSWORD_DIALOG_WIDTH = 300;
  excelIO.open(file, function (json) {
    callback(json)
  }, function (e) {
    if (e.errorCode === 0 || e.errorCode === 1) {
      alert('文件格式不合法='+e.errorCode);

    } else if (e.errorCode === 2) {
      alert('暂不支持带有密码的文件')
    } else if (e.errorCode === 3) {
      alert('暂不支持带有密码的文件')
    }
    callback(null)
  }, options);
}

// function importJson(spreadJson,spread) {
//   function updateActiveCells() {
//     for (var i = 0; i < spread.getSheetCount(); i++) {
//       var sheet = spread.getSheet(i);
//       const columnIndex = sheet.getActiveColumnIndex()
//        const rowIndex = sheet.getActiveRowIndex();
//       if (columnIndex !== undefined && rowIndex !== undefined) {
//         spread.getSheet(i).setActiveCell(rowIndex, columnIndex);
//       } else {
//         spread.getSheet(i).setActiveCell(0, 0);
//       }
//     }
//   }
//
//   if (spreadJson.version && spreadJson.sheets) {
//     spread.unbindAll();
//     spread.fromJSON(spreadJson);
//     attachSpreadEvents(true);
//     updateActiveCells();
//     spread.focus();
//     fbx.workbook(spread);
//     onCellSelected();
//     syncSpreadPropertyValues();
//     syncSheetPropertyValues();
//   } else {
//     alert('文件格式不合法');
//   }
// }

// function attachSpreadEvents(rebind,spread) {
//   const spreadNS = new window.GC.Spread.Sheets;
//   spread.bind(spreadNS.Events.EnterCell, onCellSelected);
//
//   spread.bind(spreadNS.Events.ValueChanged, function (sender, args) {
//     var row = args.row, col = args.col, sheet = args.sheet;
//
//     if (sheet.getCell(row, col).wordWrap()) {
//       sheet.autoFitRow(row);
//     }
//   });
//
//   function shouldAutofitRow(sheet, row, col, colCount) {
//     for (var c = 0; c < colCount; c++) {
//       if (sheet.getCell(row, col++).wordWrap()) {
//         return true;
//       }
//     }
//
//     return false;
//   }
//
//   spread.bind(spreadNS.Events.RangeChanged, function (sender, args) {
//     var sheet = args.sheet, row = args.row, rowCount = args.rowCount;
//
//     if (args.action === spreadNS.RangeChangedAction.paste) {
//       var col = args.col, colCount = args.colCount;
//       for (var i = 0; i < rowCount; i++) {
//         if (shouldAutofitRow(sheet, row, col, colCount)) {
//           sheet.autoFitRow(row);
//         }
//         row++;
//       }
//     }
//   });
//
//   spread.bind(spreadNS.Events.ActiveSheetChanged, function () {
//     setActiveTab("sheet");
//     syncSheetPropertyValues();
//     syncCellRelatedItems();
//
//     var sheet = spread.getActiveSheet(),
//       picture,
//       chart;
//     var slicers = sheet.slicers.all();
//     for (var item in slicers) {
//       slicers[item].isSelected(false);
//     }
//
//     if (sheet.getSelections().length === 0) {
//       sheet.pictures.all().forEach(function (pic) {
//         if (!picture && pic.isSelected()) {
//           picture = pic;
//         }
//       });
//
//       sheet.charts.all().forEach(function (cha) {
//         if(!chart && cha.isSelected()){
//           chart = cha;
//         }
//       })
//       // fix bug, make sure selection was shown after unselect slicer
//       if (!picture || !chart) {
//         sheet.setSelection(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex(), 1, 1);
//       }
//     }
//     if (picture) {
//       syncPicturePropertyValues(sheet, picture);
//       setActiveTab("picture");
//     } else if (chart) {
//       //syncChartPropertyValues(sheet, chart)
//       showChartPanel(chart);
//     } else{
//       onCellSelected();
//     }
//
//
//     var value = $("div.button", $("div[data-name='allowOverflow']")).hasClass("checked");
//     if (sheet.options.allowCellOverflow !== value) {
//       sheet.options.allowCellOverflow = value;
//     }
//   });
//
//   spread.bind(spreadNS.Events.SelectionChanging, function () {
//     var sheet = spread.getActiveSheet();
//     var selection = sheet.getSelections().slice(-1)[0];
//     if (selection) {
//       var position = getSelectedRangeString(sheet, selection);
//       $("#positionbox").val(position);
//     }
//     syncDisabledBorderType();
//   });
//
//   spread.bind(spreadNS.Events.SelectionChanged, function () {
//     syncCellRelatedItems();
//
//     updatePositionBox(spread.getActiveSheet());
//   });
//
//   spread.bind(spreadNS.Events.PictureSelectionChanged, function (event, args) {
//     var sheet = args.sheet, picture = args.picture;
//
//     if (picture && picture.isSelected()) {
//       syncPicturePropertyValues(sheet, picture);
//       setActiveTab("picture");
//     }
//   });
//
//   spread.bind(spreadNS.Events.ChartClicked, function (event, args) {
//     var sheet = args.sheet, chart = args.chart;
//     showChartPanel(chart);
//   });
//   spread.bind(spreadNS.Events.CommentChanged, function (event, args) {
//     var sheet = args.sheet, comment = args.comment, propertyName = args.propertyName;
//
//     if (propertyName === "commentState" && comment) {
//       if (comment.commentState() === spreadNS.Comments.CommentState.edit) {
//         syncCommentPropertyValues(sheet, comment);
//         setActiveTab("comment");
//       }
//     }
//   });
//
//   spread.bind(spreadNS.Events.ValidationError, function (event, data) {
//     var dv = data.validator;
//     if (dv) {
//       alert(dv.errorMessage() || dv.inputMessage());
//     }
//   });
//
//   spread.bind(spreadNS.Events.SlicerChanged, function (event, args) {
//     bindSlicerEvents(args.sheet, args.slicer, args.propertyName);
//   });
//
//   spread.bind(spreadNS.Events.ActiveSheetChanged, function (event, args) {
//     var newSheet = args.newSheet;
//     if(newSheet.name() === 'Chart'){
//       if(isFirstChart){
//         var chartCount = newSheet.charts.all().length || 0;
//         var columnType = GC.Spread.Sheets.Charts.ChartType.columnClustered;
//         var lineType = GC.Spread.Sheets.Charts.ChartType.line;
//         var lineChart = newSheet.charts.add(('ChartLine' + chartCount), lineType, 550, 130, 450, 300, "Chart!$A$1:$H$5");
//         var columnChart = newSheet.charts.add(('ChartColumn' + chartCount), columnType, 30, 130, 450, 300, "Chart!$A$1:$H$5");
//         columnChart.isSelected(true);
//         addChartEvent(columnChart);
//       }
//       isFirstChart = false;
//     }
//   })
//
//   $(document).bind("keydown", function (event) {
//     if (event.shiftKey) {
//       isShiftKey = true;
//     }
//   });
//   $(document).bind("keyup", function (event) {
//     if (!event.shiftKey) {
//       isShiftKey = false;
//
//       var sheet = spread.getActiveSheet(),
//         position = getCellPositionString(sheet, sheet.getActiveRowIndex() + 1, sheet.getActiveColumnIndex() + 1);
//       $("#positionbox").val(position);
//     }
//   });
//
// }

function exportExcel(spread,fileName,callback) {

  var excelIO = new window.GC.Spread.Excel.IO();
  if (fileName.length<6 || fileName.substr(-5, 5) !== '.xlsx') {
    fileName += '.xlsx';
  }

  var json = spread.toJSON();

  // here is excel IO API

  excelIO.save(json, function(blob) {
    callback(blobToFile(blob,fileName))
  }, function(e) {
    callback(null)
  },{});
}

function exportDocx(json,fileName,callback) {

  if (fileName.length<6 || fileName.substr(-5, 5) !== '.json') {
    fileName += '.json';
  }



  callback(convertStringToFile(JSON.stringify(json),fileName))

}


function convertStringToFile(data,fileName){
  var blob = new Blob([data],{type:"application/json"});

  return blobToFile(blob,fileName);
}

function blobToFile(theBlob, fileName){
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

export default {
  importFile,
  exportExcel,
  exportDocx
}
