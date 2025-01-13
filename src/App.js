import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [cdp, setCdp] = useState("");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse("");

    if (!cdp || !query) {
      setError("Please select a CDP and enter a query.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/query", { cdp, query });
      setResponse(res.data.data || "No response data available.");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while processing your request.");
    }
  };

  return (
    <div className="App">
      <h1>CDP Support Chatbot</h1>
      <form onSubmit={handleQuerySubmit} className="query-form">
        <div className="form-group">
          <label htmlFor="cdp">Select CDP:</label>
          <select
            id="cdp"
            value={cdp}
            onChange={(e) => setCdp(e.target.value)}
            className="form-control"
          >
            <option value="">-- Select a CDP --</option>
            <option value="Segment">Segment</option>
            <option value="mParticle">mParticle</option>
            <option value="Lytics">Lytics</option>
            <option value="Zeotap">Zeotap</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="query">Enter Query:</label>
          <textarea
            id="query"
            rows="4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {response && (
        <div className="response">
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
