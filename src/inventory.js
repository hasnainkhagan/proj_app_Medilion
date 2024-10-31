// let editingColumnIndex;

// function addRow() {
//   const table = document.getElementById("inventoryTable");
//   const row = table.insertRow();
//   for (let i = 0; i < table.rows[0].cells.length - 1; i++) {
//     const cell = row.insertCell();
//     cell.innerHTML = `<input type="text" />`;
//   }
//   const actionsCell = row.insertCell();
//   actionsCell.innerHTML = `
//                 <button onclick="previewRow(this)">Preview</button>
//                 <button onclick="editRow(this)">Edit</button>
//                 <button onclick="deleteRow(this)">Delete</button>`;
// }

// function addColumn() {
//   const table = document.getElementById("inventoryTable");
//   const headerRow = document.getElementById("headerRow");
//   const newHeader = document.createElement("th");
//   const columnIndex = headerRow.cells.length - 1;
//   newHeader.innerHTML = `New Column <button onclick="editColumnName(${columnIndex})">Edit</button> <button onclick="deleteColumn(${columnIndex})">Delete</button>`;
//   headerRow.insertBefore(newHeader, headerRow.lastElementChild);

//   for (let i = 1; i < table.rows.length; i++) {
//     const newCell = table.rows[i].insertCell(columnIndex);
//     newCell.innerHTML = `<input type="text" />`;
//   }
// }

// function deleteRow(button) {
//   const row = button.parentElement.parentElement;
//   row.remove();
// }

// function deleteColumn(index) {
//   const table = document.getElementById("inventoryTable");
//   for (let i = 0; i < table.rows.length; i++) {
//     table.rows[i].deleteCell(index);
//   }
// }

// function editRow(button) {
//   const row = button.parentElement.parentElement;
//   const inputs = row.querySelectorAll("input");
//   inputs.forEach((input) => (input.disabled = !input.disabled));
// }

// function previewRow(button) {
//   const row = button.parentElement.parentElement;
//   const values = [...row.querySelectorAll("input")]
//     .map((input) => input.value)
//     .join(", ");
//   document.getElementById("popupContent").innerText = values;
//   document.getElementById("previewPopup").style.display = "block";
// }

// function editColumnName(index) {
//   editingColumnIndex = index;
//   document.getElementById("columnNameInput").value = document
//     .getElementById("headerRow")
//     .cells[index].innerText.trim();
//   document.getElementById("editPopup").style.display = "block";
// }

// function saveColumnName() {
//   const newName = document.getElementById("columnNameInput").value;
//   const headerCell =
//     document.getElementById("headerRow").cells[editingColumnIndex];
//   headerCell.innerHTML = `${newName} <button onclick="editColumnName(${editingColumnIndex})">Edit</button> <button onclick="deleteColumn(${editingColumnIndex})">Delete</button>`;
//   closePopup("editPopup");
// }

// function closePopup(popupId) {
//   document.getElementById(popupId).style.display = "none";
// }

// function searchTable() {
//   const searchInput = document
//     .getElementById("searchInput")
//     .value.toLowerCase();
//   const table = document.getElementById("inventoryTable");
//   const rows = table.getElementsByTagName("tr");

//   for (let i = 1; i < rows.length; i++) {
//     const cells = rows[i].getElementsByTagName("td");
//     let rowMatches = false;

//     for (let j = 0; j < cells.length - 1; j++) {
//       const cellText = cells[j]
//         .getElementsByTagName("input")[0]
//         .value.toLowerCase();
//       if (cellText.includes(searchInput)) {
//         rowMatches = true;
//         break;
//       }
//     }

//     rows[i].style.display = rowMatches ? "" : "none";
//   }
// }

var Datastore = require('nedb')

var inventory = db.inventory = new Datastore({ filename: 'db/inventory.db', autoload: true });

async function addProduct(data) {
  const newProduct = data;

  await inventory.findOne({productName: newProduct.productName}, async (err, product) => {
    if (err) {
      await inventory.insert({ ...newProduct });
    } else {
      console.error("This product is already exists!, try adding a different one.")
    }
  })

}

async function findProducts(page, limit = 2) {

  await inventory.find({}).sort({ createdAt: -1 }).limit(limit).skip(limit * (page - 1)).exec((err, products) => {

    if (err) {
      console.error('Find error:', err);
    } else {
      inventory.count({}, (err, totalCount) => {
        if (err) {
          console.error('Find error:', err);
        } else {

          return {
            products,
            totalPages: Math.ceil(totalCount / limit)
          }
        }
      })
    }
  })

}

async function searchProducts(query) {
//  will make it later
}

addProduct({
  ProductName: "item1",
  Category: "clothes",
  Brand: "zara",
  PackSize: "XL",
  LotBatchNo: 12,
  ExpiryDate: '1-12-24',
  createdAt: new Date(Date.now()).toISOString()
});
// findProducts(3);