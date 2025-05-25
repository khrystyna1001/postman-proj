import '../App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function History() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/history');
                setHistory(response.data);
            } catch (error) {
                console.error(`Failed to fetch history: ${error}`);
            }
        }
        fetchHistory();
    }, []);


    return (
        <div className='history'>
            <h2>History</h2>
            {history.map((record, index) => (
                <div key={index} className='history-item'>
                    <p><strong>URL: </strong>{record.url}</p>
                    <p><strong>Method: </strong>{record.method}</p>
                    {record.body && <p><strong>Body: </strong>{JSON.stringify(record.body)}</p>}
                    <p><strong>Status: </strong>{record.status}</p>
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default History;