import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { ShareButtons } from 'react-share';
import { Button, Icon } from 'semantic-ui-react';

const { FacebookShareButton, TwitterShareButton } = ShareButtons;

const StylistShareSection = props => (
  <div className="listing-share no-border">
    {props.authenticated &&
      props.userId &&
      props.userId !== props.stylist.owner && (
        <Button
          circular
          basic={!props.stylist.favoured}
          color="red"
          onClick={props.favourStylist}
          className="margin-bottom-10"
        >
          <Icon name="heart" />
          {props.stylist.favoured ? 'Un-favourite' : 'Favourite'}&nbsp;this stylist
        </Button>
      )}
    {props.stylist.favourites &&
      props.stylist.favourites.length > 0 && (
        <span>{props.stylist.favourites.length} favourites</span>
      )}

    {/* -- Share Buttons -- */}
    <ul className="share-buttons margin-top-20 margin-bottom-0">
      <li>
        <FacebookShareButton
          url={window.location.href}
          quote={`check this stylist I found on @${Meteor.settings.public.facebookId}`}
        >
          <Button circular color="facebook">
            Share on Facebook
          </Button>
        </FacebookShareButton>
      </li>
      <li>
        <TwitterShareButton
          url={window.location.href}
          title="check this stylist I found"
          via={Meteor.settings.public.twitterId}
        >
          <Button circular color="twitter">
            Tweet
          </Button>
        </TwitterShareButton>
      </li>
    </ul>
    <div className="clearfix" />
  </div>
);

StylistShareSection.defaultProps = {
  userId: null,
};

StylistShareSection.propTypes = {
  stylist: PropTypes.object.isRequired,
  favourStylist: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  userId: PropTypes.string,
};

export default StylistShareSection;
