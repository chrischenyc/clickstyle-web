import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, List, Header } from 'semantic-ui-react';

const FAQPage = () => (
  <Container className="margin-top-40 margin-bottom-40">
    <div className="margin-bottom-40">
      <Header as="h2">FAQ</Header>
      <List size="large">
        <List.Item>
          <List.Header>When do I get charged?</List.Header>
          <List.Content>
            We will charge you once the job is complete. This will allow you to add additional
            service on the day while the stylist is there.
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Header>
            My stylist hasn&apos;t arrived yet and it&apos;s been more 30 minutes?
          </List.Header>
          <List.Content>
            Please contact here and we will get back to as soon as possible.
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Header>Can I add extra service on the day?</List.Header>
          <List.Content>TBD</List.Content>
        </List.Item>
        <List.Item>
          <List.Header>How do I leave a review?</List.Header>
          <List.Content>You can only leave a review once the job has been complete.</List.Content>
        </List.Item>
        <List.Item>
          <List.Header>Can I edit my review?</List.Header>
          <List.Content>
            No, but if do feel the review you left did injustice than contact us.
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Header>How do I pay the stylist?</List.Header>
          <List.Content>Currently we accept credit payments only.</List.Content>
        </List.Item>
        <List.Item>
          <List.Header>I want to cancel my booking and get a refund?</List.Header>
          <List.Content>
            After login, you can find your bookings on <Link to="/users/bookings">Bookings</Link>{' '}
            page. You may contact customer service to cancel your booking as well. TBD: refund
            policy
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Header>
            How safe is it for me to pay by credit on {Meteor.settings.public.appName}?
          </List.Header>
          <List.Content>
            We do not store any credit card details on our website, we use a highly reputable
            payment system called Stripe that uses layers and layers of security and latest
            technology to secure every single details. All card numbers are encrypted and secured.
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Header>How do I become a stylist on {Meteor.settings.public.appName}?</List.Header>
          <List.Content>
            Click <Link to="/join">here</Link> to go stylist signup page.
          </List.Content>
        </List.Item>
      </List>
    </div>
  </Container>
);

export default FAQPage;
