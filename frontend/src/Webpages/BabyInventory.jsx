import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

function BabyInventory() {
  const [activePage, setActivePage] = useState("dashboard");

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const [editingItemId, setEditingItemId] = useState(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newLocationName, setNewLocationName] = useState("");

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    location: "",
    quantity: "",
    unit: "items",
    condition: "good",
    notes: "",
    low_stock_level: 5,
  });

  const [editItem, setEditItem] = useState({
    name: "",
    category: "",
    location: "",
    quantity: "",
    unit: "",
    condition: "good",
    notes: "",
    low_stock_level: 5,
  });

  const [newTransaction, setNewTransaction] = useState({
    item: "",
    transaction_type: "distributed_out",
    quantity: "",
    notes: "",
  });

  function getItems() {
    axios
      .get("http://127.0.0.1:8000/api/items/")
      .then((response) => setItems(response.data))
      .catch((error) => console.log("Error getting items:", error));
  }

  function getCategories() {
    axios
      .get("http://127.0.0.1:8000/api/categories/")
      .then((response) => setCategories(response.data))
      .catch((error) => console.log("Error getting categories:", error));
  }

  function getLocations() {
    axios
      .get("http://127.0.0.1:8000/api/locations/")
      .then((response) => setLocations(response.data))
      .catch((error) => console.log("Error getting locations:", error));
  }

  function getTransactions() {
    axios
      .get("http://127.0.0.1:8000/api/transactions/")
      .then((response) => setTransactions(response.data))
      .catch((error) => console.log("Error getting transactions:", error));
  }

  function refreshAllData() {
    getItems();
    getCategories();
    getLocations();
    getTransactions();
  }

  useEffect(() => {
    refreshAllData();
  }, []);

  function handleItemChange(event) {
    const { name, value } = event.target;
    setNewItem({ ...newItem, [name]: value });
  }

  function handleEditChange(event) {
    const { name, value } = event.target;
    setEditItem({ ...editItem, [name]: value });
  }

  function handleTransactionChange(event) {
    const { name, value } = event.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  }

  function handleItemSubmit(event) {
    event.preventDefault();

    axios
      .post("http://127.0.0.1:8000/api/items/", newItem)
      .then(() => {
        getItems();

        setNewItem({
          name: "",
          category: "",
          location: "",
          quantity: "",
          unit: "items",
          condition: "good",
          notes: "",
          low_stock_level: 5,
        });

        setActivePage("inventory");
      })
      .catch((error) => console.log("Error adding item:", error));
  }

  function handleCategorySubmit(event) {
    event.preventDefault();

    if (newCategoryName.trim() === "") {
      alert("Please enter a category name.");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/categories/", {
        name: newCategoryName.trim(),
      })
      .then(() => {
        setNewCategoryName("");
        getCategories();
      })
      .catch((error) => console.log("Error adding category:", error));
  }

  function handleLocationSubmit(event) {
    event.preventDefault();

    if (newLocationName.trim() === "") {
      alert("Please enter a location name.");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/locations/", {
        name: newLocationName.trim(),
      })
      .then(() => {
        setNewLocationName("");
        getLocations();
      })
      .catch((error) => console.log("Error adding location:", error));
  }

  function deleteCategory(categoryId) {
    const confirmDelete = window.confirm(
      "Delete this category? This will only work if no inventory items are using it."
    );

    if (!confirmDelete) {
      return;
    }

    axios
      .delete(`http://127.0.0.1:8000/api/categories/${categoryId}/`)
      .then(() => {
        getCategories();
        getItems();
      })
      .catch((error) => {
        console.log("Error deleting category:", error);
        alert("Could not delete category because it may be used by an item.");
      });
  }

  function deleteLocation(locationId) {
    const confirmDelete = window.confirm(
      "Delete this location? This will only work if no inventory items are using it."
    );

    if (!confirmDelete) {
      return;
    }

    axios
      .delete(`http://127.0.0.1:8000/api/locations/${locationId}/`)
      .then(() => {
        getLocations();
        getItems();
      })
      .catch((error) => {
        console.log("Error deleting location:", error);
        alert("Could not delete location because it may be used by an item.");
      });
  }

  function startEditing(item) {
    setEditingItemId(item.id);

    setEditItem({
      name: item.name,
      category: item.category,
      location: item.location,
      quantity: item.quantity,
      unit: item.unit,
      condition: item.condition,
      notes: item.notes,
      low_stock_level: item.low_stock_level,
    });
  }

  function cancelEditing() {
    setEditingItemId(null);

    setEditItem({
      name: "",
      category: "",
      location: "",
      quantity: "",
      unit: "",
      condition: "good",
      notes: "",
      low_stock_level: 5,
    });
  }

  function saveEdit(itemId) {
    axios
      .put(`http://127.0.0.1:8000/api/items/${itemId}/`, editItem)
      .then(() => {
        getItems();
        cancelEditing();
      })
      .catch((error) => console.log("Error editing item:", error));
  }

  function deleteItem(itemId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) {
      return;
    }

    axios
      .delete(`http://127.0.0.1:8000/api/items/${itemId}/`)
      .then(() => {
        getItems();
        getTransactions();
      })
      .catch((error) => {
        console.log("Error deleting item:", error);
        alert("Could not delete this item.");
      });
  }

  function createTransaction(transactionData) {
    return axios.post(
      "http://127.0.0.1:8000/api/transactions/",
      transactionData
    );
  }

  function updateQuantity(item, changeAmount) {
    let transactionType = "adjustment";
    let transactionNotes = "Quick quantity update";

    if (changeAmount > 0) {
      transactionType = "donation_in";
      transactionNotes = "Quick add button";
    } else if (changeAmount < 0) {
      transactionType = "distributed_out";
      transactionNotes = "Quick remove button";
    }

    createTransaction({
      item: item.id,
      transaction_type: transactionType,
      quantity: Math.abs(changeAmount),
      notes: transactionNotes,
    })
      .then(() => {
        getItems();
        getTransactions();
      })
      .catch((error) => {
        console.log("Error updating quantity:", error);
        alert("Could not update quantity. Check if enough inventory is available.");
      });
  }

  function handleTransactionSubmit(event) {
    event.preventDefault();

    const transactionQuantity = Number(newTransaction.quantity);

    if (!newTransaction.item) {
      alert("Please select an item");
      return;
    }

    if (transactionQuantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    createTransaction({
      item: newTransaction.item,
      transaction_type: newTransaction.transaction_type,
      quantity: transactionQuantity,
      notes: newTransaction.notes,
    })
      .then(() => {
        getItems();
        getTransactions();

        setNewTransaction({
          item: "",
          transaction_type: "distributed_out",
          quantity: "",
          notes: "",
        });

        setActivePage("history");
      })
      .catch((error) => {
        console.log("Error saving transaction:", error);
        alert("Could not save transaction. Check if enough inventory is available.");
      });
  }

  function showTransactionType(type) {
    if (type === "donation_in") return "Donation In";
    if (type === "distributed_out") return "Distributed Out";
    if (type === "sold") return "Sold";
    if (type === "adjustment") return "Adjustment";
    return type;
  }

  function formatDate(dateText) {
    if (!dateText) {
      return "No date";
    }

    const date = new Date(dateText);

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function cleanCSVValue(value) {
    if (value === null || value === undefined) {
      return "";
    }

    const stringValue = String(value).replaceAll('"', '""');
    return `"${stringValue}"`;
  }

  function downloadInventoryCSV() {
    let csvContent =
      "Name,Category,Location,Quantity,Unit,Condition,Low Stock,Notes\n";

    items.forEach((item) => {
      const row = [
        item.name,
        item.category_name,
        item.location_name,
        item.quantity,
        item.unit,
        item.condition,
        item.is_low_stock ? "Yes" : "No",
        item.notes,
      ];

      csvContent += row.map(cleanCSVValue).join(",") + "\n";
    });

    const file = new Blob([csvContent], { type: "text/csv" });
    const fileURL = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = fileURL;
    link.download = "ypu_inventory_report.csv";
    link.click();
  }

  function downloadTransactionCSV() {
    let csvContent = "Date,Item,Type,Quantity,Notes\n";

    transactions.forEach((transaction) => {
      const row = [
        formatDate(transaction.created_at),
        transaction.item_name,
        showTransactionType(transaction.transaction_type),
        transaction.quantity,
        transaction.notes,
      ];

      csvContent += row.map(cleanCSVValue).join(",") + "\n";
    });

    const file = new Blob([csvContent], { type: "text/csv" });
    const fileURL = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = fileURL;
    link.download = "ypu_transaction_history.csv";
    link.click();
  }

  const totalItems = items.length;

  const totalQuantity = items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const lowStockItems = items.filter((item) => item.is_low_stock);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      categoryFilter === "" || item.category === Number(categoryFilter);

    const matchesLocation =
      locationFilter === "" || item.location === Number(locationFilter);

    const matchesLowStock = !lowStockOnly || item.is_low_stock;

    return matchesSearch && matchesCategory && matchesLocation && matchesLowStock;
  });

  const categoryReports = categories.map((category) => {
    const categoryItems = items.filter((item) => item.category === category.id);

    const categoryQuantity = categoryItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    return {
      name: category.name,
      itemCount: categoryItems.length,
      totalQuantity: categoryQuantity,
    };
  });

  const locationReports = locations.map((location) => {
    const locationItems = items.filter((item) => item.location === location.id);

    const locationQuantity = locationItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    return {
      name: location.name,
      itemCount: locationItems.length,
      totalQuantity: locationQuantity,
    };
  });

  return (
    <>
      <nav className="top-navbar">
        <Link to="/">Home</Link>
        <Link to="/food">Food Bank</Link>
        <Link to="/baby" className="top-nav-active">Baby Store</Link>
        <Link to="/adult">Adult Store</Link>
      </nav>

      <div className="app-container">
        <header className="app-header">
          <img
            src="/logo.jpeg"
            alt="Young Parents United logo"
            className="app-logo"
          />

          <div>
            <h1>Young Parents United Inventory</h1>
            <p className="subtitle">
              Inventory tracking for free stores and food bank
            </p>
          </div>
        </header>

        <nav className="nav-bar">
        <button
          className={activePage === "dashboard" ? "nav-active" : ""}
          onClick={() => setActivePage("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={activePage === "add" ? "nav-active" : ""}
          onClick={() => setActivePage("add")}
        >
          Add Item
        </button>

        <button
          className={activePage === "inventory" ? "nav-active" : ""}
          onClick={() => setActivePage("inventory")}
        >
          Inventory
        </button>

        <button
          className={activePage === "reports" ? "nav-active" : ""}
          onClick={() => setActivePage("reports")}
        >
          Reports
        </button>

        <button
          className={activePage === "history" ? "nav-active" : ""}
          onClick={() => setActivePage("history")}
        >
          History
        </button>

        <button
          className={activePage === "settings" ? "nav-active" : ""}
          onClick={() => setActivePage("settings")}
        >
          Settings
        </button>
      </nav>

      {activePage === "dashboard" && (
        <>
          <section className="dashboard">
            <div className="summary-card">
              <h3>Total Item Types</h3>
              <p>{totalItems}</p>
            </div>

            <div className="summary-card">
              <h3>Total Quantity</h3>
              <p>{totalQuantity}</p>
            </div>

            <div className="summary-card warning-card">
              <h3>Low Stock Items</h3>
              <p>{lowStockItems.length}</p>
            </div>

            <div className="summary-card">
              <h3>Recent Changes</h3>
              <p>{transactions.length}</p>
            </div>
          </section>

          <section className="report-card">
            <h2>Quick Low Stock View</h2>

            {lowStockItems.length === 0 ? (
              <p className="empty-message">No low stock items right now.</p>
            ) : (
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Location</th>
                    <th>Quantity</th>
                    <th>Low Stock Level</th>
                  </tr>
                </thead>

                <tbody>
                  {lowStockItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.location_name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.low_stock_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}

      {activePage === "add" && (
        <>
          <section className="form-section">
            <h2>Add New Item</h2>

            <form onSubmit={handleItemSubmit} className="item-form">
              <input
                type="text"
                name="name"
                placeholder="Item name"
                value={newItem.name}
                onChange={handleItemChange}
                required
              />

              <select
                name="category"
                value={newItem.category}
                onChange={handleItemChange}
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                name="location"
                value={newItem.location}
                onChange={handleItemChange}
                required
              >
                <option value="">Select location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={newItem.quantity}
                onChange={handleItemChange}
                required
              />

              <input
                type="text"
                name="unit"
                placeholder="Unit, example: items, cans, boxes"
                value={newItem.unit}
                onChange={handleItemChange}
              />

              <select
                name="condition"
                value={newItem.condition}
                onChange={handleItemChange}
              >
                <option value="new">New</option>
                <option value="good">Good</option>
                <option value="used">Used</option>
                <option value="damaged">Damaged</option>
              </select>

              <input
                type="number"
                name="low_stock_level"
                placeholder="Low stock level"
                value={newItem.low_stock_level}
                onChange={handleItemChange}
              />

              <textarea
                name="notes"
                placeholder="Notes"
                value={newItem.notes}
                onChange={handleItemChange}
              ></textarea>

              <button type="submit">Add Item</button>
            </form>
          </section>

          <section className="form-section">
            <h2>Record Inventory Change</h2>

            <form onSubmit={handleTransactionSubmit} className="item-form">
              <select
                name="item"
                value={newTransaction.item}
                onChange={handleTransactionChange}
                required
              >
                <option value="">Select item</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — current quantity: {item.quantity}
                  </option>
                ))}
              </select>

              <select
                name="transaction_type"
                value={newTransaction.transaction_type}
                onChange={handleTransactionChange}
              >
                <option value="donation_in">Donation In</option>
                <option value="distributed_out">Distributed Out</option>
                <option value="sold">Sold</option>
                <option value="adjustment">Adjustment</option>
              </select>

              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={newTransaction.quantity}
                onChange={handleTransactionChange}
                required
              />

              <textarea
                name="notes"
                placeholder="Notes, example: Given to family, food pantry pickup, donation from community"
                value={newTransaction.notes}
                onChange={handleTransactionChange}
              ></textarea>

              <button type="submit">Save Inventory Change</button>
            </form>
          </section>
        </>
      )}

      {activePage === "inventory" && (
        <section>
          <div className="section-header">
            <h2>Inventory Items</h2>
            <button className="download-button" onClick={downloadInventoryCSV}>
              Download CSV Report
            </button>
          </div>

          <div className="filter-section">
            <input
              type="text"
              placeholder="Search item name..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
            >
              <option value="">All locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(event) => setLowStockOnly(event.target.checked)}
              />
              Low stock only
            </label>
          </div>

          <table className="inventory-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Quantity</th>
                <th>Condition</th>
                <th>Low Stock?</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  {editingItemId === item.id ? (
                    <>
                      <td>
                        <input
                          className="edit-input"
                          type="text"
                          name="name"
                          value={editItem.name}
                          onChange={handleEditChange}
                        />
                      </td>

                      <td>
                        <select
                          className="edit-input"
                          name="category"
                          value={editItem.category}
                          onChange={handleEditChange}
                        >
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <select
                          className="edit-input"
                          name="location"
                          value={editItem.location}
                          onChange={handleEditChange}
                        >
                          {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                              {location.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <input
                          className="edit-input"
                          type="number"
                          name="quantity"
                          value={editItem.quantity}
                          onChange={handleEditChange}
                        />
                      </td>

                      <td>
                        <select
                          className="edit-input"
                          name="condition"
                          value={editItem.condition}
                          onChange={handleEditChange}
                        >
                          <option value="new">New</option>
                          <option value="good">Good</option>
                          <option value="used">Used</option>
                          <option value="damaged">Damaged</option>
                        </select>
                      </td>

                      <td>
                        <input
                          className="edit-input"
                          type="number"
                          name="low_stock_level"
                          value={editItem.low_stock_level}
                          onChange={handleEditChange}
                        />
                      </td>

                      <td>
                        <button
                          className="quantity-button save-button"
                          onClick={() => saveEdit(item.id)}
                        >
                          Save
                        </button>

                        <button
                          className="quantity-button cancel-button"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.name}</td>
                      <td>{item.category_name}</td>
                      <td>{item.location_name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.condition}</td>
                      <td>
                        {item.is_low_stock ? (
                          <span className="low-stock-label">Yes</span>
                        ) : (
                          "No"
                        )}
                      </td>
                      <td>
                        <button
                          className="quantity-button add-button"
                          onClick={() => updateQuantity(item, 1)}
                        >
                          + Add 1
                        </button>

                        <button
                          className="quantity-button remove-button"
                          onClick={() => updateQuantity(item, -1)}
                        >
                          - Remove 1
                        </button>

                        <button
                          className="quantity-button edit-button"
                          onClick={() => startEditing(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="quantity-button delete-button"
                          onClick={() => deleteItem(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <p className="empty-message">No items match your search/filter.</p>
          )}
        </section>
      )}

      {activePage === "reports" && (
        <section className="report-section">
          <h2>Reports</h2>

          <div className="report-grid">
            <div className="report-card">
              <h3>Inventory by Category</h3>

              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Item Types</th>
                    <th>Total Quantity</th>
                  </tr>
                </thead>

                <tbody>
                  {categoryReports.map((report) => (
                    <tr key={report.name}>
                      <td>{report.name}</td>
                      <td>{report.itemCount}</td>
                      <td>{report.totalQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="report-card">
              <h3>Inventory by Location</h3>

              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Item Types</th>
                    <th>Total Quantity</th>
                  </tr>
                </thead>

                <tbody>
                  {locationReports.map((report) => (
                    <tr key={report.name}>
                      <td>{report.name}</td>
                      <td>{report.itemCount}</td>
                      <td>{report.totalQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="report-card">
              <h3>Low Stock Report</h3>

              {lowStockItems.length === 0 ? (
                <p className="empty-message">No low stock items right now.</p>
              ) : (
                <table className="mini-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Low Stock Level</th>
                    </tr>
                  </thead>

                  <tbody>
                    {lowStockItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.low_stock_level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      )}

      {activePage === "history" && (
        <section className="transaction-section">
          <div className="section-header">
            <h2>Inventory Change History</h2>
            <button className="download-button" onClick={downloadTransactionCSV}>
              Download History CSV
            </button>
          </div>

          <table className="inventory-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Item</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Notes</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.created_at)}</td>
                  <td>{transaction.item_name}</td>
                  <td>{showTransactionType(transaction.transaction_type)}</td>
                  <td>{transaction.quantity}</td>
                  <td>{transaction.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <p className="empty-message">No inventory changes recorded yet.</p>
          )}
        </section>
      )}

      {activePage === "settings" && (
        <section className="settings-page">
          <h2>Settings</h2>
          <p className="settings-description">
            Manage the categories and locations used in the inventory forms.
          </p>

          <div className="settings-grid">
            <div className="settings-card">
              <h3>Categories</h3>

              <form onSubmit={handleCategorySubmit} className="settings-form">
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(event) => setNewCategoryName(event.target.value)}
                />

                <button type="submit">Add Category</button>
              </form>

              <div className="settings-list">
                {categories.map((category) => (
                  <div key={category.id} className="settings-list-item">
                    <span>{category.name}</span>

                    <button
                      className="small-delete-button"
                      onClick={() => deleteCategory(category.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="settings-card">
              <h3>Locations</h3>

              <form onSubmit={handleLocationSubmit} className="settings-form">
                <input
                  type="text"
                  placeholder="New location name"
                  value={newLocationName}
                  onChange={(event) => setNewLocationName(event.target.value)}
                />

                <button type="submit">Add Location</button>
              </form>

              <div className="settings-list">
                {locations.map((location) => (
                  <div key={location.id} className="settings-list-item">
                    <span>{location.name}</span>

                    <button
                      className="small-delete-button"
                      onClick={() => deleteLocation(location.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      </div>
    </>
  );
}

export default BabyInventory;