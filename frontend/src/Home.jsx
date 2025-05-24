import './App.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="app">
        <nav>
          <h1>My Postman</h1>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/request">Request</Link>
            </li>
            <li>
              <Link to="/requests-record">Requests Record</Link>
            </li>
          </ul>
        </nav>
    </div>
  );
}

export default Home;
