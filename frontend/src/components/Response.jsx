import { useState } from 'react';
import axios from 'axios';
import './Response.css';

function Response() {
    // Request state
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [isLoading, setIsLoading] = useState(false);
    const [headers, setHeaders] = useState('Content-Type: application/json');
    const [body, setBody] = useState('{\n  "key": "value" \n}');
    
    // Response state
    const [response, setResponse] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleShowMore = () => setIsExpanded(!isExpanded);

    const formatHeaders = (headers) => {
        if (!headers) return null;
        try {
            const parsed = typeof headers === 'string' ? JSON.parse(headers) : headers;
            return Object.entries(parsed).map(([key, value]) => ({
                key,
                value: String(value)
            }));
        } catch (e) {
            return [];
        }
    };

    const formatJson = (data) => {
        try {
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            return String(data);
        }
    };

    const handleSend = async () => {
        if (!url.trim()) return;
        
        setIsLoading(true);
        setResponse(null);

        try {
            const parsedHeaders = headers
                .split('\n')
                .filter(line => line.trim() !== '')
                .reduce((acc, line) => {
                    const [key, ...values] = line.split(':');
                    const value = values.join(':').trim();
                    if (key && value) {
                        acc[key.trim()] = value;
                    }
                    return acc;
                }, {});

            const requestData = {
                url: url.trim(),
                method,
                headers: parsedHeaders,
            };

            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && body) {
                try {
                    requestData.body = JSON.parse(body);
                } catch (e) {
                    requestData.body = body;
                }
            }


            const response = await axios.post('http://localhost:3000/proxy', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    ...parsedHeaders
                }
            });

            setResponse({
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                data: response.data,
                time: new Date().toLocaleTimeString(),
                size: `${(JSON.stringify(response.data).length / 1024).toFixed(2)} KB`
            });

        } catch (error) {
            console.error('Request failed:', error);
            setResponse({
                status: error.response?.status || 'Error',
                statusText: error.response?.statusText || 'Network Error',
                headers: error.response?.headers || {},
                data: error.response?.data || error.message,
                time: new Date().toLocaleTimeString(),
                error: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderResponse = () => {
        if (!response) return null;

        return (
            <div className="response-container">
                <div className="response-header">
                    <div className="response-status">
                        <span className={`status-code status-${Math.floor(response.status / 100)}xx`}>
                            {response.status} {response.statusText}
                        </span>
                        <span className="response-time">
                            {response.time} • {response.size}
                        </span>
                    </div>
                    <div className="response-tabs">
                        <button 
                            onClick={() => setActiveTab('response')}
                        >
                            Response
                        </button>
                        <button 
                            onClick={() => setActiveTab('headers')}
                        >
                            Headers
                        </button>
                    </div>
                </div>

                <div className="response-content">
                        <div className="response-body">
                            <pre className={`json-display ${isExpanded ? 'expanded' : ''}`}>
                                {formatJson(response.data)}
                            </pre>
                            {JSON.stringify(response.data).length > 300 && (
                                <button 
                                    className="expand-button"
                                    onClick={handleShowMore}
                                >
                                    {isExpanded ? 'Show Less' : 'Show More'}
                                </button>
                            )}
                        </div>
                        <div className="response-headers">
                            {formatHeaders(response.headers).map(({ key, value }) => (
                                <div key={key} className="header-row">
                                    <span className="header-key">{key}:</span>
                                    <span className="header-value">{value}</span>
                                </div>
                            ))}
                        </div>
                </div>
            </div>
        );
    };

    return (
        <div className="request-container">
            <div className="request-controls">
                <div className="url-input-container">
                    <select 
                        className="method-select"
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                    >
                        {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].map((m) => (
                            <option key={m} value={m} className={`method-${m.toLowerCase()}`}>
                                {m}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        className="url-input"
                        placeholder="https://api.example.com/endpoint"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button 
                        className={`send-button ${isLoading ? 'loading' : ''}`}
                        onClick={handleSend}
                        disabled={isLoading || !url.trim()}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </div>

                <div className="request-body">
                    <div className="tab-content">
                        <h3>Headers</h3>
                        <textarea
                            className="headers-input"
                            placeholder="Content-Type: application/json\nAuthorization: Bearer token"
                            value={headers}
                            onChange={(e) => setHeaders(e.target.value)}
                            rows={4}
                            disabled={isLoading || !url.trim()}
                        />
                    </div>
                    <div className="tab-content">
                        <h3>Request Body</h3>
                        <textarea
                            className="body-input"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder={`{
                                "key": "value"
                                }`}
                            rows={10}
                            disabled={isLoading || !url.trim() || method === 'GET'}
                        />
                    </div>
                </div>
            </div>

            {isLoading && !response && (
                <div className="loading-indicator">
                    <div className="spinner"></div>
                    <span>Sending request...</span>
                </div>
            )}

            {response && renderResponse()}
        </div>
    );
}

export default Response;
