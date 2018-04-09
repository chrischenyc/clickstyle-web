import React from 'react';
import Typist from 'react-typist';
import _ from 'lodash';

import SearchBar from '../../components/SearchBar/SearchBar';

const animatedKeywords = [
  'Airbrush Makeup',
  'Special Effects Makeup',
  'Prom Makeup',
  'Full Face Makeup',
  'Cut & Style',
  'Hair Updo',
  'Shampoo & Style',
  'Braids',
  'Full Hair Color',
  'Color Retouch',
  'Full Highlights',
  'Partial Highlights',
  'Permanent Hair Treatment',
  'Roller Set',
  'Silk Press',
  'Blowout',
  'Hair Extension',
  'Keratin Treatment',
  'Hair Styling',
  'Blowout with Iron',
  'Curling',
  'Beard Trim',
  "Men's Haircut",
  'Hot Towel Massage',
  'Cut & Side design',
  'Children Hair Cut',
  'Bridal Makeup',
  'Bridal Wedding Package',
  'Bridal Makeup & Hair Styling',
  'Bridal Hair Styling',
  'Bridesmaid Hair Styling',
  'Bridesmaid Makeup',
  'Bridal Trials',
  'Full Set Acrylic',
  'Refill Acrylic Nails',
  'Gel Manicure',
  'Pedicure',
  'Nail Art',
  'Spa Pedicure',
  'Manicure',
  'Eyebrow Threading',
  'Eyebrow Tinting',
  'Eyebrow Shaping',
  'Waxing Lashes',
  'Bottom Lashes',
  'Mink Lashes',
  'Eyelash Extension',
  'Massage',
  'Foot Massage',
  'Hot Stone Massage',
  'Aromatherapy Massage',
  'Remedial Massage',
  'Prenatal Massage',
  'Full Body Airbrush Tan',
  'Half Body Airbrush Tan',
  'Brazilian',
  'Bikini Line',
  'Full Arm Wax',
  'Full Leg Wax',
  'Full Face Wax',
  'Half Arm Wax',
  'Half Leg Wax',
  'Underarm Wax',
  'Facial',
  'Acne Facial',
];

const HomeSearch = () => (
  <div
    className="main-search-container dark-overlay"
    style={{ backgroundImage: "url('images/main-search-bg.jpg')" }}
  >
    <div className="main-search-inner">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2>Book my personalised stylist</h2>
            <h4>
              <Typist>
                Search here for&nbsp;
                {_.shuffle(animatedKeywords).map(keyword => (
                  <span key={keyword}>
                    {keyword}
                    <Typist.Backspace count={keyword.length} delay={keyword.length * 40} />
                  </span>
                ))}
                <span>my style!</span>
              </Typist>
            </h4>
          </div>

          <div className="col-md-12 margin-top-20">
            <SearchBar />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HomeSearch;
