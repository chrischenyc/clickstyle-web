import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Button, Container, Header, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import JobsList from './JobsList';

class Home extends Component {
  render() {
    return (
      <div>
        <Segment
          inverted
          textAlign="center"
          style={{
            minHeight: 500,
            padding: '2em 0em',
            backgroundImage: 'url(images/meteor.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
          vertical
        >
          <Container text>
            <Header
              as="h1"
              content="Just a Playground"
              inverted
              style={{
                fontSize: '4em',
                fontWeight: 'normal',
                marginBottom: 0,
                marginTop: '3em',
              }}
            />
            <Header
              as="h2"
              content="Meteor + React + Semantic.UI"
              inverted
              style={{
                fontSize: '1.7em',
                fontWeight: 'normal',
              }}
            />

            <Link to="/new-job">
              <Button primary size="huge" disabled={!this.props.currentUser}>
                Create Job <Icon name="right add" />
              </Button>
            </Link>
          </Container>
        </Segment>
        <JobsList />
      </div>
    );
  }
}

export default withTracker(() => ({
  currentUser: Meteor.user(),
}))(Home);
