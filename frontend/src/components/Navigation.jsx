import '../App.css';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <div className="app">
        <nav>
          <h2>My Postman</h2>
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

export default Navigation;