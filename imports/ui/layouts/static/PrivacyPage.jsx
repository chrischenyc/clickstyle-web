import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Container, Header } from 'semantic-ui-react';

const PrivacyPage = () => (
  <Container className="margin-top-40 margin-bottom-40">
    <div className="margin-bottom-40">
      <Header as="h2">Privacy Policy</Header>
      <p>
        Privacy Policy Introduction: {Meteor.settings.public.siteUrl} is a owned and registered
        domain under {Meteor.settings.public.legalName}. Merchant trademarks are the property of the
        respective merchant. We respect the privacy of our website users (you, your). This privacy
        policy explains how we may collect, store, use, and disclose personal information that you
        provide to us. By accessing and using this website you confirm your unconditional consent to
        us collecting, storing, using, and disclosing your personal information in the manner set
        out in this privacy policy.
        <br />
        <br />
        Terms of use: Your use of this website is governed by our terms of use. Accordingly, this
        privacy policy must be read in conjunction with our terms of use.
        <br />
        <br />
        Collecting your personal information: We may collect personal information from you
        (including, without limitation, your name, email address, phone number, and postal address)
        when you use this website. You may decide not to provide your personal information to us.
        However, if you do not provide it, we may not be able to provide you with access to certain
        information or products.
        <br />
        <br />
        Automated collection: When you visit this website, we may use automated tools and methods
        (such as cookies, sessions, and usage monitoring software) to collect certain information
        about your visit, including (without limitation). This information will be used in aggregate
        form to analyse how this website is being used (for example: to analyse usage patterns in
        order to improve this website). Except as set out in this privacy policy, we will not
        disclose any such information except in aggregate form.
        <br />
        <br />
        Children: The Website and our related Services are not proposed for kids under 13, and we
        don&apos;t intentionally gather data from kids younger than 13. Kids who are 13 or older
        should not present any individual data without the consent of their parents or guardians. By
        utilizing the Website and our related Services, you are agreeing to us that you are no less
        than 18.
        <br />
        <br />
        Cookies: This website may use cookies and sessions to provide you with certain services or
        functionality. Cookies and sessions may be used to identify you as an individual user of
        this website. We use this technology to, amongst other things. Accepting a cookie will not
        give us access to any data on your computer other than the data stored in the cookie.
        Although you may configure your web browser to not accept cookies, you may experience a loss
        of functionality as a result.
        <br />
        <br />
        Some of the banner ads displayed in the Website are provided by outside companies. These ads
        contain cookies. While {Meteor.settings.public.siteUrl} uses cookies in other parts of the
        Website, cookies received with banner ads are collected by {Meteor.settings.public.appName}{' '}
        advertisers and {Meteor.settings.public.appName} does not have access to this information.{' '}
        {Meteor.settings.public.appName} may engage third parties to provide cookies that collect
        information regarding website use. You may choose to decline cookies generally if your
        browser permits, but doing so may affect your use of the website and your ability to access
        certain features of the Website.
        <br />
        <br />
        Security: We are ceaselessly executing and refreshing regulatory, specialized, and physical
        safety efforts to help secure your data against unapproved access, misfortune, devastation,
        or change. In any case, the Internet isn&apos;t a 100% secure place so we can&apos;t ensure
        the security of the transmission or safety of your data.
        <br />
        <br />
        Additional collection: We may gather more extensive information if we are concerned, for
        example, about abnormal website usage patterns or website security breaches.
        <br />
        <br />
        Changes to this Privacy Policy {Meteor.settings.public.appName} may change its Privacy
        Policy every once in a while, and in
        {Meteor.settings.public.appName}&apos;s sole discretion. {Meteor.settings.public.appName}{' '}
        urges guests to as often as possible check this page for any progressions to its Privacy
        Policy. Your proceeded utilization of the Services after any adjustment in this Privacy
        Policy will constitute your acknowledgement of such change.
        <br />
        <br />
        Last update: 19 March 2018.
      </p>
    </div>
  </Container>
);

export default PrivacyPage;
