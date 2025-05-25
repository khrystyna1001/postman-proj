import '../App.css';
import Navigation from '../components/Navigation';
import Response from '../components/Response';

function Request() {

    return(
        <div className='request-container'>
            <Navigation />
            <br />
            <br />
            <h1>Request</h1>
            <div className="main-content">
                <Response />
            </div>
        </div>
    );
}

export default Request;
