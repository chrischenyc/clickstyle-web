import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import TopBanner from './TopBanner';
import HowItWorks from './HowItWorks';
import Articles from './Articles';
import JobsList from '../job/JobsList';

import Jobs from '../../../api/Jobs';

const HomePage = props => (
  <div>
    <TopBanner />

    {/* TODO: anchor doesn't work */}
    <div id="how-it-works">
      <HowItWorks />
    </div>

    <Articles />

    <Segment
      textAlign="center"
      style={{
        padding: '2em 0em',
      }}
      vertical
    >
      <JobsList loading={props.jobsLoading} jobs={props.jobs} />
    </Segment>
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
