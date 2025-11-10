const { useState } = React;

function DataVisualizationTool() {
  const [data, setData] = useState([
    { label: "Jan", value: 65 },
    { label: "Feb", value: 59 },
    { label: "Mar", value: 80 },
    { label: "Apr", value: 81 },
    { label: "May", value: 56 },
    { label: "Jun", value: 55 },
    { label: "Jul", value: 40 },
  ]);
  const [chartType, setChartType] = useState("bar");

  const maxValue = Math.max(...data.map((d) => d.value));

  const renderBarChart = () => (
    <div className="chart-container">
      {data.map((item, index) => (
        <div key={index} className="bar-item">
          <div className="bar-label">{item.label}</div>
          <div className="bar-container">
            <div
              className="bar"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            ></div>
          </div>
          <div className="bar-value">{item.value}</div>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="chart-container line-chart">
      <svg width="100%" height="300" viewBox="0 0 400 300">
        <polyline
          fill="none"
          stroke="#3498db"
          strokeWidth="3"
          points={data
            .map(
              (item, index) =>
                `${index * 50 + 25},${300 - (item.value / maxValue) * 250}`
            )
            .join(" ")}
        />
        {data.map((item, index) => (
          <circle
            key={index}
            cx={index * 50 + 25}
            cy={300 - (item.value / maxValue) * 250}
            r="5"
            fill="#3498db"
          />
        ))}
      </svg>
      <div className="x-axis">
        {data.map((item, index) => (
          <div key={index} className="axis-label">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );

  const addRandomData = () => {
    const newData = [...data];
    const months = ["Aug", "Sep", "Oct", "Nov", "Dec"];
    const randomMonth = months[Math.floor(Math.random() * months.length)];
    const randomValue = Math.floor(Math.random() * 100) + 20;
    newData.push({ label: randomMonth, value: randomValue });
    setData(newData);
  };

  return (
    <div className="data-viz-tool">
      <h1>Data Visualization Tool</h1>
      <div className="controls">
        <button onClick={() => setChartType("bar")}>Bar Chart</button>
        <button onClick={() => setChartType("line")}>Line Chart</button>
        <button onClick={addRandomData}>Add Data Point</button>
      </div>
      <div className="chart-wrapper">
        {chartType === "bar" ? renderBarChart() : renderLineChart()}
      </div>
      <div className="data-table">
        <h3>Data Table</h3>
        <table>
          <thead>
            <tr>
              <th>Label</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.label}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

ReactDOM.render(<DataVisualizationTool />, document.getElementById("root"));
