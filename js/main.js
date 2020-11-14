function createTable(tableData) {
  var table = document.createElement("table");
  table.classList.add("table", "is-striped", "is-hoverable");
  table.id = "transactions";
  var tableBody = document.createElement("tbody");

  head = tableData.shift();

  var header = document.createElement("thead");
  var headerRow = header.appendChild(document.createElement("tr"));
  head.forEach(function (cellData) {
    var cell = document.createElement("th");
    cell.appendChild(document.createTextNode(cellData));
    headerRow.appendChild(cell);
  });

  table.appendChild(header);

  tableData.forEach(function (rowData) {
    var row = document.createElement("tr");

    rowData.forEach(function (cellData) {
      var cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  return table;
}

function toMoneyInt(number) {
  if (number == "") {
    return 0;
  }
  if (number < 0) {
    return 0;
  }
  number = number.toString();
  reversed = number.split("").reverse().join("");
  if (reversed.indexOf(".") > 2) {
    number = number.slice(0, number.length - (reversed.indexOf(".") - 2));
    console.log(number);
  }
  return parseInt(number.replace(/\./g, ""));
}

var POSSIBLES = ["amount", "debit"];

function generateRoundUps(table) {
  var columnNum = table[0].length + 1;
  var column = -1;
  table[0].forEach((item, index) => {
    if (POSSIBLES.includes(item.toLowerCase())) {
      column = index;
    }
  });
  if (column != -1) {
    table[0][column] = table[0][column] + "*";
    table[0][columnNum] = "Rounded up";
    for (index = 1; index <= table.length - 1; index++) {
      try {
        amount = toMoneyInt(table[index][column]);
        var rounded = Math.ceil(amount / 100) * 100;
        var diff = rounded - amount;
        table[index][columnNum] = diff.toString() + "¢";
      } catch {}
    }
  }
  return table;
}

function generateTotal(table) {
  var columnNum = table[0].length + 1;
  var column = -1;
  table[0].forEach((item, index) => {
    if (POSSIBLES.includes(item.toLowerCase())) {
      column = index;
    }
  });
  var total = 0;
  if (column != -1) {
    table[0][columnNum] = "Rounded up";
    for (index = 1; index <= table.length - 1; index++) {
      try {
        amount = toMoneyInt(table[index][column]);
        var rounded = Math.ceil(amount / 100) * 100;
        var diff = rounded - amount;
        total += diff;
      } catch {}
    }
  }
  total = total.toString();
  total =
    "$" +
    total.slice(0, total.length - 2) +
    "." +
    total.slice(total.length - 2, total.length);
  return total;
}

function fileChosen() {
  var fileInput = document.getElementById("file-input");

  var file = fileInput.files[0];
  var reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = (readerEvent) => {
    var content = readerEvent.target.result; // this is the content!
    document.getElementById("transactions").innerHTML = "";
    document
      .getElementById("transactions")
      .replaceWith(createTable(generateRoundUps(Papa.parse(content).data)));
    document.getElementById("total").innerHTML = generateTotal(
      Papa.parse(content).data
    );
    document.getElementById("totalRoundUp").classList.remove("is-hidden");
  };

  var button = document.getElementById("file-input-button");
  if (button.getElementsByClassName("file-name").length >= 1) {
    button.getElementsByClassName("file-name")[0].innerHTML = file.name;
  } else {
    var node = document.createElement("span");
    node.classList.add("file-name");
    node.innerHTML = file.name;
    button.appendChild(node);
  }
}

function toggleTables() {
  document.getElementById("tables").classList.toggle("is-hidden");
}
