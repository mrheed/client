import { Order } from './EnhancedHeader'
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver'

export function getSorting<K extends keyof any>(
    order: Order,
    orderBy: K,
  ): (a: { [key in K]: number | string }, b: { [key in K]: number | string }) => number {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

export function desc<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function stableSort<T>(array: T[], cmp: (a: T, b: T) => number) {  
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => { 
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

export function isSelected(name: string, selected: any) {return selected.indexOf(name) !== -1};

export function handleCheckClick(event: React.MouseEvent<unknown>, name: string, selected: any, setSelected: Function) {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  }

  function handleUploadContent(event: React.ChangeEvent<HTMLInputElement>, onInsert: Function) {
    var targetFile = event.target.files![0]
    var fileReader = new FileReader()
    fileReader.readAsArrayBuffer(targetFile)
    fileReader.onload = function(e: ProgressEvent) {
      var arrayBuffer: Uint8Array = new Uint8Array(fileReader.result! as ArrayBuffer)
      var workBook = XLSX.read(arrayBuffer, {type: 'array'})
      var files_sheet_name = workBook.SheetNames[0]
      var workSheet = workBook.Sheets[files_sheet_name]
      var json_value = XLSX.utils.sheet_to_json(workSheet)
      var changedVals = json_value.map((x: any) => {
        // Define empty object
        var obj: any = {}
        // Manipulate the object keys
        Object.keys(x).map((z: string) => {
          Object.assign(obj, {[z.split(" ").join("") as string] : x[z]})
        })
        // return the manipulated object
        return obj 
      })
      onInsert(changedVals)
    }
    
    event.target.value = ""
    
  }

  function handleGetDefaultDocument(tableTitle: string, rowKey?: any) {
    var wb = XLSX.utils.book_new();
      wb.Props = {
        Title: tableTitle + " Document",
        Subject: tableTitle,
        Author: "User",
        CreatedDate: new Date(2017,12,19)
      };
      
      wb.SheetNames.push(tableTitle + " Sheet");
      var ws_data = [rowKey!];
      var ws = XLSX.utils.aoa_to_sheet(ws_data);
      wb.Sheets[tableTitle + " Sheet"] = ws;
      var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
      function s2ab(s: any) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
              
      }
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), tableTitle + '.xlsx');
  }