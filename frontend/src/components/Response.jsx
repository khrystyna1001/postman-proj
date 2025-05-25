import { useState } from 'react';
import axios from 'axios';

function Response() {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [headers, setHeaders] = useState('');
    const [body, setBody] = useState('');
    const [responseHeaders, setResponseHeaders] = useState('');
    const [responseBody, setResponseBody] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleShowMore = () => {
        setIsExpanded(!isExpanded);
    };

    const handleSend = async () => {
        try {
        const parsedHeaders = headers
            .split('\n')
            .filter(line => line.trim() !== '')
            .reduce((acc, line) => {
            const [key, value] = line.split(':').map(str => str.trim());
            acc[key] = value;
            return acc;
            }, {});
    
        const response = await axios.post('http://localhost:3000/proxy', {
            url: url.trim(),
            method,
            headers: parsedHeaders,
            body,
        });
    
        setResponseHeaders(JSON.stringify(response.headers, null, 2));
        setResponseBody(JSON.stringify(response.data, null, 2)); // Stringifying here is correct
        } catch (error) {
        setResponseHeaders(JSON.stringify(error.response ? error.response.headers : {}, null, 2));
        setResponseBody(JSON.stringify(error.response ? error.response.data : error.message, null, 2)); // Stringifying here is correct
        }
    };
    return(
        <div className='request-container'>
            <div className="request-section">
                <input type="text" placeholder="Enter URL" value={url} onChange={e => setUrl(e.target.value)} />
                <select value={method} onChange={e => setMethod(e.target.value)}>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                </select>
                <button onClick={handleSend}>Send</button>
            </div>
            <div className="headers-body">
                <textarea placeholder="Headers (key: value, one per line)" value={headers} onChange={e => setHeaders(e.target.value)} />
                <textarea placeholder="Body" value={body} onChange={e => setBody(e.target.value)} />
            </div>
            <div className="response-section">
                <pre style={{ margin: '15px' }}>Headers: {responseHeaders}</pre>
                <pre className={isExpanded ? 'expanded response-body' : 'response-body'} style={{ margin: '15px' }}>
                Body: {responseBody}
                </pre>
                {responseBody.length > 500 && (
                <button className="show-more-button" onClick={handleShowMore}>
                    {isExpanded ? 'Show Less' : 'Show More'}
                </button>
                )}
                
            </div>
        </div>
    );
}

export default Response;
