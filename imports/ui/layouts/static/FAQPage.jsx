import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';

const FAQPage = () => (
  <Container text className="margin-top-40 margin-bottom-40">
    <Header as="h2">FAQ</Header>

    <p>
      How do I become a stylist on {Meteor.settings.public.appName}?
      <br />
      <Link to="/join">Click here</Link> to go to stylist signup page.
    </p>

    <p>
      When do I get charged?
      <br />
      We will charge you once the job is complete. This will allow you to add additional service on
      the day while the stylist is there.
    </p>

    <p>
      My stylist hasn&apos;t arrived yet and it&apos;s been more 30 minutes?
      <br />
      Please <Link to="/contact">click here</Link> to contact us and we will get back to as soon as
      possible.
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
      <br />Currently we accept credit payments only. (More rewards points for your ;)
    </p>
    <p>
      I want to cancel my booking and get a refund?
      <br />
      After login, you can find your bookings on <Link to="/users/bookings">Bookings</Link> page.
      You may contact customer service to cancel your booking as well.
    </p>
    <p>
      How safe is it for me to pay by credit on {Meteor.settings.public.appName}?
      <br />
      We do not store any sensitive credit card details in our system, we use a highly reputable
      payment system called{' '}
      <a href="http://stripe.com/" target="_blank" rel="nonopener nonreferrer">
        Stripe
      </a>{' '}
      that uses layers and layers of security and latest technology to secure every single details.
      All card numbers are encrypted and secured.
    </p>

    <p>Last update: 11 June 2018.</p>
  </Container>
);

export default FAQPage;
