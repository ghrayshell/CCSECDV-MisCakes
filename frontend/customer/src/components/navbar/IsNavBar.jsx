import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import { Children } from 'react';
import Navbar from './Navbar';

const IsNavBar = (props) => {

    const location = useLocation();

    const [showNavBar, setShowNavBar] = useState(true)

    useEffect(()=> {
        console.log('this is location: ', location);

        if(location.pathname === '/' || location.pathname === '/signup'){
            setShowNavBar(false);
        } else {
            setShowNavBar(true);
        }

    }, [location])

    return (
        <div>{showNavBar && <Navbar />}
        
        </div>
    );
}

export default IsNavBar;