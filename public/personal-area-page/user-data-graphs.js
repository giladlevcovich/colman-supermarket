function loadUserData(userId) {
    $.ajax({
        url: `http://localhost:80/api/orders/user-orders/${userId}`,
        type: 'GET',
        success: function(orders) {
            createOrderCountChart(orders);
            createDailySpendingChart(orders);
            createMostPurchasedProductsChart(orders);
        },
        error: function(xhr, status, error) {
            showMessage('Error loading order data: ' + error, 'error');
        }
    });
}

function createOrderCountChart(orders) {
    const orderDates = orders.map(order => new Date(order.date).toLocaleDateString());
    const orderCounts = {};
    orderDates.forEach(date => {
        orderCounts[date] = (orderCounts[date] || 0) + 1;
    });

    const ctx = document.getElementById('orderCountChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(orderCounts),
            datasets: [{
                label: 'Number of Orders',
                data: Object.values(orderCounts),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Order Frequency'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Orders'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}

function createDailySpendingChart(orders) {
    const dailySpending = {};
    orders.forEach(order => {
        const date = new Date(order.date).toLocaleDateString();
        dailySpending[date] = (dailySpending[date] || 0) + order.totalPrice;
    });

    const ctx = document.getElementById('dailySpendingChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(dailySpending),
            datasets: [{
                label: 'Daily Spending',
                data: Object.values(dailySpending),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Daily Spending'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount Spent ($)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}

async function createMostPurchasedProductsChart(orders) {
    const productCounts = {};
    orders.forEach(order => {
        order.products.forEach(product => {
            if (product.productId) {
                productCounts[product.productId] = (productCounts[product.productId] || 0) + product.quantity;
            }
        });
    });

    const sortedProducts = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const productNames = await Promise.all(
        sortedProducts.map(async ([productId]) => {
            try {
                const response = await fetch(`http://localhost:80/api/products/${productId}`);
                if (!response.ok) throw new Error('Product not found');
                const product = await response.json();
                return product.name;
            } catch (error) {
                console.error(`Error fetching product ${productId}:`, error);
                return `Unknown (${productId})`;
            }
        })
    );

    const ctx = document.getElementById('mostPurchasedProductsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Number of Purchases',
                data: sortedProducts.map(product => product[1]),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Top 5 Most Purchased Products'
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `Product: ${tooltipItems[0].label}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Purchases'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Product Name'
                    },
                    ticks: {
                        callback: function(value, index) {
                            return this.getLabelForValue(value).length > 15 
                                ? this.getLabelForValue(value).substr(0, 15) + '...'
                                : this.getLabelForValue(value);
                        }
                    }
                }
            }
        }
    });
}