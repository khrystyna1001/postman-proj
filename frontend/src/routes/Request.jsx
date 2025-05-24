import '../App.css';
import Navigation from '../components/Navigation';
import Response from '../components/Response';

function Request() {

    return(
        <div className='request-container'>
            <Navigation />
            <h1>Request</h1>

            <Response />
        {/* <div className="history-section">
            <h2>History</h2>
            <ul>
            {history.map((item, index) => (
                <li key={index}>
                <button onClick={() => {
                    setUrl(item.url);
                    setMethod(item.method);
                    setHeaders(item.headers);
                    setBody(item.body);
                    setResponseHeaders(item.responseHeaders);
                    setResponseBody(item.responseBody);
                }}>
                    {item.method} {item.url}
                </button>
                </li>
            ))}
            </ul>
        </div> */}
    </div>
    );
}

export default Request;
