// Mock inventory dataset for Sprint 3
const inventoryData = [
  { id: "merch-hoodie-1", name: "Laurier Pullover Hoodie", stock: 12 },
  { id: "merch-crewneck-1", name: "Midas Crewneck Sweater", stock: 7 },
  { id: "merch-quarterzip-1", name: "Laurier Quarter-Zip Sweater", stock: 3 },

  { id: "gift-ring-1", name: "Laurier Sterling Silver Ring", stock: 5 },
  { id: "gift-bear-1", name: "Laurier Shirt Bear", stock: 0 },
  { id: "gift-flask-1", name: "Laurier Embossed Silver Flask", stock: 15 },

  { id: "stat-calc-1", name: "Scientific Calculator", stock: 0 },
  { id: "stat-pen-1", name: "Metal Ball Point Pen", stock: 120 },
  { id: "stat-earpods-1", name: "USC Type-C Earpods", stock: 8 }
];

// status logic
function getStatus(stock) {
  if (stock === 0) return "Out of Stock";
  if (stock < 5) return "Low Stock";
  return "In Stock";
}

// render inventory into table
function renderInventory() {
  const tbody = document.getElementById("inventory-body");
  tbody.innerHTML = "";

  inventoryData.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.id}</td>
      <td>${item.stock}</td>
      <td class="${getStatus(item.stock).replace(" ", "-").toLowerCase()}">
        ${getStatus(item.stock)}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// fake report generation (downloads JSON file)
function generateReport() {
  const blob = new Blob([JSON.stringify(inventoryData, null, 2)], {
    type: "application/json"
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "inventory_report.json";
  link.click();
}

document.addEventListener("DOMContentLoaded", () => {
  renderInventory();
  document.getElementById("generate-report").addEventListener("click", generateReport);
});
