import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import BannerSegment from './BannerSegment';
import HowItWorksSegment from './HowItWorksSegment';
import ArticlesSegment from './ArticlesSegment';
import JobsList from '../job/JobsList';

import Jobs from '../../../api/Jobs';

const HomePage = props => (
  <div className="below-fixed-menu">
    <BannerSegment />

    {/* TODO: anchor doesn't work */}
    <div id="how-it-works">
      <HowItWorksSegment />
    </div>

    <ArticlesSegment />

    <Segment
      textAlign="center"
      style={{
        padding: '2em 0em',
      }}
      vertical
    >
      <JobsList jobs={props.jobs} />
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
