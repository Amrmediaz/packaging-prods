import React from 'react';
import styles from './styles.js';

const machines = [
  { id: 'PL-01', name: 'Paper Bag Extruder', status: 'Running', load: '85%', temp: '180°C', health: 'Good' },
  { id: 'PL-02', name: 'Corrugated Box Folder', status: 'Running', load: '92%', temp: '45°C', health: 'Warning' },
  { id: 'PL-03', name: 'Flexo Printing Press', status: 'Maintenance', load: '0%', temp: '22°C', health: 'Critical' },
  { id: 'PL-04', name: 'Plastic Film Blower', status: 'Running', load: '78%', temp: '210°C', health: 'Good' },
];

const liveQueue = [
  { id: 501, order: 'Muscat Coffee Co.', product: 'Brown Paper Bags', progress: 75, speed: '120 pcs/min' },
  { id: 502, order: 'Oman Dates Ltd.', product: 'Premium Gift Boxes', progress: 40, speed: '45 pcs/min' },
  { id: 503, order: 'Sohar Hypermarket', product: 'Biodegradable Wraps', progress: 90, speed: '200 pcs/min' },
];

function ProductionLines() {
  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: '25px', fontSize: '24px' }}>Factory Production Lines</h1>

      {/* 1. Machine Health Grid */}
      <div style={styles.statsGrid}>
        {machines.map((m) => (
          <div key={m.id} style={styles.statCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8', fontSize: '12px' }}>{m.id}</span>
              <span style={{ 
                color: m.status === 'Running' ? '#4ade80' : '#f87171', 
                fontSize: '12px', fontWeight: 'bold' 
              }}>● {m.status}</span>
            </div>
            <h3 style={{ margin: '10px 0', fontSize: '18px' }}>{m.name}</h3>
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <div>
                <div style={styles.statTitle}>Load</div>
                <div style={{ color: '#fff' }}>{m.load}</div>
              </div>
              <div>
                <div style={styles.statTitle}>Temp</div>
                <div style={{ color: '#fff' }}>{m.temp}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Live Job Queue */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Active Production Queue</h2>
        <div style={styles.tableWrapper}>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={{...styles.tableCell, flex: 0.5}}>Job ID</div>
              <div style={styles.tableCell}>Client Order</div>
              <div style={styles.tableCell}>Product Type</div>
              <div style={styles.tableCell}>Production Speed</div>
              <div style={styles.tableCell}>Progress</div>
            </div>

            {liveQueue.map((job) => (
              <div key={job.id} style={styles.tableRow}>
                <div style={{...styles.tableCell, flex: 0.5}}>{job.id}</div>
                <div style={styles.tableCell}><strong>{job.order}</strong></div>
                <div style={styles.tableCell}>{job.product}</div>
                <div style={styles.tableCell}>{job.speed}</div>
                <div style={styles.tableCell}>
                  {/* Progress Bar */}
                  <div style={{ 
                    width: '100%', backgroundColor: '#334155', 
                    borderRadius: '10px', height: '8px', marginTop: '5px' 
                  }}>
                    <div style={{ 
                      width: `${job.progress}%`, backgroundColor: '#3b82f6', 
                      height: '100%', borderRadius: '10px' 
                    }} />
                  </div>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>{job.progress}% Complete</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductionLines;