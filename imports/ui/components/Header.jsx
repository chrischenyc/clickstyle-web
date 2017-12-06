import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { closeModal } from '../../modules/client/redux/modal';
import ModalLink from '../components/ModalLink';
import Login from '../layouts/user/Login/Login';
import SignUp from '../layouts/user/SignUp/SignUp';
import ScaledImageURL from '../../modules/scaled-image-url';

/**
 * Header has a desktop/tablet version and a mobile phone version
 */
const Header = (props) => {
  const { authenticated, firstName, photo } = props;

  return (
    <header id="header-container">
      <div id="header">
        <div className="container">
          {/* Start of left-side */}
          <div className="left-side">
            <div id="logo">
              <Link to="/">
                <img src="images/logo.png" alt="stylesquad" />
              </Link>
            </div>

            <div className="mmenu-trigger">
              <button className="hamburger hamburger--collapse" type="button">
                <span className="hamburger-box">
                  <span className="hamburger-inner" />
                </span>
              </button>
            </div>

            {/* Start of nav menu, to be manipulated by mmenu */}
            <nav id="navigation" className="style-1">
              <ul id="responsive">
                {/* Join */}
                <li>
                  <Link to="/join">Become a stylist</Link>
                </li>

                {/* Help */}
                <li>
                  <Link to="/help">Help</Link>
                </li>
              </ul>
            </nav>
            {/* End of nav menu */}

            <div className="clearfix" />
          </div>
          {/* End of left-side */}

          {/* Start of right-side */}
          <div className="right-side">
            <div className="header-widget">
              {!authenticated && (
                <ModalLink
                  className="sign-in"
                  to="/signup"
                  component={
                    <SignUp
                      modal
                      onLoggedIn={() => {
                        props.closeModal();
                      }}
                    />
                  }
                  title="Join us"
                >
                  Sign Up
                </ModalLink>
              )}

              {!authenticated && (
                <ModalLink
                  className="sign-in"
                  to="/login"
                  component={
                    <Login
                      modal
                      onLoggedIn={() => {
                        props.closeModal();
                      }}
                    />
                  }
                  title="Log in to continue"
                >
                  Log In
                </ModalLink>
              )}

              {/* Start of user menu */}
              {authenticated && (
                <div className="user-menu">
                  <div className="user-name">
                    <span>
                      <img src={ScaledImageURL(photo, 'tiny')} alt="" />
                    </span>
                    {firstName}
                  </div>
                  <ul>
                    <li>
                      <Link to="/dashboard">Dashboard</Link>
                    </li>

                    <li>
                      <a
                        href="#logout"
                        onClick={() => {
                          Meteor.logout();
                        }}
                      >
                        <i className="sl sl-icon-power" /> Logout
                      </a>
                    </li>
                  </ul>
                </div>
              )}
              {/* End of user menu */}
            </div>
          </div>
          {/* End of right-side */}
        </div>
      </div>
    </header>
  );
};

// const Header = props => (
//   <div>
//     <Responsive minWidth={Responsive.onlyTablet.minWidth}>
//       <Menu fixed="top" size="massive" inverted borderless stackable>
//         <Menu.Item as={Link} to="/">
//           {Meteor.settings.public.appName}
//         </Menu.Item>

//         {props.authenticated ? (
//           <Menu.Menu position="right">
//             {!props.isStylist && <StylistLandingPageLink />}

//             <Dropdown text={props.firstName || 'Account'} className="item">
//               <Dropdown.Menu>
//                 <Dropdown.Item as={Link} to="/dashboard" text="Dashboard" />
//                 <Dropdown.Item as={Link} to="/inbox" text="Inbox" />
//                 <Dropdown.Item as={Link} to="/profiles/edit" text="Profile" />
//                 <Dropdown.Item as={Link} to="/settings" text="Settings" />
//                 <Dropdown.Item
//                   text="Logout"
//                   onClick={() => {
//                     Meteor.logout();
//                   }}
//                 />
//               </Dropdown.Menu>
//             </Dropdown>
//           </Menu.Menu>
//         ) : (
//           <Menu.Menu position="right">
//             {!props.isStylist && <StylistLandingPageLink />}

//             <Menu.Item
//               as={ModalLink}
//               to="/signup"
//               component={
//                 <SignUp
//                   modal
//                   onLoggedIn={() => {
//                     props.closeModal();
//                   }}
//                 />
//               }
//               title="Join us"
//             >
//               Sign Up
//             </Menu.Item>

//             <Menu.Item
//               as={ModalLink}
//               to="/login"
//               component={
//                 <Login
//                   modal
//                   onLoggedIn={() => {
//                     props.closeModal();
//                   }}
//                 />
//               }
//               title="Log in to continue"
//             >
//               Log In
//             </Menu.Item>
//           </Menu.Menu>
//         )}
//       </Menu>
//     </Responsive>

//     <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
//       <Menu fixed="top" size="massive" inverted borderless>
//         <Menu.Item as={Link} to="/">
//           {Meteor.settings.public.appName}
//         </Menu.Item>

//         <Menu.Menu position="right">
//           <Dropdown icon="content" className="item">
//             <Dropdown.Menu>
//               {!props.isStylist && <Dropdown.Item as={Link} to="/join" text="Are you a stylist?" />}
//               <Dropdown.Divider />

//               {props.authenticated && <Dropdown.Header>Account</Dropdown.Header>}
//               {props.authenticated && <Dropdown.Item as={Link} to="/dashboard" text="Dashboard" />}
//               {props.authenticated && <Dropdown.Item as={Link} to="/inbox" text="Inbox" />}
//               {props.authenticated && (
//                 <Dropdown.Item as={Link} to="/profiles/edit" text="Profile" />
//               )}
//               {props.authenticated && <Dropdown.Item as={Link} to="/settings" text="Settings" />}
//               {props.authenticated && <Dropdown.Divider />}

//               {/* {props.authenticated && <Dropdown.Header>My Bookings</Dropdown.Header>}
//               {props.authenticated && <Dropdown.Item as={Link} to="/bookings" text="Bookings" />}
//               {props.authenticated && (
//                 <Dropdown.Item as={Link} to="/favourites" text="My Favourites" />
//               )}
//               {props.authenticated && <Dropdown.Divider />} */}

//               {props.isStylist && <Dropdown.Header>Stylist</Dropdown.Header>}
//               {props.isStylist && (
//                 <Dropdown.Item as={Link} to="/stylists/me/services" text="Service & Price List" />
//               )}
//               {props.isStylist && (
//                 <Dropdown.Item as={Link} to="/stylists/me/available-time" text="Calendar" />
//               )}
//               {props.isStylist && (
//                 <Dropdown.Item as={Link} to="/stylists/me/available-areas" text="Areas" />
//               )}
//               {props.isStylist && <Dropdown.Divider />}

//               {props.authenticated && (
//                 <Dropdown.Item
//                   text="Logout"
//                   onClick={() => {
//                     Meteor.logout();
//                   }}
//                 />
//               )}

//               {!props.authenticated && (
//                 <Dropdown.Item as={Link} to="/signup">
//                   Sign up
//                 </Dropdown.Item>
//               )}

//               {!props.authenticated && (
//                 <Dropdown.Item as={Link} to="/login">
//                   Log in
//                 </Dropdown.Item>
//               )}
//             </Dropdown.Menu>
//           </Dropdown>
//         </Menu.Menu>
//       </Menu>
//     </Responsive>
//   </div>
// );

Header.defaultProps = {
  firstName: '',
  photo: '',
};

Header.propTypes = {
  closeModal: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  firstName: PropTypes.string,
  photo: PropTypes.string,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  firstName: state.profile && state.profile.name && state.profile.name.first,
  photo: state.profile && state.profile.photo,
});

export default connect(mapStateToProps, { closeModal })(Header);
