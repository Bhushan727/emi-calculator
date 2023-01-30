import React, { useState, useEffect } from "react";
import './EmiCalc.css'

function EmiCalculator() {
  const [principal, setPrincipal] = useState(0);
  const [rate, setRate] = useState(0);
  const [duration, setDuration] = useState(0);
  const [emi, setEmi] = useState(0);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [emiTable, setEmiTable] = useState([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("calculationHistory");
    if (storedHistory) {
      setCalculationHistory(JSON.parse(storedHistory));
    }
  }, []);

  // useEffect(() => {

  //   localStorage.setItem(
  //     "calculationHistory",
  //     JSON.stringify(calculationHistory)
  //   );
  // }, [calculationHistory]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!principal || !rate || !duration) {
      return;
    }
    const r = rate / (12 * 100);
    const n = duration;
    const p = principal;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setEmi(emi);
    // setCalculationHistory([
    //   ...calculationHistory,
    //   { principal, rate, duration, emi },
    // ]);

    setEmiTable(emiTable);
    const currentHistory = [
      ...calculationHistory,
      {
        principal: principal,
        duration: duration,
        emi : emi
      }
    ];

    localStorage.setItem('calculationHistory', JSON.stringify(currentHistory));
    setCalculationHistory(currentHistory);

  };

  const renderEmiTable = () => {
    const table = [];
    for (let i = 1; i <= duration; i++) {
      table.push(
        <tr key={i}>
          <td>{i}</td>
          <td>{emi.toFixed(2)}</td>
        </tr>
      );
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>EMI</th>
          </tr>
        </thead>
        <tbody>{table}</tbody>
      </table>
    );
  };

  const renderCalculationHistory = () => {
    return (
      <ul>
        {calculationHistory.map((history, index) => (
          <li key={index}>
            <p
              className="historyLink"
              onClick={() => {
                setPrincipal(history.principal);
                setRate(history.rate);
                setDuration(history.duration);
                setEmi(history.emi);
              }}
            >
              Principal: {history.principal}, Rate: {history.rate}, Duration:{" "}
              {history.duration}
            </p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="formContainer">
      <h1>Emi Calculator</h1>
      <form onSubmit={handleSubmit} className='form'>
        <h2>Enter Inputs</h2>
        <div className="inputCont">
          <label htmlFor="principal">Principal Amount:</label>
          <input
            type="number"
            id="principal"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>
        <div className="inputCont">
          <label htmlFor="rate">Rate of Interest:</label>
          <input
            type="number"
            id="rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div className="inputCont">
          <label htmlFor="duration">Duration (in months):</label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <button className="submit" type="submit">Submit</button>
      </form>
      {calculationHistory.length > 0 && <div>{renderCalculationHistory()}</div>}
      {emi > 0 && <div>{renderEmiTable()}</div>}
    </div>
  );
}

export default EmiCalculator;
