import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Button, Container, Header, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import JobsList from '../components/JobsList';

import Jobs from '../../api/Jobs';

class Home extends Component {
  render() {
    return (
      <div>
        <Segment
          inverted
          textAlign="center"
          style={{
            padding: '8em 0em',
            backgroundImage:
              'url("https://images.unsplash.com/photo-1500840216050-6ffa99d75160?dpr=1&auto=compress,format&fit=crop&w=1080&h=&q=50&cs=tinysrgb&crop=")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
          vertical
        >
          <Container text>
            <Header
              as="h1"
              content="Stylesquard"
              inverted
              style={{
                fontSize: '4em',
                fontWeight: 'thick',
                fontStyle: 'italic',
                marginTop: '1em',
              }}
            />
            <Header
              as="h2"
              content="Professional Beauty Service"
              inverted
              style={{
                fontSize: '1.7em',
                fontWeight: 'normal',
                marginBottom: 0,
              }}
            />
            <Header
              as="h2"
              content="any where you want"
              inverted
              style={{
                fontSize: '1.7em',
                fontWeight: 'normal',
                marginTop: 0,
              }}
            />

            <Link to="/jobs/new">
              <Button size="huge" color="teal">
                Book Now
              </Button>
            </Link>
          </Container>
        </Segment>

        <JobsList loading={this.props.listLoading} jobs={this.props.jobs} />
      </div>
    );
  }
}

export default withTracker(() => {
  const handle = Meteor.subscribe('jobs');

  return {
    listLoading: !handle.ready(),
    jobs: Jobs.find({}).fetch(),
  };
})(Home);
