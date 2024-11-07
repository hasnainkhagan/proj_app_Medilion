const Datastore = require('nedb');

var inventoryDB = new Datastore({
  filename: "db/inventory.db",
  autoload: true,
});

class Product {
  constructor({
    inwardNumber,
    inwardDate,
    invoiceNumber,
    supplierName,
    ProductName,
    productDescription,
    origin,
    category,
    brand,
    volume,
    type,
    lotNumber,
    expiry,
    cgsCode,
    qtyReceived,
    sign,
    createdAt = new Date().toISOString()
  }) {
    this.inwardNumber = 'INV-' + inwardNumber;           // Inward #
    this.inwardDate = inwardDate;               // Inward Date
    this.invoiceNumber = 'INV-' + invoiceNumber;         // Invoice No
    this.supplierName = supplierName;           // Supplier Name
    this.ProductName = ProductName;             // Product Name
    this.productDescription = productDescription; // Product Description
    this.origin = origin;                       // Origin
    this.category = category;                   // Category
    this.brand = brand;                         // Brand
    this.volume = volume;                       // Volume
    this.type = type;                           // Type
    this.lotNumber = 'LOT-' + lotNumber;                 // Lot No
    this.expiry = expiry;                       // Expiry
    this.cgsCode = 'CGS-' + cgsCode;                     // CGS_CODE
    this.qtyReceived = qtyReceived;             // Qty Received
    this.sign = sign;                           // Sign
    this.createdAt = createdAt;                 // Created At
  }
}

function addProduct(data) {
  const newProduct = new Product(data);

  inventoryDB.findOne({ ProductName: newProduct.ProductName }, (err, product) => {
    if (err) {
      console.error(err);
      return;
    }

    if (product) {
      console.error("This product already exists! Try adding a different one.");
    } else {
      inventoryDB.insert({ ...newProduct }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Product Added Successfully!');
      });
    }
  });
}

function getProducts(page, limit = 25, callback) {
  inventoryDB.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1))
    .exec((err, products) => {
      if (err) {
        console.error("Find error:", err);
        callback(err, null);
        return;
      }

      inventoryDB.count({}, (err, totalCount) => {
        if (err) {
          console.error("Count error:", err);
          callback(err, null);
          return;
        }

        callback(null, {
          products,
          totalPages: Math.ceil(totalCount / limit),
        });
      });
    });
}


function searchProducts(query, callback) {
  inventoryDB.find({ ProductName: new RegExp(query, 'i') }, (err, products) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, products);
    }
  });
}

function deleteProduct(id) {
  inventoryDB.remove({ _id: id }, { multi: false }, (err, deletedProduct) => {
    if (err) {
      console.error(err);
      return;
    }
    if (deletedProduct === 0) {
      console.log('This product is already deleted or does not exist in the database.');
    } else {
      console.log(`Product with ID ${id} deleted successfully!`);
    }
  });
}

function editProduct(id, updatedProduct) {
  inventoryDB.update(
    { _id: id },
    { $set: updatedProduct },
    { multi: false },
    (err, numAffected) => {
      if (err) {
        console.error('Error updating product:', err);
        return;
      }
      if (numAffected === 0) {
        console.log('No product found to update.');
      } else {
        console.log('Product updated successfully!');
      }
    }
  );
}


var inventoryData = {};
let currentPage = 1;
const rowsPerPage = 5;


window.onload = async () => {
  await getProducts(currentPage, 25, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    inventoryData = data;
    renderTable();
  })
}

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

async function addItem() {
  const newItem = {
    inwardNumber: document.getElementById("inwardNum").value,
    inwardDate: document.getElementById("inwardDate").value,
    invoiceNumber: document.getElementById("invoiceNo").value,
    supplierName: document.getElementById("supplierName").value,
    ProductName: document.getElementById("productName").value,
    productDescription: document.getElementById("productDesc").value,
    origin: document.getElementById("origin").value,
    category: document.getElementById("category").value,
    brand: document.getElementById("brand").value,
    volume: document.getElementById("volume").value,
    type: document.getElementById("type").value,
    lotNumber: document.getElementById("lotNo").value,
    expiry: document.getElementById("expiry").value,
    cgsCode: document.getElementById("cgsCode").value,
    qtyReceived: document.getElementById("qtyReceived").value,
    sign: document.getElementById("sign").value,
  };

  console.log(newItem.category)
  await addProduct(newItem);
  await getProducts(currentPage, 25, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    inventoryData = data;
    renderTable();
  })
  closePopup("addPopup");
}

function renderTable() {
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = inventoryData?.products?.slice(start, end);
  const inventoryBody = document.getElementById("inventoryBody");
  inventoryBody.innerHTML = "";

  paginatedItems.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>${item.inwardNumber}</td>
                    <td>${item.inwardDate}</td>
                    <td>${item.invoiceNumber}</td>
                    <td>${item.supplierName}</td>
                    <td>${item.ProductName}</td>
                    <td>${item.productDescription}</td>
                    <td>${item.origin}</td>
                    <td>${item.category}</td>
                    <td>${item.brand}</td>
                    <td>${item.volume}</td>
                    <td>${item.type}</td>
                    <td>${item.lotNumber}</td>
                    <td>${item.expiry}</td>
                    <td>${item.cgsCode}</td>
                    <td>${item.qtyReceived}</td>
                    <td>${item.sign}</td>
                    <td>${item.createdAt?.slice(0, 10)}</td>
                    <td><button onclick="openEditPopup(${start + index
      })">Edit</button></td>
                `;
    inventoryBody.appendChild(row);
  });
  renderPagination();
}

function openEditPopup(index) {
  const item = inventoryData?.products[index];
  document.getElementById("editIndex").value = item._id;
  document.getElementById("editInwardNum").value = item.inwardNumber;
  document.getElementById("editInwardDate").value = item.inwardDate;
  document.getElementById("editInvoiceNo").value = item.invoiceNumber;
  document.getElementById("editSupplierName").value = item.supplierName;
  document.getElementById("editProductName").value = item.ProductName;
  document.getElementById("editProductDesc").value = item.productDescription;
  document.getElementById("editOrigin").value = item.origin;
  document.getElementById("editCategory").value = item.category;
  document.getElementById("editBrand").value = item.brand;
  document.getElementById("editVolume").value = item.volume;
  document.getElementById("editType").value = item.type;
  document.getElementById("editLotNo").value = item.lotNumber;
  document.getElementById("editExpiry").value = item.expiry;
  document.getElementById("editCgsCode").value = item.cgsCode;
  document.getElementById("editQtyReceived").value = item.qtyReceived;
  document.getElementById("editSign").value = item.sign;

  document.getElementById("overlay").style.display = "block";
  document.getElementById("editPopup").style.display = "block";
}

async function saveEdit() {

  const id = document.getElementById("editIndex").value

  await editProduct(id, {
    inwardNumber: document.getElementById("editInwardNum").value,
    inwardDate: document.getElementById("editInwardDate").value,
    invoiceNumber: document.getElementById("editInvoiceNo").value,
    supplierName: document.getElementById("editSupplierName").value,
    ProductName: document.getElementById("editProductName").value,
    productDescription: document.getElementById("editProductDesc").value,
    origin: document.getElementById("editOrigin").value,
    category: document.getElementById("editCategory").value,
    brand: document.getElementById("editBrand").value,
    volume: document.getElementById("editVolume").value,
    type: document.getElementById("editType").value,
    lotNumber: document.getElementById("editLotNo").value,
    expiry: document.getElementById("editExpiry").value,
    cgsCode: document.getElementById("editCgsCode").value,
    qtyReceived: document.getElementById("editQtyReceived").value,
    sign: document.getElementById("editSign").value,
  })

  await getProducts(currentPage, 25, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    inventoryData = data;
    renderTable();
  })

  closePopup("editPopup");
}

async function searchTable() {
  const query = document.getElementById("searchInput").value.toLowerCase();

  await searchProducts(query, (err, products) => {
    if (err) {
      console.error(err)
    }

    products?.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                      <td>${item.inwardNumber}</td>
                      <td>${item.inwardDate}</td>
                      <td>${item.invoiceNumber}</td>
                      <td>${item.supplierName}</td>
                      <td>${item.ProductName}</td>
                      <td>${item.productDescription}</td>
                      <td>${item.origin}</td>
                      <td>${item.category}</td>
                      <td>${item.brand}</td>
                      <td>${item.volume}</td>
                      <td>${item.type}</td>
                      <td>${item.lotNumber}</td>
                      <td>${item.expiry}</td>
                      <td>${item.cgsCode}</td>
                      <td>${item.qtyReceived}</td>
                      <td>${item.sign}</td>
                      <td>${item.createdAt?.slice(0, 10)}</td>
                      <td><button onclick="openEditPopup(${index})">Edit</button></td>
                  `;
      inventoryBody.appendChild(row);
    });

  });

  const inventoryBody = document.getElementById("inventoryBody");
  inventoryBody.innerHTML = "";
}

function renderPagination() {
  const totalPages = Math.ceil(inventoryDB?.products?.length / rowsPerPage);
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