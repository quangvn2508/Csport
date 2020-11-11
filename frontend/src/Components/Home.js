import React from 'react';
import Navigation from './Navbar';

class Home extends React.Component {
    render() {
        return (
            <>
                <Navigation/>
                <div>This is home page</div>
            </>
            
        );
    }
}

export default Home;