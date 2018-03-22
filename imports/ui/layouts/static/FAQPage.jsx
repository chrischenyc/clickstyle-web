import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';

const FAQPage = () => (
  <Container className="margin-top-40 margin-bottom-40">
    <Header as="h2">FAQ</Header>
    <p>
      When do I get charged?
      <br />
      We will charge you once the job is complete. This will allow you to add additional service on
      the day while the stylist is there.
    </p>
    <p>
      My stylist hasn&apos;t arrived yet and it&apos;s been more 30 minutes?
      <br />
      Please contact here and we will get back to as soon as possible.
    </p>
    <p>
      Can I add extra service on the day?
      <br />TBD
    </p>
    <p>
      How do I leave a review?
      <br />You can only leave a review once the job has been complete.<br />
    </p>
    <p>
      Can I edit my review?
      <br />
      No, but if do feel the review you left did injustice than contact us.
    </p>
    <p>
      How do I pay the stylist?
      <br />Currently we accept credit payments only.
    </p>
    <p>
      I want to cancel my booking and get a refund?
      <br />
      After login, you can find your bookings on <Link to="/users/bookings">Bookings</Link> page.
      You may contact customer service to cancel your booking as well. TBD: refund policy
    </p>
    <p>
      How safe is it for me to pay by credit on {Meteor.settings.public.appName}?
      <br />
      We do not store any credit card details on our website, we use a highly reputable payment
      system called Stripe that uses layers and layers of security and latest technology to secure
      every single details. All card numbers are encrypted and secured.
    </p>
    <p>
      How do I become a stylist on {Meteor.settings.public.appName}?
      <br />
      Click <Link to="/join">here</Link> to go stylist signup page.
    </p>

    <p>Last update: 19 March 2018.</p>
  </Container>
);

export default FAQPage;
