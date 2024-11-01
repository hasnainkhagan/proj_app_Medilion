let inventory = [];
let currentPage = 1;
const rowsPerPage = 5;

function openAddPopup() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("addPopup").style.display = "block";
}

function closePopup(popupId) {
  document.getElementById("overlay").style.display = "none";
  document.getElementById(popupId).style.display = "none";
  document.getElementById("addForm").reset();
  document.getElementById("editForm").reset();
}

function addItem() {
  const newItem = {
    inwardNum: document.getElementById("inwardNum").value,
    inwardDate: document.getElementById("inwardDate").value,
    invoiceNo: document.getElementById("invoiceNo").value,
    supplierName: document.getElementById("supplierName").value,
    productDesc: document.getElementById("productDesc").value,
    origin: document.getElementById("origin").value,
    category: document.getElementById("category").value,
    brand: document.getElementById("brand").value,
    volume: document.getElementById("volume").value,
    type: document.getElementById("type").value,
    lotNo: document.getElementById("lotNo").value,
    expiry: document.getElementById("expiry").value,
    cgsCode: document.getElementById("cgsCode").value,
    qtyReceived: document.getElementById("qtyReceived").value,
    sign: document.getElementById("sign").value,
  };
  inventory.push(newItem);
  closePopup("addPopup");
  renderTable();
}

function renderTable() {
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = inventory.slice(start, end);
  const inventoryBody = document.getElementById("inventoryBody");
  inventoryBody.innerHTML = "";

  paginatedItems.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td><input type="checkbox" class="item-checkbox" /></td>
                    <td>${item.inwardNum}</td>
                    <td>${item.inwardDate}</td>
                    <td>${item.invoiceNo}</td>
                    <td>${item.supplierName}</td>
                    <td>${item.productDesc}</td>
                    <td>${item.origin}</td>
                    <td>${item.category}</td>
                    <td>${item.brand}</td>
                    <td>${item.volume}</td>
                    <td>${item.type}</td>
                    <td>${item.lotNo}</td>
                    <td>${item.expiry}</td>
                    <td>${item.cgsCode}</td>
                    <td>${item.qtyReceived}</td>
                    <td>${item.sign}</td>
                    <td><button onclick="openEditPopup(${
                      start + index
                    })">Edit</button></td>
                `;
    inventoryBody.appendChild(row);
  });
  renderPagination();
}

function openEditPopup(index) {
  const item = inventory[index];
  document.getElementById("editIndex").value = index;
  document.getElementById("editInwardNum").value = item.inwardNum;
  document.getElementById("editInwardDate").value = item.inwardDate;
  document.getElementById("editInvoiceNo").value = item.invoiceNo;
  document.getElementById("editSupplierName").value = item.supplierName;
  document.getElementById("editProductDesc").value = item.productDesc;
  document.getElementById("editOrigin").value = item.origin;
  document.getElementById("editCategory").value = item.category;
  document.getElementById("editBrand").value = item.brand;
  document.getElementById("editVolume").value = item.volume;
  document.getElementById("editType").value = item.type;
  document.getElementById("editLotNo").value = item.lotNo;
  document.getElementById("editExpiry").value = item.expiry;
  document.getElementById("editCgsCode").value = item.cgsCode;
  document.getElementById("editQtyReceived").value = item.qtyReceived;
  document.getElementById("editSign").value = item.sign;

  document.getElementById("overlay").style.display = "block";
  document.getElementById("editPopup").style.display = "block";
}

function saveEdit() {
  const index = document.getElementById("editIndex").value;
  inventory[index] = {
    inwardNum: document.getElementById("editInwardNum").value,
    inwardDate: document.getElementById("editInwardDate").value,
    invoiceNo: document.getElementById("editInvoiceNo").value,
    supplierName: document.getElementById("editSupplierName").value,
    productDesc: document.getElementById("editProductDesc").value,
    origin: document.getElementById("editOrigin").value,
    category: document.getElementById("editCategory").value,
    brand: document.getElementById("editBrand").value,
    volume: document.getElementById("editVolume").value,
    type: document.getElementById("editType").value,
    lotNo: document.getElementById("editLotNo").value,
    expiry: document.getElementById("editExpiry").value,
    cgsCode: document.getElementById("editCgsCode").value,
    qtyReceived: document.getElementById("editQtyReceived").value,
    sign: document.getElementById("editSign").value,
  };
  closePopup("editPopup");
  renderTable();
}

function deleteSelected() {
  const checkboxes = document.querySelectorAll(".item-checkbox");
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      inventory.splice((currentPage - 1) * rowsPerPage + index, 1);
    }
  });
  renderTable();
}

function searchTable() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filteredItems = inventory.filter((item) => {
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(query)
    );
  });
  const inventoryBody = document.getElementById("inventoryBody");
  inventoryBody.innerHTML = "";

  filteredItems.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td><input type="checkbox" class="item-checkbox" /></td>
                    <td>${item.inwardNum}</td>
                    <td>${item.inwardDate}</td>
                    <td>${item.invoiceNo}</td>
                    <td>${item.supplierName}</td>
                    <td>${item.productDesc}</td>
                    <td>${item.origin}</td>
                    <td>${item.category}</td>
                    <td>${item.brand}</td>
                    <td>${item.volume}</td>
                    <td>${item.type}</td>
                    <td>${item.lotNo}</td>
                    <td>${item.expiry}</td>
                    <td>${item.cgsCode}</td>
                    <td>${item.qtyReceived}</td>
                    <td>${item.sign}</td>
                    <td><button onclick="openEditPopup(${index})">Edit</button></td>
                `;
    inventoryBody.appendChild(row);
  });
}

function renderPagination() {
  const totalPages = Math.ceil(inventory.length / rowsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.onclick = function () {
      currentPage = i;
      renderTable();
    };
    pagination.appendChild(pageButton);
  }
}

// DB SETUP

// var Datastore = require("nedb");

// var inventory = (db.inventory = new Datastore({
//   filename: "db/inventory.db",
//   autoload: true,
// }));

// async function addProduct(data) {
//   const newProduct = data;

//   await inventory.findOne(
//     { productName: newProduct.productName },
//     async (err, product) => {
//       if (err) {
//         await inventory.insert({ ...newProduct });
//       } else {
//         console.error(
//           "This product is already exists!, try adding a different one."
//         );
//       }
//     }
//   );
// }

// async function findProducts(page, limit = 2) {
//   await inventory
//     .find({})
//     .sort({ createdAt: -1 })
//     .limit(limit)
//     .skip(limit * (page - 1))
//     .exec((err, products) => {
//       if (err) {
//         console.error("Find error:", err);
//       } else {
//         inventory.count({}, (err, totalCount) => {
//           if (err) {
//             console.error("Find error:", err);
//           } else {
//             return {
//               products,
//               totalPages: Math.ceil(totalCount / limit),
//             };
//           }
//         });
//       }
//     });
// }

// async function searchProducts(query) {
//   //  will make it later
// }

// addProduct({
//   ProductName: "item1",
//   Category: "clothes",
//   Brand: "zara",
//   PackSize: "XL",
//   LotBatchNo: 12,
//   ExpiryDate: "1-12-24",
//   createdAt: new Date(Date.now()).toISOString(),
// });
// // findProducts(3);
