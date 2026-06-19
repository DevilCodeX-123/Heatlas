import { useState } from 'react';
import { Home, Grid, Zap, Info, Bot, Check, X, ArrowRight, ArrowLeft, Ruler, Calendar } from 'lucide-react';
import './ActionEngine.css';

const ActionEngine = () => {
  const [step, setStep] = useState(1);
  const [homeSize, setHomeSize] = useState('medium');
  const [homeAge, setHomeAge] = useState('10-20');
  const [roofType, setRoofType] = useState('concrete');
  const [balcony, setBalcony] = useState('single');
  const [solarCap, setSolarCap] = useState(45);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="action-engine-container">
      <div className="audit-main">
        <div className="stepper">
          <div className={`step ${step >= 1 ? 'active' : ''}`} onClick={() => setStep(1)}>
            <div className="step-circle">1</div>
            <div className="step-label">Home Details</div>
          </div>
          <div className={`step-line ${step >= 2 ? 'active-line' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`} onClick={() => setStep(2)}>
            <div className="step-circle">2</div>
            <div className="step-label">Energy & Roof</div>
          </div>
          <div className={`step-line ${step >= 3 ? 'active-line' : ''}`}></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`} onClick={() => setStep(3)}>
            <div className="step-circle">3</div>
            <div className="step-label">Results</div>
          </div>
        </div>

        <div className="audit-content">
          <h1>Smart Citizen Audit</h1>
          <p className="audit-desc">Help us calibrate your personalized climate resilience strategy by providing your home's structural details.</p>

          {step === 1 && (
            <div className="step-content fade-in">
              <div className="question-block">
                <div className="question-title">
                  <Ruler size={20} /> What is the approximate size of your home?
                </div>
                <div className="balcony-options">
                  <div className={`balcony-card ${homeSize === 'small' ? 'selected' : ''}`} onClick={() => setHomeSize('small')}>
                    <div>Compact (&lt; 1000 sq ft)</div>
                  </div>
                  <div className={`balcony-card ${homeSize === 'medium' ? 'selected' : ''}`} onClick={() => setHomeSize('medium')}>
                    <div>Medium (1000 - 2000)</div>
                  </div>
                  <div className={`balcony-card ${homeSize === 'large' ? 'selected' : ''}`} onClick={() => setHomeSize('large')}>
                    <div>Large (&gt; 2000 sq ft)</div>
                  </div>
                </div>
              </div>

              <div className="question-block">
                <div className="question-title">
                  <Calendar size={20} /> When was your home constructed?
                </div>
                <div className="balcony-options">
                  <div className={`balcony-card ${homeAge === 'new' ? 'selected' : ''}`} onClick={() => setHomeAge('new')}>
                    <div>Last 10 Years</div>
                  </div>
                  <div className={`balcony-card ${homeAge === '10-20' ? 'selected' : ''}`} onClick={() => setHomeAge('10-20')}>
                    <div>10 - 20 Years</div>
                  </div>
                  <div className={`balcony-card ${homeAge === 'old' ? 'selected' : ''}`} onClick={() => setHomeAge('old')}>
                    <div>20+ Years</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content fade-in">
              <div className="question-block">
                <div className="question-title">
                  <Home size={20} /> What is your primary roof architecture?
                </div>
                <div className="roof-options">
                  <div className={`roof-card ${roofType === 'concrete' ? 'selected' : ''}`} onClick={() => setRoofType('concrete')}>
                    <div className="roof-image" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80)'}}></div>
                    <div className="roof-label">Reinforced Concrete</div>
                  </div>
                  <div className={`roof-card ${roofType === 'cool' ? 'selected' : ''}`} onClick={() => setRoofType('cool')}>
                    <div className="roof-image" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80)'}}></div>
                    <div className="roof-label">Reflective Cool Roof</div>
                  </div>
                  <div className={`roof-card ${roofType === 'tile' ? 'selected' : ''}`} onClick={() => setRoofType('tile')}>
                    <div className="roof-image" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80)'}}></div>
                    <div className="roof-label">Terracotta / Tiled</div>
                  </div>
                </div>
              </div>

              <div className="question-block">
                <div className="question-title">
                  <Grid size={20} /> Do you have external balcony availability?
                </div>
                <div className="balcony-options">
                  <div className={`balcony-card ${balcony === 'multi' ? 'selected' : ''}`} onClick={() => setBalcony('multi')}>
                    <div className="balcony-icon"><Check size={14} /></div>
                    <div>Yes, multiple</div>
                  </div>
                  <div className={`balcony-card ${balcony === 'single' ? 'selected' : ''}`} onClick={() => setBalcony('single')}>
                    <div className="balcony-icon"><Check size={14} /></div>
                    <div>Single Balcony</div>
                  </div>
                  <div className={`balcony-card ${balcony === 'none' ? 'selected' : ''}`} onClick={() => setBalcony('none')}>
                    <div className="balcony-icon"><X size={14} /></div>
                    <div>No Balcony</div>
                  </div>
                </div>
              </div>

              <div className="slider-container">
                <div className="slider-header">
                  <Zap size={18} /> Solar Installation Capacity
                </div>
                <p className="slider-desc">Estimate the unshaded area available on your rooftop for photovoltaic integration.</p>
                <input 
                  type="range" 
                  min="0" max="200" 
                  value={solarCap} 
                  onChange={(e) => setSolarCap(e.target.value)} 
                  className="custom-slider"
                />
                <div className="slider-labels">
                  <span>0 m²</span>
                  <span className="active">{solarCap} m² Selected</span>
                  <span>200 m² +</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content fade-in" style={{textAlign: 'center', padding: '40px 0'}}>
              <Bot size={64} color="var(--accent-primary)" style={{marginBottom: '20px'}} />
              <h2 style={{color: 'var(--text-primary)', marginBottom: '10px'}}>AI Analysis Complete</h2>
              <p style={{color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto'}}>
                We have processed your home profile. Review the Impact Projection and Contextual Insights generated by EcoShield AI on the right panel.
              </p>
            </div>
          )}

          <div className="step-navigation">
            {step > 1 ? (
              <button className="nav-btn btn-back" onClick={handleBack}>
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div></div>}
            
            {step < 3 ? (
              <button className="nav-btn btn-next" onClick={handleNext}>
                Next Step <ArrowRight size={16} />
              </button>
            ) : (
              <button className="nav-btn btn-next" onClick={() => alert("Audit successfully submitted to your profile!")}>
                Submit Audit <Check size={16} />
              </button>
            )}
          </div>

        </div>
      </div>

      <div className="impact-panel">
        <div className="panel-title">IMPACT PROJECTION</div>
        
        <div className="projection-card">
          <div className="proj-label">Estimated Annual Savings</div>
          <div className="proj-value">₹14,250<span> / year</span></div>
          <div className="proj-divider"></div>
          <div className="proj-label">Carbon Footprint Reduction</div>
          <div className="proj-value" style={{fontSize: '24px'}}>2.4 Tons CO₂</div>
          <div className="proj-sub">= 120 trees planted equivalent</div>
        </div>

        <div className="panel-title" style={{marginTop: '16px'}}>Contextual Insights</div>

        <div className="insight-card">
          <Info size={16} />
          <div>Based on your <span>Concrete Roof</span>, white thermal coating could reduce internal temps by up to 5°C.</div>
        </div>

        <div className="insight-card">
          <Zap size={16} />
          <div>Your <span>{solarCap} m²</span> solar potential qualifies for a 30% government subsidy in your region.</div>
        </div>

        <div className="ai-box">
          <div className="ai-header">
            <Bot size={24} className="ai-icon" />
            <div>
              <div className="ai-title">EcoShield AI</div>
              <div className="ai-subtitle">Analyzing input patterns...</div>
            </div>
          </div>
          <div className="terminal-text">
            <div className="done">&gt; calibrating_thermal_models...</div>
            <div className="done">&gt; fetching_regional_subsidies...</div>
            <div className="done">&gt; cross_referencing_solar_maps...</div>
            <div>&gt; optimal_plan_found.</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ActionEngine;
