import React from 'react';
import './NavBar.css'

class NavBar extends React.Component {

  render () {

    return (
      <div>
        <nav className="navbar">
          <button onClick={() => this.props.uploadState(this.props.upload, false)}>Existing Data</button>
          <button onClick={() => this.props.uploadState(this.props.upload, true)}>Upload Data</button>
        </nav>
      </div>
    )
  }
}

export default NavBar;