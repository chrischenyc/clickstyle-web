import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Container, Header } from 'semantic-ui-react';

const AboutPage = () => (
  <Container text className="margin-top-40 margin-bottom-40">
    <Header as="h2">Our Story</Header>

    <p>
      We started building {Meteor.settings.public.appName} in November of 2017 after doing months
      and months of research by talking directly to potential customers and potential stylist and
      along the way we discovered many new problems on top of the existing ones and that&apos;s when
      it all sparked that we should build {Meteor.settings.public.appName}. We are based in
      Melbourne with four passionate entrepreneurs who love solving problems and working with
      challenges. We bring together a diverse range off talents and skills that compliments{' '}
      {Meteor.settings.public.appName} and building it from scratch in Melbourne.
    </p>

    <p>
      Everything we do starts with our customers in mind because after all we are building it for
      you. We truly believe mobile beauty is the future not only because of time and convenience but
      saves a lot of travel. As population increases so does traffic and on average a person spends
      approximately 28 - 34 mins to travel to their local salons. (Of course this includes parking
      and everything in between).
    </p>

    <p>
      Imagine if $50,000 magically appeared in your bank account everyday and you could use it up
      but the remaining balance does not carry forward after each day ends, I bet you would use
      every cent of it, anyone would and guess what, Time is such a commodity that comes into our
      lives each day and any remaining time does not carry forward. Spend wisely :D
    </p>

    <p>
      The {Meteor.settings.public.appName} team is excited to bring to you in coming months new
      features, tools and more that will enhance your experience with{' '}
      {Meteor.settings.public.appName}. There is soo much we want to tell you about
      {Meteor.settings.public.appName}&apos;s upcoming features and idea&apos;s but unfortunately we
      can&apos;t just yet.
    </p>

    <p>
      For us {Meteor.settings.public.appName} is not a business, in fact we don&apos;t feel like we
      are working, its pure passion and that&apos;s where our energy comes from. We really hope from
      the bottom of our hearts that you have the best experience from our service and that we can
      continue to pamper you.
    </p>

    <p>
      At any point in time you are not satisfied or have any issues than please don&apos;t hesitate
      to contact us, we will do our very best to resolve your issue, that&apos;s our promise to you.
    </p>

    <p>
      Lots of love <br />
      {Meteor.settings.public.appName} Family
    </p>
  </Container>
);

export default AboutPage;
