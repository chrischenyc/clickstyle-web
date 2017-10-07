import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';

import JobsList from './JobsList';
import Loading from '../../components/Loading';

import Jobs from '../../../api/Jobs';

// TODO: add search filters
const JobsPage = props =>
  (props.jobsLoading ? <Loading /> : <JobsList loading={props.jobsLoading} jobs={props.jobs} />);

JobsPage.propTypes = {
  jobsLoading: PropTypes.bool.isRequired,
  jobs: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('jobs');

  return {
    jobsLoading: !handle.ready(),
    jobs: Jobs.find({}).fetch(),
  };
})(JobsPage);
