import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import JobsList from './JobsList';
import Loading from '../../components/Loading';

import Jobs from '../../../api/Jobs';

// TODO: add search filters
const JobsPage = props =>
  (props.jobsLoading ? (
    <Loading />
  ) : (
    <Segment vertical>
      <JobsList loading={props.jobsLoading} jobs={props.jobs} />
    </Segment>
  ));

JobsPage.propTypes = {
  jobsLoading: PropTypes.bool.isRequired,
  jobs: PropTypes.array.isRequired,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('jobs');

  return {
    jobsLoading: !handle.ready(),
    jobs: Jobs.find({}).fetch(),
  };
})(JobsPage);
