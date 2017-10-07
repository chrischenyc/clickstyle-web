import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Segment, Container, Header } from 'semantic-ui-react';

import Jobs from '../../../api/Jobs';
import Loading from '../../components/Loading';

const ViewJob = ({ loading, job }) => {
  let content;
  if (loading) {
    content = <Loading />;
  } else if (job) {
    content = (
      <Segment vertical>
        <Container>
          <Header>{job.title}</Header>
        </Container>
      </Segment>
    );
  } else {
    content = <Redirect to="/" />;
  }

  return <div className="below-fixed-menu full-page">{content}</div>;
};

ViewJob.propTypes = {
  loading: PropTypes.bool.isRequired,
  job: PropTypes.object,
};

export default withTracker((props) => {
  const handle = Meteor.subscribe('job', props.match.params.id);

  return {
    loading: !handle.ready(),
    job: Jobs.findOne(),
  };
})(ViewJob);
