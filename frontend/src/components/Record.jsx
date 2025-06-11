import React from 'react';
import './Record.css';

const Record = ({ record, onClose }) => {
  if (!record) return null;

  const formatHeaders = (headers) => {
    if (!headers) return null;
    try {
      const parsed = typeof headers === 'string' ? JSON.parse(headers) : headers;
      return Object.entries(parsed).map(([key, value]) => (
        <div key={key} className="header-row">
          <span className="header-key">{key}:</span>
          <span className="header-value">{String(value)}</span>
        </div>
      ));
    } catch (e) {
      return <div>Failed to parse headers</div>;
    }
  };

  const formatBody = (body) => {
    if (!body) return 'No body';
    try {
      const parsed = typeof body === 'string' ? JSON.parse(body) : body;
      return (
        <pre className="json-body">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch (e) {
      return <div className="raw-body">{String(body)}</div>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Request Details</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="detail-section">
            <h3>URL</h3>
            <div className="detail-value">{record.url}</div>
          </div>
          
          <div className="detail-section">
            <h3>Method</h3>
            <div className="detail-value method">{record.method}</div>
          </div>
          
          <div className="detail-section">
            <h3>Status</h3>
            <div className={`detail-value status-${Math.floor(record.status / 100)}xx`}>
              {record.status}
            </div>
          </div>
          
          <div className="detail-section">
            <h3>Headers</h3>
            <div className="detail-value headers">
              {formatHeaders(record.headers)}
            </div>
          </div>
          
          <div className="detail-section">
            <h3>Request Body</h3>
            <div className="detail-value body">
              {formatBody(record.body)}
            </div>
          </div>
          
          <div className="detail-section">
            <h3>Response</h3>
            <div className="detail-value response">
              {formatBody(record.response)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Record;