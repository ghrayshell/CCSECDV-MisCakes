import { useMatch, useResolvedPath, Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {useState, useEffect} from 'react';

// assets
import './Navbar.css';
import logo from '../../assets/logo.svg';

const Navbar = () => {
    const [currentUser, setCurrentUser] = useState('');

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
          const res = await fetch('http://localhost:4000/logout', { 
            method: 'GET', 
            credentials: 'include' // to send the session cookie
          });
      
          if (res.ok) {
            // Redirect to home or login page after logging out
            navigate('/'); // Or use React Router's navigate() if needed
          } else {
            console.error('Logout failed');
          }
        } catch (error) {
          console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        fetch('http://localhost:4000/current_user', {
            method: 'GET',
            credentials: 'include'
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.currentUser) setCurrentUser(data.currentUser);
          })
          .catch((err) => console.error('Error fetching user:', err));
      }, []);

      const [isDropdownOpen, setIsDropdownOpen] = useState(false);

      const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
      };

    return (
        <header>
     
            <img src={logo} />
            <nav>
                <ul>
                    <CustomLink to="/home">home</CustomLink>
                    <CustomLink to="/ourstory">our story</CustomLink>
                    <CustomLink id="ourProducts" to="/ourproducts">our products</CustomLink>
                    <CustomLink to="/contactus">contact us</CustomLink>
                    <CustomLink to="/vieworders">view orders</CustomLink>
                </ul>
            </nav>
            <div className="relative mr-4 flex items-center space-x-4">
            {/* Hello, User text with dropdown toggle */}
            <div
                onClick={toggleDropdown}
                className="flex items-center cursor-pointer text-2xl font-semibold text-gray-800"
            >
                Hello, <span className="text-orange-600 ml-1">{currentUser}</span>
                <span className="ml-2 text-gray-600 text-sm">&#9660;</span> {/* Smaller downward arrow */}
            </div>

            {/* Dropdown menu */}
            {isDropdownOpen && (
                <div className="absolute mt-20 mr-4 w-30 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-orange-600 hover:bg-gray-200 rounded-lg"
                >
                    Logout
                </button>
                </div>
            )}
            </div>
            
        </header>
    );
};

const CustomLink = ({ to, children, ...props }) => {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className={isActive ? 'active' : ''}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    );
};

CustomLink.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default Navbar;
