import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { Segment, Container, Header } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

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

export default withTracker((props) => {
  // TODO: maybe we shouldn't subscribe to jobs, can we have a 'job' publication from server?
  const handle = Meteor.subscribe('jobs');

  return {
    currentUser: Meteor.user(),
    loading: !handle.ready(),
    job: Jobs.findOne({ _id: props.match.params.id }),
  };
})(ViewJob);
