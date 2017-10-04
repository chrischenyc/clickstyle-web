import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div>
        <Link to="/new-job">New Job</Link>
      </div>
    );
  }
}

export default Home;
