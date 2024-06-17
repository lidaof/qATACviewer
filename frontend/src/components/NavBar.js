import React from 'react';
import './NavBar.css'

class NavBar extends React.Component {

  render () {

    return (
      <div>
        <nav className="navbar">
          <button onClick={() => this.props.changeOption(2)}>Existing Data</button>
          <button onClick={() => this.props.changeOption(3)}>Upload Data</button>
        </nav>
      </div>
    )
  }
}

export default NavBar;