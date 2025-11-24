// Mock inventory dataset for Sprint 3 (with optional size field)
const inventoryData = [
  { id: "merch-hoodie-1", name: "Laurier Pullover Hoodie", size: "S / M / L / XL", stock: 12 },
  { id: "merch-crewneck-1", name: "Midas Crewneck Sweater", size: "M / L / XL", stock: 7 },
  { id: "merch-quarterzip-1", name: "Laurier Quarter-Zip Sweater", size: "L / XL", stock: 3 },

  { id: "gift-ring-1", name: "Laurier Sterling Silver Ring", size: "One Size", stock: 5 },
  { id: "gift-bear-1", name: "Laurier Shirt Bear", size: null, stock: 0 },
  { id: "gift-flask-1", name: "Laurier Embossed Silver Flask", size: null, stock: 15 },

  { id: "stat-calc-1", name: "Scientific Calculator", size: null, stock: 0 },
  { id: "stat-pen-1", name: "Metal Ball Point Pen", size: null, stock: 120 },
  { id: "stat-earpods-1", name: "USC Type-C Earpods", size: null, stock: 8 }
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
      <td>${item.size ? item.size : "—"}</td>
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
