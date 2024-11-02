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
    this.inwardNumber = inwardNumber;           // Inward #
    this.inwardDate = inwardDate;               // Inward Date
    this.invoiceNumber = invoiceNumber;         // Invoice No
    this.supplierName = supplierName;           // Supplier Name
    this.ProductName = ProductName;             // Product Name
    this.productDescription = productDescription; // Product Description
    this.origin = origin;                       // Origin
    this.category = category;                   // Category
    this.brand = brand;                         // Brand
    this.volume = volume;                       // Volume
    this.type = type;                           // Type
    this.lotNumber = lotNumber;                 // Lot No
    this.expiry = expiry;                       // Expiry
    this.cgsCode = cgsCode;                     // CGS_CODE
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

function findProducts(page, limit = 25) {
  inventoryDB.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1))
    .exec((err, products) => {
      if (err) {
        console.error("Find error:", err);
        return;
      }

      inventoryDB.count({}, (err, totalCount) => {
        if (err) {
          console.error("Count error:", err);
          return;
        }
        console.log({
          products,
          totalPages: Math.ceil(totalCount / limit),
        });
      });
    });
}

function searchProducts(query) {
  inventoryDB.find({ ProductName: new RegExp(query, 'i') }, (err, products) => {
    if (err) {
      console.error(err);
    } else {
      console.log(products);
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


// addProduct({
//   inwardNumber: "INV12345",
//   inwardDate: "2024-11-02",
//   invoiceNumber: "INV-67890",
//   supplierName: "ABC Supplies",
//   ProductName: 'Premium Jack',
//   productDescription: "Premium Quality Cotton Fabric",
//   origin: "India",
//   category: "Textile",
//   brand: "Zara",
//   volume: "500m",
//   type: "Fabric",
//   lotNumber: "LOT786",
//   expiry: "2025-12-01",
//   cgsCode: "CGS-00345",
//   qtyReceived: "150",
//   sign: "John Doe"
// });

// findProducts(1);
// searchProducts('item21');
// deleteProduct('c33adVq6sNXNUZuE');
// editProduct('0dL0uuhJxb81K5el', { ProductName: 'Premium Jacket' });