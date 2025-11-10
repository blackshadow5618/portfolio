const { useState, useEffect } = React;

function Dashboard() {
  const [sales, setSales] = useState(0);
  const [orders, setOrders] = useState(0);
  const [customers, setCustomers] = useState(0);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setSales((prev) => prev + Math.floor(Math.random() * 100));
      setOrders((prev) => prev + Math.floor(Math.random() * 10));
      setCustomers((prev) => prev + Math.floor(Math.random() * 5));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <h1>E-commerce Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p className="stat-value">${sales.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Orders</h3>
          <p className="stat-value">{orders}</p>
        </div>
        <div className="stat-card">
          <h3>Customers</h3>
          <p className="stat-value">{customers}</p>
        </div>
      </div>
      <div className="chart-placeholder">
        <h3>Sales Chart</h3>
        <p>
          Interactive chart would be implemented here with a library like
          Chart.js
        </p>
      </div>
    </div>
  );
}

ReactDOM.render(<Dashboard />, document.getElementById("root"));
