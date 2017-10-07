import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Segment, Container, Header } from 'semantic-ui-react';

import Jobs from '../../../api/Jobs';
import Loading from '../../components/Loading';

const ViewJob = ({ loading, job }) => {
  if (loading) {
    return <Loading />;
  } else if (job) {
    return (
      <div className="full-page">
        <Segment
          style={{
            padding: '8em 0em',
          }}
          vertical
        >
          <Container>
            <Header>{job.title}</Header>
          </Container>
        </Segment>
      </div>
    );
  }
  return <Redirect to="/" />;
};

ViewJob.propTypes = {
  loading: PropTypes.bool.isRequired,
  job: PropTypes.instanceOf(Jobs),
};

export default withTracker((props) => {
  const handle = Meteor.subscribe('job', props.match.params.id);

  return {
    loading: !handle.ready(),
    job: Jobs.findOne(),
  };
})(ViewJob);
