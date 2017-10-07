import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';

import TopBanner from './TopBanner';
import JobsList from '../../components/JobsList';

import Jobs from '../../../api/Jobs';

const Home = props => (
  <div>
    <TopBanner />
    <JobsList loading={props.jobsLoading} jobs={props.jobs} />
  </div>
);

Home.propTypes = {
  jobsLoading: PropTypes.bool.isRequired,
  jobs: PropTypes.arrayOf(Jobs).isRequired,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('jobs');

  return {
    jobsLoading: !handle.ready(),
    jobs: Jobs.find({}).fetch(),
  };
})(Home);
