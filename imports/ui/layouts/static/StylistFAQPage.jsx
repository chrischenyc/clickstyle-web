import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, List, Header } from 'semantic-ui-react';

const StylistFAQPage = () => (
  <Container className="margin-top-40 margin-bottom-40">
    <Header as="h2">FAQ for Stylist</Header>
    <List size="large">
      <List.Item>
        <List.Header>
          If I can&apos;t make it to the appointment at last minute due to some emergency, what do I
          do?
        </List.Header>
        <List.Content>
          Call the {Meteor.settings.public.appName} service desk to explain the situation. We will
          do our best to solve this. We would encourage not to leave it till last minute about
          notifying us, please advise us at the earliest possible.
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Header>How do my clients leave review?</List.Header>
        <List.Content>
          Clients will be able to leave a review only after the service has been completed.
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Header>Can anyone leave a review for me?</List.Header>
        <List.Content>
          No, only clients that you accept via {Meteor.settings.public.appName} and provide service
          to.
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Header>Does review and ratings really matter?</List.Header>
        <List.Content>
          Yes, not only for customers but also for search algorithms we set. We are working
          continuously to reward stylist with good reviews and ratings. For e.g being able to appear
          on top of the search results to being featured on our emails to customers. We will
          introduce many other features to enhance your use of this platform and also features that
          will increase your revenue.
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Header>How do I add or edit my service?</List.Header>
        <List.Content>
          Once you login, click on the drop down arrow next your name on homepage and select
          Dashboard Then under the stylist, click on “services” Edit the services, adjust prices and
          description Click save
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Header>How do I set my available hours?</List.Header>
        <List.Content>
          Once you login, click on the drop down arrow next your name on homepage and select
          Dashboard Then under the stylist, click on “Calendar” Edit the hours in “available from”
          and “available to” hours. If you do not wish to work any particular day than you can swipe
          left on the blue slider under the “Open” column. Click save
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Header>How do I manage photos?</List.Header>
        <List.Content>
          From your dashboard click on “Portfolio” To add photos click “Upload Photo” than click
          “Save” To delete a photo, hover your mouse over the photo and the delete icon will show
          up, simple click the delete button and click “Save” To manage your profile photo click on
          “Profile” from your dashboard Click on “upload photo” underneath the blank image Upload
          photo from your device and click “Save”
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Header>How and when do I get paid?</List.Header>
        <List.Content>
          Currently we are doing fortnightly payments direct into your account. Please ensure your
          account details are accurate
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Header>How much does {Meteor.settings.public.appName} charge?</List.Header>
        <List.Content>We take 12.5% commission per transaction</List.Content>
      </List.Item>
      <List.Item>
        <List.Header>
          How will my clients find me through {Meteor.settings.public.appName}?
        </List.Header>
        <List.Content>
          By simply typing your name in the search bar in home page and click search.
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Header>
          How can I promote my {Meteor.settings.public.appName} profile to attract clients?
        </List.Header>
        <List.Content>
          By featuring on our website you are already reaching a wider audience but going the extra
          mile is where the cream is. Below are some tips from our head of marketing. ( Research
          shows missed appointments rack up $1000&apos;s of dollars a year, that&apos;s a lot of
          money to lose)
          <List>
            <List.Item>
              Social Media Profile:​ Add your profile URL to all your social media profiles such as
              Facebook, Twitter and Instagram. Most profiles have a section to add a link or you can
              also insert in the about me section of your social media profile.
            </List.Item>
            <List.Item>
              Sharing on social media:​ Sharing is a very powerful tool and many underestimate the
              power of sharing, this also helps you in google rankings and being discovered on
              google search results. In your {Meteor.settings.public.appName} profile, click on the
              social media icon to share.
            </List.Item>
            <List.Item>
              Print the URL of your profile on your business Add the URL on your website:​ By doing
              this your customers can easily book on your available time 24/7. This can save you a
              lot of time and money especially if you miss a call or travelling overseas.
            </List.Item>
            <List.Item>
              Writing blog post: ​This may sound boring and time consuming but it works magic, in
              fact this is a great way to connect with a personal touch to your potential clients.
              Sharing your personal tips and experiences or just a great story about your journey to
              being a stylist touches hearts. We welcome any stylist to write a blog and we will
              happily publish that on our blog page with a link to your profile and also mention the
              blog post on our email marketing campaign and to top it up we will share the article
              on {Meteor.settings.public.appName} social media page. (PS: we don&apos;t accept blogs
              post that you have written and published elsewhere)
            </List.Item>
          </List>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Header>
          As stylist how do I contact {Meteor.settings.public.appName} admin?
        </List.Header>
        <List.Content>
          The best way to reach out is using the contact form on the{' '}
          <Link to="/contact">contact us</Link> page. We check our emails daily. For any urgent
          matter you can contact Vishal on 0401380380. Please note: Only call the mobile for really
          urgent matter.
        </List.Content>
      </List.Item>
    </List>
  </Container>
);

export default StylistFAQPage;
