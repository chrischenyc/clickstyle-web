import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import LoadingBubbles from '../../components/LoadingBubbles';

import HomeStylistsItem from './HomeStylistsItem';

const slickSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

/**
 * convert [s1, s2, s3, ...] to [[s1, s2], [s3, s4]...]
 * @param {an array of stylist objects} stylists
 */
const pairStylists = (stylists) => {
  const pairs = [];

  for (let stylistIndex = 0; stylistIndex < stylists.length; stylistIndex += 2) {
    const pair = [stylists[stylistIndex]];
    if (stylistIndex + 1 < stylists.length) {
      pair.push(stylists[stylistIndex + 1]);
    }

    pairs.push(pair);
  }

  return pairs;
};

class HomeStylists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stylistsPairs: pairStylists(props.stylists),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({ stylistsPairs: pairStylists(nextProps.stylists) });
    }
  }

  render() {
    const { stylistsPairs } = this.state;

    return (
      <div className="container" style={{ margin: '8rem auto' }}>
        <div className="row">
          <h3 className="headline margin-bottom-35">
            {!this.props.locationBased && 'Stylists'}
            {this.props.locationBased && 'Stylists near by'}
          </h3>
        </div>

        <div className="row">
          {stylistsPairs.length === 0 && <LoadingBubbles />}

          {stylistsPairs.length > 0 && (
            <Slick {...slickSettings}>
              {stylistsPairs.map(stylistPair => (
                <div key={stylistPair[0].owner} style={{ padding: '0 4px' }}>
                  <HomeStylistsItem stylist={stylistPair[0]} />
                  <div style={{ padding: '4px 0' }} />
                  {stylistPair.length === 2 && <HomeStylistsItem stylist={stylistPair[1]} />}
                </div>
              ))}
            </Slick>
          )}
        </div>
      </div>
    );
  }
}

HomeStylists.propTypes = {
  stylists: PropTypes.array.isRequired,
  locationBased: PropTypes.bool.isRequired,
};

export default HomeStylists;
