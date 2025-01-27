import { useMatch, useResolvedPath, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// assets
import './Navbar.css';
import logo from '../../assets/logo.svg';

const Navbar = () => {
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
            <div className="mr-4 flex space-x-4">
                <Link to="/" className="">
                    <button className="bg-orange-600 text-white p-2 rounded-lg pl-3 pr-3 cursor-pointer hover:bg-orange-700">
                        Log In
                    </button>
                </Link>

                <Link to="/signup">
                    <button className="border border-solid border-orange-600 p-2 rounded-lg pl-3 pr-3 text-orange-600 cursor-pointer hover:bg-gray-200">
                        Sign Up
                    </button>
                </Link>
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
