// Order History Component for HawkShop
(function () {
  let allOrders = [];
  let filteredOrders = [];

  // Fetch orders from mock JSON or localStorage
  async function fetchOrders() {
    try {
      // Try to fetch from JSON file first
      const response = await fetch('data/orders.json');
      if (response.ok) {
        allOrders = await response.json();
      } else {
        // Fallback to localStorage if fetch fails
        allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      }
    } catch (e) {
      // If fetch fails (e.g., CORS), use localStorage
      allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    }
    
    filteredOrders = [...allOrders];
    return allOrders;
  }

  // Format date for display
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // Get status badge class based on order status
  function getStatusClass(status) {
    const statusMap = {
      'Delivered': 'status-delivered',
      'Shipped': 'status-shipped',
      'Processing': 'status-processing',
      'Cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-default';
  }

  // Render a single order
  function renderOrder(order) {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    
    const itemsList = order.items.map(item => `
      <div class="order-item">
        <img src="${item.image}" alt="${item.name}" class="order-item-image" onerror="this.style.display='none'">
        <div class="order-item-details">
          <span class="order-item-name">${item.name}</span>
          <span class="order-item-qty">Qty: ${item.quantity}</span>
          <span class="order-item-price">$${item.price.toFixed(2)}</span>
        </div>
      </div>
    `).join('');

    orderCard.innerHTML = `
      <div class="order-header">
        <div class="order-info">
          <h3 class="order-id">${order.id}</h3>
          <p class="order-date">${formatDate(order.date)}</p>
        </div>
        <div class="order-status-container">
          <span class="order-status ${getStatusClass(order.status)}">${order.status}</span>
        </div>
      </div>
      <div class="order-items">
        ${itemsList}
      </div>
      <div class="order-footer">
        <span class="order-total-label">Total:</span>
        <span class="order-total-amount">$${order.total.toFixed(2)}</span>
      </div>
    `;
    
    return orderCard;
  }

  // Render all orders or show empty state
  function renderOrders(orders) {
    const container = document.getElementById('order-history-container');
    if (!container) return;

    container.innerHTML = '';

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-box-open"></i>
          <h2>You have no previous orders</h2>
          <p>Start shopping to see your order history here!</p>
          <a href="index.html" class="btn">Start Shopping</a>
        </div>
      `;
      return;
    }

    orders.forEach(order => {
      const orderElement = renderOrder(order);
      container.appendChild(orderElement);
    });
  }

  // Filter orders by status
  function filterByStatus(status) {
    if (status === 'all') {
      filteredOrders = [...allOrders];
    } else {
      filteredOrders = allOrders.filter(order => order.status === status);
    }
    renderOrders(filteredOrders);
  }

  // Filter orders by date range
  function filterByDate(range) {
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case 'all':
        filteredOrders = [...allOrders];
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        filteredOrders = allOrders.filter(order => new Date(order.date) >= startDate);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        filteredOrders = allOrders.filter(order => new Date(order.date) >= startDate);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        filteredOrders = allOrders.filter(order => new Date(order.date) >= startDate);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        filteredOrders = allOrders.filter(order => new Date(order.date) >= startDate);
        break;
    }
    renderOrders(filteredOrders);
  }

  // Apply combined filters
  function applyFilters() {
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');
    
    if (!statusFilter || !dateFilter) return;

    let filtered = [...allOrders];

    // Apply status filter
    const statusValue = statusFilter.value;
    if (statusValue !== 'all') {
      filtered = filtered.filter(order => order.status === statusValue);
    }

    // Apply date filter
    const dateValue = dateFilter.value;
    if (dateValue !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (dateValue) {
        case '30days':
          startDate.setDate(now.getDate() - 30);
          filtered = filtered.filter(order => new Date(order.date) >= startDate);
          break;
        case '90days':
          startDate.setDate(now.getDate() - 90);
          filtered = filtered.filter(order => new Date(order.date) >= startDate);
          break;
        case '6months':
          startDate.setMonth(now.getMonth() - 6);
          filtered = filtered.filter(order => new Date(order.date) >= startDate);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          filtered = filtered.filter(order => new Date(order.date) >= startDate);
          break;
      }
    }

    filteredOrders = filtered;
    renderOrders(filteredOrders);
  }

  // Initialize order history on page load
  document.addEventListener('DOMContentLoaded', async function () {
    // Check if we're on the order history page
    const container = document.getElementById('order-history-container');
    if (!container) return;

    // Fetch and display orders
    await fetchOrders();
    renderOrders(filteredOrders);

    // Set up filter event listeners
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');

    if (statusFilter) {
      statusFilter.addEventListener('change', applyFilters);
    }

    if (dateFilter) {
      dateFilter.addEventListener('change', applyFilters);
    }
  });

  // Export functions for use in other pages (e.g., profile page)
  window.OrderHistory = {
    fetchOrders,
    renderOrders,
    filterByStatus,
    filterByDate,
    applyFilters
  };
})();
