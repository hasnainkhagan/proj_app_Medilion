let editingColumnIndex;

function addRow() {
  const table = document.getElementById("inventoryTable");
  const row = table.insertRow();
  for (let i = 0; i < table.rows[0].cells.length - 1; i++) {
    const cell = row.insertCell();
    cell.innerHTML = `<input type="text" />`;
  }
  const actionsCell = row.insertCell();
  actionsCell.innerHTML = `
                <button onclick="previewRow(this)">Preview</button>
                <button onclick="editRow(this)">Edit</button>
                <button onclick="deleteRow(this)">Delete</button>`;
}

function addColumn() {
  const table = document.getElementById("inventoryTable");
  const headerRow = document.getElementById("headerRow");
  const newHeader = document.createElement("th");
  const columnIndex = headerRow.cells.length - 1;
  newHeader.innerHTML = `New Column <button onclick="editColumnName(${columnIndex})">Edit</button> <button onclick="deleteColumn(${columnIndex})">Delete</button>`;
  headerRow.insertBefore(newHeader, headerRow.lastElementChild);

  for (let i = 1; i < table.rows.length; i++) {
    const newCell = table.rows[i].insertCell(columnIndex);
    newCell.innerHTML = `<input type="text" />`;
  }
}

function deleteRow(button) {
  const row = button.parentElement.parentElement;
  row.remove();
}

function deleteColumn(index) {
  const table = document.getElementById("inventoryTable");
  for (let i = 0; i < table.rows.length; i++) {
    table.rows[i].deleteCell(index);
  }
}

function editRow(button) {
  const row = button.parentElement.parentElement;
  const inputs = row.querySelectorAll("input");
  inputs.forEach((input) => (input.disabled = !input.disabled));
}

function previewRow(button) {
  const row = button.parentElement.parentElement;
  const values = [...row.querySelectorAll("input")]
    .map((input) => input.value)
    .join(", ");
  document.getElementById("popupContent").innerText = values;
  document.getElementById("previewPopup").style.display = "block";
}

function editColumnName(index) {
  editingColumnIndex = index;
  document.getElementById("columnNameInput").value = document
    .getElementById("headerRow")
    .cells[index].innerText.trim();
  document.getElementById("editPopup").style.display = "block";
}

function saveColumnName() {
  const newName = document.getElementById("columnNameInput").value;
  const headerCell =
    document.getElementById("headerRow").cells[editingColumnIndex];
  headerCell.innerHTML = `${newName} <button onclick="editColumnName(${editingColumnIndex})">Edit</button> <button onclick="deleteColumn(${editingColumnIndex})">Delete</button>`;
  closePopup("editPopup");
}

function closePopup(popupId) {
  document.getElementById(popupId).style.display = "none";
}

function searchTable() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const table = document.getElementById("inventoryTable");
  const rows = table.getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    let rowMatches = false;

    for (let j = 0; j < cells.length - 1; j++) {
      const cellText = cells[j]
        .getElementsByTagName("input")[0]
        .value.toLowerCase();
      if (cellText.includes(searchInput)) {
        rowMatches = true;
        break;
      }
    }

    rows[i].style.display = rowMatches ? "" : "none";
  }
}
