import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';

import Profiles from '../../../api/profiles/profiles';
import ProfilePage from './ProfilePage';

const Profile = props => <ProfilePage profile={props.profile} />;

Profile.defaultProps = {
  profile: null,
};

Profile.propTypes = {
  profile: PropTypes.object,
};

export default withTracker((props) => {
  const { _id } = props.match.params;
  const handle = Meteor.subscribe('profiles', _id);

  return {
    ready: handle.ready(),
    profile: Profiles.findOne({ _id }),
  };
})(Profile);
