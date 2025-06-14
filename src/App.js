import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [bottles, setBottles] = useState([
    { type: 'full', count: 2, ml: 750 },
    { type: 'half', count: 1, ml: 375 },
    { type: 'quarter', count: 0, ml: 180 }
  ]);
  
  const [scenarios, setScenarios] = useState([
    { 
      id: 1, 
      name: 'Scenario Alpha', 
      people: 4,
      commitHash: 'a1b2c3d'
    },
    { 
      id: 2, 
      name: 'Scenario Beta', 
      people: 6,
      commitHash: 'e4f5g6h'
    }
  ]);

  const [gitStatus, setGitStatus] = useState('GREEN');
  
  const calculateTotal = (bottles) => {
    return bottles.reduce((total, bottle) => total + (bottle.count * bottle.ml), 0);
  };

  const calculatePegDistribution = (totalMl, people, pegSize) => {
    const totalPegsAvailable = Math.floor(totalMl / pegSize);
    const pegsPerPerson = Math.floor(totalPegsAvailable / people);
    const remainingPegs = totalPegsAvailable % people;
    const mlPerPerson = pegsPerPerson * pegSize;
    const totalUsed = totalPegsAvailable * pegSize;
    const wastedMl = totalMl - totalUsed;
    
    return {
      pegsPerPerson,
      mlPerPerson,
      totalPegsAvailable,
      remainingPegs,
      totalUsed,
      wastedMl,
      efficiency: ((totalUsed / totalMl) * 100).toFixed(1)
    };
  };

  const updateBottle = (index, field, value) => {
    const newBottles = [...bottles];
    newBottles[index][field] = parseInt(value) || 0;
    setBottles(newBottles);
  };

  const updateScenario = (scenarioId, field, value) => {
    setScenarios(scenarios.map(scenario => 
      scenario.id === scenarioId 
        ? { ...scenario, [field]: value }
        : scenario
    ));
  };

  const addScenario = () => {
    const newId = Math.max(...scenarios.map(s => s.id)) + 1;
    setScenarios([...scenarios, {
      id: newId,
      name: `Scenario ${String.fromCharCode(65 + scenarios.length)}`,
      people: 3,
      commitHash: Math.random().toString(36).substr(2, 7)
    }]);
  };

  const removeScenario = (id) => {
    if (scenarios.length > 1) {
      setScenarios(scenarios.filter(s => s.id !== id));
    }
  };

  useEffect(() => {
    const totalMl = calculateTotal(bottles);
    const hasIssues = totalMl === 0 || scenarios.some(scenario => scenario.people === 0);
    setGitStatus(hasIssues ? 'RED' : 'GREEN');
  }, [bottles, scenarios]);

  const totalMl = calculateTotal(bottles);

  return (
    <div className="App">
      <header className="app-header">
        <h1>🍾 kuppi</h1>
        <div className="git-status">
          <span className={`status-badge ${gitStatus.toLowerCase()}`}>
            Git Status: {gitStatus} - {gitStatus === 'GREEN' ? 'All scenarios supported ✅' : 'Merge conflicts detected ⚠️'}
          </span>
        </div>
        <p className="subtitle">{/* Scaling concurrent drinkers with optimized resource allocation */}</p>
      </header>

      <div className="inventory-section">
        <h2>🍾 Bottle Inventory (Current Branch)</h2>
        <div className="bottles-grid">
          {bottles.map((bottle, index) => (
            <div key={index} className="bottle-config">
              <div className="bottle-icon">
                {bottle.type === 'full' ? '🍾' : bottle.type === 'half' ? '🍷' : '🥃'}
              </div>
              <h3>{bottle.type.charAt(0).toUpperCase() + bottle.type.slice(1)} ({bottle.ml}ml)</h3>
              <input
                type="number"
                value={bottle.count}
                onChange={(e) => updateBottle(index, 'count', e.target.value)}
                min="0"
                className="bottle-input"
              />
              <div className="bottle-total">
                Total: {bottle.count * bottle.ml}ml
              </div>
            </div>
          ))}
        </div>
        <div className="total-alcohol">
          <h3>Total Allocated Memory: {totalMl}ml 🧮</h3>
        </div>
      </div>

      <div className="scenarios-section">
        <div className="section-header">
          <h2>⚖️ Scenario Comparison (Side-by-Side Diff)</h2>
          <button onClick={addScenario} className="add-scenario-btn">
            + git branch new-scenario
          </button>
        </div>
        
        <div className="scenarios-grid">
          {scenarios.map((scenario) => {
            const pegSizes = [45, 60, 90];
            const calculations = pegSizes.map(size => calculatePegDistribution(totalMl, scenario.people, size));
            
            return (
              <div key={scenario.id} className="scenario-card">
                <div className="scenario-header">
                  <input
                    type="text"
                    value={scenario.name}
                    onChange={(e) => updateScenario(scenario.id, 'name', e.target.value)}
                    className="scenario-name"
                  />
                  <button 
                    onClick={() => removeScenario(scenario.id)}
                    className="remove-btn"
                    disabled={scenarios.length <= 1}
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="git-info">
                  <code>commit: {scenario.commitHash}</code>
                </div>

                <div className="people-config">
                  <label>👥 Concurrent Users:</label>
                  <input
                    type="number"
                    value={scenario.people}
                    onChange={(e) => updateScenario(scenario.id, 'people', parseInt(e.target.value) || 1)}
                    min="1"
                    className="people-input"
                  />
                </div>

                <div className="pegs-scenarios">
                  <h4>🥃 Peg Distribution Sub-Scenarios:</h4>
                  {pegSizes.map((pegSize, index) => {
                    const calc = calculations[index];
                    return (
                      <div key={pegSize} className={`peg-scenario peg-${pegSize}`}>
                        <div className="peg-scenario-header">
                          <h5>{pegSize}ml Peg Strategy</h5>
                          <div className="efficiency-badge">
                            {calc.efficiency}% efficiency
                          </div>
                        </div>
                        
                        <div className="peg-scenario-details">
                          <div className="detail-row">
                            <span className="label">Each user gets:</span>
                            <span className="value">{calc.pegsPerPerson} pegs ({calc.mlPerPerson}ml)</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Total pegs available:</span>
                            <span className="value">{calc.totalPegsAvailable} pegs</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Leftover pegs:</span>
                            <span className="value">{calc.remainingPegs} pegs</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Alcohol used:</span>
                            <span className="value">{calc.totalUsed}ml</span>
                          </div>
                          {calc.wastedMl > 0 && (
                            <div className="detail-row waste">
                              <span className="label">Wasted alcohol:</span>
                              <span className="value">{calc.wastedMl}ml</span>
                            </div>
                          )}
                        </div>
                        
                        <div className={`status-indicator ${calc.pegsPerPerson > 0 ? 'success' : 'error'}`}>
                          {calc.pegsPerPerson > 0 ? '✅ FEASIBLE' : '❌ INSUFFICIENT'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="summary-stats">
                  <h5>📊 Summary Statistics:</h5>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Best Efficiency:</span>
                      <span className="stat-value">
                        {Math.max(...calculations.map(c => parseFloat(c.efficiency))).toFixed(1)}%
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Max Pegs/Person:</span>
                      <span className="stat-value">
                        {Math.max(...calculations.map(c => c.pegsPerPerson))} pegs
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Max ML/Person:</span>
                      <span className="stat-value">
                        {Math.max(...calculations.map(c => c.mlPerPerson))}ml
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="app-footer">
        <p>🚀 Code review passed: No memory leaks, proper resource allocation, scalable architecture</p>
        <p>⚠️ WARNING: Please drink responsibly P.S. NO ALLEPEY TRIPS!!!!!. This is a parody calculator for entertainment purposes.</p>
      </footer>
    </div>
  );
}

export default App;
