import '../App.css';
import Navigation from '../components/Navigation';
import History from '../components/History';

function RequestsRecord() {
    return(
        <div className='requests-record'>
            <Navigation />
            <br />
            <br />
            <h1>Requests Record</h1>
            <div className="main-content">
                <History />
            </div>
        </div>
    );
}

export default RequestsRecord;