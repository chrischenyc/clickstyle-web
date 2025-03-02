import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';

import { ServiceNameToSEOName } from '../../modules/seo-name';
import { yearString } from '../../modules/format-date';

const Footer = () => {
  const {
    appName,
    legalName,
    about,
    facebookUrl,
    twitterUrl,
    instagramUrl,
    supportEmail,
  } = Meteor.settings.public;

  const services = [
    'Make Up',
    'Hair - Women',
    'Hair - Men',
    'Hair - Children',
    'Wedding',
    'Nails',
    'Eyebrow',
    'Eyelash',
    'Massage & Spa - Women',
    'Massage & Spa - Men',
    'Tanning',
    'Waxing',
    'Skincare treatment',
  ];

  return (
    <div id="footer" className="dark">
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-sm-6">
            <h4>{appName}</h4>
            <ul className="footer-links">
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy</Link>
              </li>
              <li>
                <Link to="/terms">Terms</Link>
              </li>
              <li>
                <Link to="/join">Become a stylist</Link>
              </li>
            </ul>

            <div className="clearfix" />
          </div>

          <div className="col-md-3 col-sm-6">
            <h4>Browse services</h4>
            <ul className="footer-links">
              {services.map(service => (
                <li key={service}>
                  <Link to={`/stylists/${ServiceNameToSEOName(service)}`}>{service}</Link>
                </li>
              ))}
            </ul>

            <div className="clearfix" />
          </div>

          <div className="col-md-3 col-sm-12">
            <h4>Connect with us</h4>
            <div className="text-widget">
              <span>
                <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
              </span>
              <br />
            </div>

            <ul className="social-icons margin-top-20">
              <li>
                <a className="facebook" href={facebookUrl} target="_blank">
                  <i className="icon-facebook" />
                </a>
              </li>
              <li>
                <a className="twitter" href={twitterUrl} target="_blank">
                  <i className="icon-twitter" />
                </a>
              </li>
              <li>
                <a className="instagram" href={instagramUrl} target="_blank">
                  <i className="icon-instagram" />
                </a>
              </li>
            </ul>

            <div className="clearfix" />
          </div>

          <div className="col-md-3 col-sm-12">
            <p>{about}</p>
            <p>
              &copy; 2017-{yearString(new Date())} {legalName}. All Rights Reserved.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="copyrights">
              Made with lots of&nbsp;<img src={`${Meteor.settings.public.CDN}heart.png`} alt="" />&nbsp;in
              Melbourne
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
