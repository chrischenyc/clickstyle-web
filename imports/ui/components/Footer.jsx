import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const {
    appName, facebookUrl, twitterUrl, instagramUrl, supportEmail,
  } = Meteor.settings.public;

  return (
    <div id="footer" className="dark">
      <div className="container">
        <div className="row">
          <div className="col-md-5 col-sm-6">
            <p>
              TODO: blurb for SEO - Morbi convallis bibendum urna ut viverra. Maecenas quis
              consequat libero, a feugiat eros. Nunc ut lacinia tortor morbi ultricies laoreet
              ullamcorper phasellus semper.
            </p>
            <p>&copy; 2017 {appName}. All Rights Reserved.</p>
          </div>

          <div className="col-md-4 col-sm-6 ">
            <ul className="footer-links">
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy</Link>
              </li>
              <li>
                <Link to="/terms">Terms &amp; Condition</Link>
              </li>
              <li>
                <Link to="/sitemap">Sitemap</Link>
              </li>
            </ul>

            <ul className="footer-links">
              <li>
                <Link to="/join">Become a stylist</Link>
              </li>
              <li>
                <Link to="/how-it-works">How it works</Link>
              </li>
              <li>
                <Link to="/help">Help</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
            </ul>
            <div className="clearfix" />
          </div>

          <div className="col-md-3  col-sm-12">
            <h4>Connect with us</h4>
            <div className="text-widget">
              <span>
                <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
              </span>
              <br />
            </div>

            <ul className="social-icons margin-top-20">
              <li>
                <a className="facebook" href={facebookUrl}>
                  <i className="icon-facebook" />
                </a>
              </li>
              <li>
                <a className="twitter" href={twitterUrl}>
                  <i className="icon-twitter" />
                </a>
              </li>
              <li>
                <a className="instagram" href={instagramUrl}>
                  <i className="icon-instagram" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="copyrights">
              Made with lots of&nbsp;<span role="img" aria-label="love">
                ❤️
                                     </span>&nbsp;&nbsp;in Melbourne
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
