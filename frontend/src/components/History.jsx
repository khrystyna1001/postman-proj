import '../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Record from './Record';

function History() {
    const [history, setHistory] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHistory = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:3000/history');
            setHistory(response.data);
            setError(null);
        } catch (error) {
            console.error('Failed to fetch history:', error);
            setError('Failed to load history. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewRecord = async (id) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:3000/history/${id}`);
            setSelectedRecord(response.data);
        } catch (error) {
            console.error('Failed to fetch record details:', error);
            setError('Failed to load record details.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const closeModal = () => {
        setSelectedRecord(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className='history'>
            <div className="history-header">
                <h2>Request History</h2>
                <button 
                    onClick={fetchHistory} 
                    disabled={isLoading}
                    className="refresh-button"
                >
                    {isLoading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            {isLoading && !history.length ? (
                <div className="loading">Loading history...</div>
            ) : history.length === 0 ? (
                <div className="no-history">No request history found</div>
            ) : (
                <div className="history-list">
                    {history.map((record) => (
                        <div key={record._id} className='history-item'>
                            <div className="history-item-main">
                                <span className={`method method-${record.method?.toLowerCase()}`}>
                                    {record.method}
                                </span>
                                <span className="url" title={record.url}>
                                    {record.url}
                                </span>
                                <span className={`status status-${Math.floor(record.status / 100)}xx`}>
                                    {record.status}
                                </span>
                            </div>
                            <div className="history-item-meta">
                                <span className="timestamp">
                                    {formatDate(record.timestamp || record.createdAt)}
                                </span>
                                <button 
                                    onClick={() => handleViewRecord(record._id)}
                                    className="view-button"
                                    disabled={isLoading}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {selectedRecord && (
                <Record 
                    record={selectedRecord} 
                    onClose={closeModal} 
                />
            )}
        </div>
    );
}

export default History;