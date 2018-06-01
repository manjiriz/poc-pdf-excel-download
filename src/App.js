import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import xlsx from 'xlsx';
import fileSaver from 'file-saver';
import input24HoursJson from './input24Json';
import input30DaysJson from './input30DaysJson';
import _ from 'lodash';

class App extends Component {
  constructor() {
    super();
    this.downloadPDF = this.downloadPDF.bind(this);
    this.downloadExcel = this.downloadExcel.bind(this);
    this.doc = new jspdf('p', 'pt');
    this.columns_TableSet = [
      { title: "Time", dataKey: "time" }
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

  format30DaysData() {
    var columns_30TableSet = this.columns_TableSet;
    var arr_30formattedTime = [];
    var inputjson30 = _.cloneDeep(input30DaysJson);

    var input30Json = inputjson30[0].meters[0].meterConsumption;
    input30Json.map(element => {
      var formatted30DaysTime = element.readingDatetime.split(" ");//new Date(element.readingDatetime).getDate();
      arr_30formattedTime.push({ "title": formatted30DaysTime[0], "dataKey": formatted30DaysTime[0] });
    });
    arr_30formattedTime.reverse();

    for (let i = 0; i < arr_30formattedTime.length; i++) {
      columns_30TableSet.push(arr_30formattedTime[i]);
    }

    var reverse30Data = inputjson30[0].meters[0].meterConsumption.reverse();


    this.doc.addPage();
    this.doc.text(70, 50, "30 Days");
    //this.doc.lineHeightProportion = 2;

    while (columns_30TableSet.length && reverse30Data.length) {
      var colObj = [{ title: "Time", dataKey: "time" }];
      var hardCodedRow = { "time": "Usage in Gallons" };
      var rows_TableSet = [];
      var cd = columns_30TableSet.splice(0, 5);
      var rd = reverse30Data.splice(0, 5);

      for (let i = 0; i < cd.length; i++) {
        colObj.push(cd[i]);
        hardCodedRow[cd[i].dataKey] = rd[i].consumption;
      }
      rows_TableSet.push(hardCodedRow);

      this.doc.autoTable(colObj, rows_TableSet, {
        margin: {
          top: 30
        },
        startY: this.doc.autoTableEndPosY() + 20
      });

    }

  }

  formatData() {
    var columns_24TableSet = this.columns_TableSet;

    var arr_formattedTime = [];

    var inputJson = _.cloneDeep(input24HoursJson);
    inputJson[0].meters[0].meterConsumption.forEach(element => {
      var formattedTime = this.formatAMPM(new Date(element.readingDatetime));
      arr_formattedTime.push({ "title": formattedTime, "dataKey": formattedTime });
    });
    arr_formattedTime.reverse();


    for (let i = 0; i < arr_formattedTime.length - 1; i++) {
      columns_24TableSet.push(arr_formattedTime[i]);
    }

    columns_24TableSet.shift();

    var reverseData = inputJson[0].meters[0].meterConsumption.reverse();
    reverseData.pop();


    this.doc.text("Usage Overview Data", 40, 30);
    this.doc.text(70, 50, "24 hours");

    while (columns_24TableSet.length && reverseData.length) {
      var colObj = [{ title: "Time", dataKey: "time" }];
      var hardCodedRow = { "time": "Usage in Gallons" };
      var rows_TableSet = [];
      var cd = columns_24TableSet.splice(0, 8);
      var rd = reverseData.splice(0, 8);

      for (let i = 0; i < cd.length; i++) {
        colObj.push(cd[i]);
        hardCodedRow[cd[i].dataKey] = rd[i].consumption;
      }
      rows_TableSet.push(hardCodedRow);

      this.doc.autoTable(colObj, rows_TableSet, {
        margin: {
          top: 100
        },
        startY: this.doc.autoTableEndPosY() + 60
      });
    }

    this.format30DaysData();
    this.doc.save('UsageOverviewData.pdf');

  }
  downloadPDF() {
    
    this.formatData();

  }

  downloadExcel() {
    var workbook = xlsx.utils.book_new();

    var ws_24name = "24 Hours";
    var ws_30name = "30 Days";

    var jsonForXlsx = [{ "Time": "Usage in Gallons" }];
    
    var json24 = _.cloneDeep(input24HoursJson);
    var xlsxJson = json24[0].meters[0].meterConsumption.reverse();
    
    xlsxJson.pop();

    var ws_24_data_one = [["Time"]];
    var ws_24data_two = [["Usage in Gallons"]];

    xlsxJson.map(item => {
      item.formattedDate = this.formatAMPM(new Date(item.readingDatetime));
      //jsonForXlsx.push({[item.formattedDate]: item.consumption});
      ws_24_data_one[0].push([item.formattedDate]);
      ws_24data_two[0].push([item.consumption]);
    });

    var ws_24data = ws_24_data_one.concat(ws_24data_two);

    var ws = xlsx.utils.aoa_to_sheet(ws_24data, { header: "A" });
    //var ws = xlsx.utils.json_to_sheet(jsonForXlsx);



    var ws_30data_one = [["Time"]];
    var ws_30data_two = [["Usage in Gallons"]];

    var json30 = _.cloneDeep(input30DaysJson);

    var xlsx30DaysJson = json30[0].meters[0].meterConsumption.reverse();

    xlsx30DaysJson.map(item => {
      item.formattedDate = item.readingDatetime.split(" ");;
      ws_30data_one[0].push([item.formattedDate[0]]);
      ws_30data_two[0].push([item.consumption]);
    });

    var ws_30data = ws_30data_one.concat(ws_30data_two);

    var ws30 = xlsx.utils.aoa_to_sheet(ws_30data);


    /* Add the worksheet to the workbook */
    xlsx.utils.book_append_sheet(workbook, ws, ws_24name);

    xlsx.utils.book_append_sheet(workbook, ws30, ws_30name);

    /* bookType can be any supported output type */
    var wopts = { bookType: 'xlsx', bookSST: false, type: 'array' };

    var wbout = xlsx.write(workbook, wopts);

    /* the saveAs call downloads a file on the local machine */
    fileSaver.saveAs(new Blob([wbout], { type: "application/octet-stream" }), "UsageOverviewData.xlsx");

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
