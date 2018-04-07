import React from 'react';

const HomeHowItWorks = () => (
  <div className="container">
    <div className="row">
      <div className="col-md-12">
        <h2 className="headline centered margin-top-75">How it works</h2>
      </div>
    </div>

    <div className="row icons-container">
      <div className="col-md-4">
        <div className="icon-box-2 with-line">
          <i className="im im-icon-Map2" />
          <h3>Find</h3>
          <p>
            Enter your desired service, location and appointment date &amp; time to see a list of
            available stylists
          </p>
        </div>
      </div>

      <div className="col-md-4">
        <div className="icon-box-2 with-line">
          <i className="im im-icon-Mail-withAtSign" />
          <h3>Book</h3>
          <p>
            Browse profiles to select your stylist, add services to your appointment and check out
            securely
          </p>
        </div>
      </div>

      <div className="col-md-4">
        <div className="icon-box-2">
          <i className="im im-icon-Checked-User" />
          <h3>Look and Feel AMAZING!</h3>
          <p>
            Your selected stylist will arrive at your desired location, whether its home, office or
            hotel with everything need to create your perfect look
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default HomeHowItWorks;
