import React, { Component } from "react";
import { Link } from "react-router-dom";
import AccountsUIWrapper from "../ui/AccountsUIWrapper";

class Header extends Component {
  render() {
    return (
      <div>
        <p>
          <Link to="/">Home</Link>
        </p>
        <AccountsUIWrapper />
      </div>
    );
  }
}

export default Header;
