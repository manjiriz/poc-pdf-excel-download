import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import xlsx from 'xlsx';
import fileSaver from 'file-saver';

class App extends Component {
  constructor() {
    super();
    this.downloadPDF = this.downloadPDF.bind(this);
    this.downloadExcel = this.downloadExcel.bind(this);
    this.formatData = this.formatData.bind(this);
    this.inputJson = [
      {
        "customerNumber": "1101877698",
        "premiseId": "9050160631",
        "connectionContractNumber": "210018985725",
        "meters": [
          {
            "meterId": "54399779",
            "meterConsumption": [
              {
                "readingDatetime": "2018-05-15 00:00:00",
                "consumption": 0.01,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 23:00:00",
                "consumption": 0.13,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 22:00:00",
                "consumption": 32.54,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 21:00:00",
                "consumption": 14.33,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 20:00:00",
                "consumption": 3.36,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 19:00:00",
                "consumption": 22.74,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 18:00:00",
                "consumption": 14.57,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 17:00:00",
                "consumption": 14.38,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 16:00:00",
                "consumption": 10.02,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 15:00:00",
                "consumption": 0,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 14:00:00",
                "consumption": 0.04,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 13:00:00",
                "consumption": 0.01,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 12:00:00",
                "consumption": 0.02,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 11:00:00",
                "consumption": 0.01,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 10:00:00",
                "consumption": 0.02,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 09:00:00",
                "consumption": 4.1,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 08:00:00",
                "consumption": 14.59,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 07:00:00",
                "consumption": 45.24,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 06:00:00",
                "consumption": 14.06,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 05:00:00",
                "consumption": 0.02,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 04:00:00",
                "consumption": 0.01,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 03:00:00",
                "consumption": 0.02,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 02:00:00",
                "consumption": 405.96,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 01:00:00",
                "consumption": 104.58,
                "unitOfMeasure": "Gals."
              },
              {
                "readingDatetime": "2018-05-14 00:00:00",
                "consumption": 0,
                "unitOfMeasure": "Gals."
              }
            ]
          }
        ]
      }
    ];
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime.replace(/\s/g, '');
  }

  formatData(inputJson) {
    var columns_TableSet = [
      { title: "Time", dataKey: "time" }
    ];

    var arr_formattedTime = [];

    inputJson[0].meters[0].meterConsumption.forEach(element => {
      var formattedTime = this.formatAMPM(new Date(element.readingDatetime));
      arr_formattedTime.push({ "title": formattedTime, "dataKey": formattedTime });
    });
    arr_formattedTime.reverse();

    //console.log('-------', arr_formattedTime)

    for (let i = 0; i < arr_formattedTime.length - 1; i++) {
      columns_TableSet.push(arr_formattedTime[i]);
    }

    //console.log("--------columns_TableSet before-----", columns_TableSet)
    columns_TableSet.shift();
    //console.log("--------columns_TableSet-----", columns_TableSet)
    //console.log("--------columns_TableSet-----", columns_TableSet.length)
    var reverseData = inputJson[0].meters[0].meterConsumption.reverse();
    reverseData.pop();
    //console.log("--------reverseData-----", reverseData.length)
    //var colObj = [{ title: "Time", dataKey: "time" }];

    /* for (let i =0, j = 1; j < 10; j++, i++) {
      colObj.push(columns_TableSet[j]);
      hardCodedRow[columns_TableSet[j].dataKey]= reverseData[i].consumption;
      count++;
    }
 */
    //var colData = columns_TableSet, rowData = reverseData;
    var doc = new jspdf('p', 'pt');
    doc.text("Usage Overview Data", 40, 30);
    doc.text(70, 50, "24 hours");

    //var stY = doc.autoTableEndPosY();
    /* var options = {
      margin: {
        top: 100
      },
      startY : 200,
      columnStyles: {
        id: { fillColor: 255 },
      },
      styles: {
        overflow: 'linebreak',
        fontSize: 10,
        tableWidth: 280,
        columnWidth: 'auto',
        valign: 'middle',
        rowHeight: 10
      },
      theme: 'grid' //striped
    }; */

    var temp={};
    var mainArray =[];
    while (columns_TableSet.length && reverseData.length) {
      // var counter = 0;
      var colObj = [{ title: "Time", dataKey: "time" }];
      var hardCodedRow = { "time": "Usage in Gallons" };
      var rows_TableSet = [];
      var cd = columns_TableSet.splice(0, 8);
      console.log('--------columns_TableSet----', cd.length)
      var rd = reverseData.splice(0, 8);

      for (let i = 0; i < cd.length; i++) {
        colObj.push(cd[i]);
        hardCodedRow[cd[i].dataKey] = rd[i].consumption;
      }
      rows_TableSet.push(hardCodedRow);
      //counter++;
      console.log('-------colObj------', colObj)
      console.log('-------rows_TableSet------', doc.autoTableEndPosY() + 50)
      //options.styles.startY =  doc.autoTableEndPosY() + 50;
      /* temp = {};
      temp.colObj=colObj;
      temp.rows_TableSet=rows_TableSet;
      mainArray.push(temp);
 */
      doc.autoTable(colObj, rows_TableSet, {
        margin: {
          top: 100
        },
        startY: doc.autoTableEndPosY() + 60
      });
      
    }
    // doc.autoTable(mainArray[0].colObj, mainArray[0].rows_TableSet, {
    //   startY: 200
    // });
/*     console.log('-------mainArray------', mainArray)
    for(var i =0 ; i<mainArray.length ; i++){
      doc.autoTable(mainArray[i].colObj, mainArray[i].rows_TableSet, {
        startY: doc.autoTableEndPosY() + 50
      });
    } */
    
   
    doc.save('PDFtable.pdf');

  }
  downloadPDF() {
    /* var columns = [
      { title: "Name", dataKey: "name" },
      { title: "email", dataKey: "email" }
    ];
    var rows = [
      { "name": "Manjiri", "email": "manjiri.zine@accionlabs.com" },
      { "name": "Neha", "email": "neha.tiwari@accionlabs.com" }
    ]; */

    

    this.formatData(this.inputJson);

    /* var doc = new jspdf('p', 'pt');
    doc.autoTable(columns, rows, {
      columnStyles: {
        id: { fillColor: 255 }
      },
      theme: 'grid', //striped
      margin: { top: 60 },
      addPageContent: function (data) {
        doc.text("Usage Overview Data", 40, 30);
        doc.text(70, 50, "24 hours");
      }
    });
    doc.save('PDFtable.pdf'); */
  }

  downloadExcel() {
    var workbook = xlsx.utils.book_new();

    var ws_name = "SheetJS";

    /* make worksheet */
    var ws_data = [
      ["Name", "Email"],
      ["Manjiri", "manjiri.zine@accionlabs.com"],
      ["Neha", "neha.tiwari@accionlabs.com"]
    ];
    var ws_json_data = [
      {
        "Name": "Manjiri",
        "Email": "manjiri.zine@accionlabs.com"
      },
      {
        "Name": "Neha",
        "Email": "neha.tiwari@accionlabs.com"
      }
    ]
    //var ws = xlsx.utils.aoa_to_sheet(ws_data);
    var ws = xlsx.utils.json_to_sheet(ws_json_data);

    /* Add the worksheet to the workbook */
    xlsx.utils.book_append_sheet(workbook, ws, ws_name);
    /* bookType can be any supported output type */
    var wopts = { bookType: 'xlsx', bookSST: false, type: 'array' };

    var wbout = xlsx.write(workbook, wopts);

    /* the saveAs call downloads a file on the local machine */
    fileSaver.saveAs(new Blob([wbout], { type: "application/octet-stream" }), "excelTable.xlsx");

  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.downloadPDF}>Download PDF</button>
        <button onClick={this.downloadExcel}>Download Excel</button>
      </div>
    );
  }
}

export default App;
