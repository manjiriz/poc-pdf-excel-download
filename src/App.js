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
  }

  downloadPDF() {
    var columns = [
      { title: "Name", dataKey: "name" },
      { title: "email", dataKey: "email" }
    ];
    var rows = [
      { "name": "Manjiri", "email": "manjiri.zine@accionlabs.com" },
      { "name": "Neha", "email": "neha.tiwari@accionlabs.com" }
    ];

    var doc = new jspdf('p', 'pt');
    doc.autoTable(columns, rows, {
      columnStyles: {
        id: { fillColor: 255 }
      },
      theme: 'grid',
      margin: { top: 60 },
      addPageContent: function (data) {
        doc.text("Table", 40, 30);
      }
    });
    doc.save('PDFtable.pdf');
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
