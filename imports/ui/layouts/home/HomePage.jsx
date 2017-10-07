import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';

import TopBanner from './TopBanner';
import JobsList from '../job/JobsList';

import Jobs from '../../../api/Jobs';

const HomePage = props => (
  <div>
    <TopBanner />
    <JobsList loading={props.jobsLoading} jobs={props.jobs} />
  </div>
);

HomePage.propTypes = {
  jobsLoading: PropTypes.bool.isRequired,
  jobs: PropTypes.array.isRequired,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('jobs');

  return {
    jobsLoading: !handle.ready(),
    jobs: Jobs.find({}).fetch(),
  };
})(HomePage);
