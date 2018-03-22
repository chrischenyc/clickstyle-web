import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';

const TermsPage = () => (
  <Container>
    <div className="margin-top-40 margin-bottom-40">
      <Header as="h2">
        {Meteor.settings.public.appName} Terms of Service For Clients &amp; Stylist
      </Header>

      <p>
        Welcome to <Link to="/">{Meteor.settings.public.siteUrl}</Link>, a website owned by{' '}
        {Meteor.settings.public.legalName}. Below we have outlined terms of service and use for both
        clients and stylist. For any further clarity please contact us through the contact form
        located on <Link to="/contact">contact us</Link> page.
      </p>

      <p>
        Terms<br />
        By accessing the website at <Link to="/">{Meteor.settings.public.siteUrl}</Link>, you are
        agreeing to be bound by these terms of service, all applicable laws and regulations, and
        agree that you are responsible for compliance with any applicable local laws. If you do not
        agree with any of these terms, you are prohibited from using or accessing this site. The
        materials contained in this website are protected by applicable copyright and trademark law.
      </p>

      <p>
        Use License<br />
        Permission is granted to temporarily download one copy of the materials (information or
        software) on {Meteor.settings.public.appName}&apos;s website for personal, non-commercial
        transitory viewing only. This is the grant of a license, not a transfer of title, and under
        this license you may not:
        <ol>
          <li>modify or copy the materials;</li>
          <li>
            use the materials for any commercial purpose, or for any public display (commercial or
            non-commercial);
          </li>
          <li>
            attempt to decompile or reverse engineer any software contained on{' '}
            {Meteor.settings.public.appName}&apos;s website;
          </li>
          <li>remove any copyright or other proprietary notations from the materials; or</li>
          <li>
            transfer the materials to another person or &quot;mirror&quot; the materials on any
            other server.
          </li>
        </ol>
        <br />
        This license shall automatically terminate if you violate any of these restrictions and may
        be terminated by {Meteor.settings.public.appName} at any time. Upon terminating your viewing
        of these materials or upon the termination of this license, you must destroy any downloaded
        materials in your possession whether in electronic or printed format.
        <br />
        <br />
        {Meteor.settings.public.appName} is a website that connects salons, freelance beauticians
        and stylist (by and large or separately, &quot;Stylists&quot;) giving hair, beauty and other
        well-being and health services (&quot;Styling Services&quot;) with customers looking for
        such services(&quot;Clients&quot; or &quot;you&quot;).
      </p>

      <p>
        Disclaimer<br />
        The materials on {Meteor.settings.public.appName}&apos;s website are provided on an &apos;as
        is&apos; basis. {Meteor.settings.public.appName} makes no warranties, expressed or implied,
        and hereby disclaims and negates all other warranties including, without limitation, implied
        warranties or conditions of merchantability, fitness for a particular purpose, or
        non-infringement of intellectual property or other violation of rights.
        <br />
        <br />
        Further, {Meteor.settings.public.appName} does not warrant or make any representations
        concerning the accuracy, likely results, or reliability of the use of the materials on its
        website or otherwise relating to such materials or on any sites linked to this site.
      </p>

      <p>
        Accuracy of materials<br />
        The materials appearing on {Meteor.settings.public.appName} website could include technical,
        typographical, or photographic errors. {Meteor.settings.public.appName} does not warrant
        that any of the materials on its website are accurate, complete or current.{' '}
        {Meteor.settings.public.appName} may make changes to the materials contained on its website
        at any time without notice. However {Meteor.settings.public.appName} does not make any
        commitment to update the materials.
      </p>

      <p>
        Links<br />
        {Meteor.settings.public.appName} has not reviewed all of the sites linked to its website and
        is not responsible for the contents of any such linked site. The inclusion of any link does
        not imply endorsement by {Meteor.settings.public.appName} of the site. Use of any such
        linked website is at the user&apos;s own risk.
      </p>

      <p>
        Modifications<br />
        {Meteor.settings.public.appName} may revise these terms of service for its website at any
        time without notice. By using this website you are agreeing to be bound by the then current
        version of these terms of service.
      </p>

      <p>
        Governing Law<br />
        These terms and conditions are governed by and construed in accordance with the laws of
        Melbourne, Australia and you irrevocably submit to the exclusive jurisdiction of the courts
        in that State or location.
      </p>

      <p>
        Stylist on {Meteor.settings.public.appName}
        <br />
        {Meteor.settings.public.appName} does not autonomously affirm that Stylists are authorized
        to perform out the Styling Services offered by them on our Site. Notwithstanding, when
        stylist make accounts with {Meteor.settings.public.appName}, stylists affirm to{' '}
        {Meteor.settings.public.appName} that they are an authorized and certified Stylist, or if
        the Stylist is a salon, or different business entity, all of such stylists representatives,
        self employed entities or operators who are giving Styling services each are an authorized
        professional, that they are lawfully ready to give the Styling Administrations they offer to
        Customers on our Site, and that their business data is effectively spoken to on{' '}
        {Meteor.settings.public.appName}. {Meteor.settings.public.appName} maintains whatever
        authority is needed to evacuate or shroud any erroneous, obsolete, or illicit data from
        profiles, and additionally expel or conceal the whole profile itself whenever.
      </p>

      <p>
        Use of {Meteor.settings.public.appName} Services &amp; Website<br />
        We may change, alter, suspend, or cease all or any piece of the Services whenever, with or
        without reason. You recognize that the operation of the Services may now and again
        experience specialized or different issues and may not really proceed continue or without
        specialized or different mistakes and {Meteor.settings.public.appName} should not be
        dependable to you or others for any such interferences, blunders or issues or an inside and
        out discontinuance of the Services. {Meteor.settings.public.appName} has no commitment to
        keep up or refresh the Services or to keep delivering or discharging new forms of the
        Services.
        <br />
        <br />
        We do our best to keep {Meteor.settings.public.appName} safe and spam free, however, cannot
        promise it. Keeping in mind the end goal to enable us to do as such, you agree not to:
        <ol>
          <li>
            Send or generally post unapproved business interchanges, (for example, spam) on the
            Services
          </li>
          <li>Encourage or empower any infringement of these Terms of Service.</li>
          <li>
            Post content that is scornful, debilitating, obscene or that contains nudity or
            realistic or needless savagery.
          </li>
          <li>Upload infectious virus or different noxious code</li>
          <li>
            Gather Users&apos; information or data, or generally get to the Services, utilizing
            computerized implies, (for example, reaping bots, robots, creepy crawlies, or scrubbers)
            without our consent
          </li>
          <li>
            Utilize {Meteor.settings.public.appName} to do anything unlawful, deceiving, vindictive,
            or oppressive
          </li>
          <li>Harass, intimidate, or bully any User</li>
          <li>Keep your Registration Data and contact data exact and forward</li>
          <li>
            Keep your Account IDs and Account data classified and to not share your login data or
            Account IDs, let any other individual access your Account, or do whatever else that may
            endanger the security of your Account.
          </li>
          <li>
            You must not use the {Meteor.settings.public.appName} platform for any illegal or
            immoral purpose.
          </li>
          <li>
            You give {Meteor.settings.public.appName}an unhindered, around the world, eminence free
            permit to utilize, duplicate, alter and adjust any content and data posted on the{' '}
            {Meteor.settings.public.appName} to publish material on the{' '}
            {Meteor.settings.public.appName} and as generally might be required to give the{' '}
            {Meteor.settings.public.appName} service, for the general advancement of the{' '}
            {Meteor.settings.public.appName} service, and as allowed by this Agreement.
          </li>
          <li>
            You must not request payments outside of the {Meteor.settings.public.appName}
            Platform from clients. Doing so can result in suspension of your account on{' '}
            <Link to="/">{Meteor.settings.public.siteUrl}</Link>
          </li>
        </ol>
      </p>

      <p>
        Refund<br />
        If you cancel or don&apos;t turn up for an appointment, you may still be charged full money
        in accordance with the cancellation policy of the Stylist that charges for cancel
        appointments and no show according to individual stylist terms and condition at the time of
        your booking, at the stylists discretion. {Meteor.settings.public.appName} facilitates the
        payment transaction per these Terms between you and each Stylist, but is not responsible for
        mediating any resulting disputes. {Meteor.settings.public.appName} has no obligation to
        provide refunds or credits, but may grant them in uncontrollable circumstances, as a result
        of specific refund guarantee promotions, or correct any errors made by{' '}
        {Meteor.settings.public.appName}, in each case in {Meteor.settings.public.appName}&apos;s
        sole discretion.
        <br />
        <br />
        No-Shows: No shows or no notice cancellations will be charged 100% of the cost of the
        Services. You will be considered a “no-show” if you fail to be at your designated property
        after 15 minutes of your booked appointment time.
        <br />
        <br />
        Delays: If you are delayed please let us know by email and we will do our best to
        accommodate you. Our stylists are instructed to wait at your home or office for 15 minutes
        after the appointment start time. Unless otherwise specified, all paid sums are
        non-refundable.
      </p>

      <p>
        Booking Guarantee<br />
        Despite the fact that the Services are proposed to give a stylists accessibility
        progressively, it is conceivable that a booking strife may happen that requires the stylist
        to reschedule your reservation. Creating a reservation utilizing the Services isn&apos;t a
        guarantee that the stylist will honour the reservation as booked.{' '}
        {Meteor.settings.public.appName}
        cannot guarantee availability of the Services to any User until you receive a confirmation
        email, stating the booking is confirmed.
      </p>

      <p>
        Account Privacy<br />
        You consent to keep up your Account exclusively for your own particular use. You agree that
        you won&apos;t enable someone else to utilize your Account IDs to access or utilize the
        Services under any conditions. You are exclusively and totally in charge of keeping up the
        privacy of your Account IDs and for any charges, harms, liabilities or misfortunes caused or
        endured because of you neglect to do as such. We are not obligated for any mischief caused
        by or identified with the robbery of your Account IDs, your exposure of your Account IDs, or
        your approval to enable someone else to access or utilize the Services utilizing your
        Account IDs. Moreover, you are exclusively and altogether in charge of all exercises that
        happen under your Account including any charges acquired identifying with the Services. You
        consent to quickly inform us of any unapproved utilization of your Account or some other
        break of security known to you. You recognize that the entire protection of your information
        and messages transmitted while utilizing the Services can&apos;t be ensured.
      </p>

      <p>
        Payments &amp; Services<br />
        Stylists, as a different entity from {Meteor.settings.public.appName}, are exclusively in
        charge of all client benefit issues identifying with such stylists products or
        administrations, including without impediment, any Styling Services, evaluating, appointment
        satisfaction, request or appointment cancellation, returns, discounts and changes, refunds,
        usefulness and guarantee, and criticism concerning encounters with such stylists, any
        workforce, their approaches or procedures. As amongst Clients and{' '}
        {Meteor.settings.public.appName}, {Meteor.settings.public.appName} is exclusively in charge
        of client benefit issues identifying with any Account, payment, Card preparing, charging or
        crediting.
        <ol>
          <li>
            Upon making a booking, the stylists owe {Meteor.settings.public.appName} the Fees. Fees
            will naturally be deducted from the service payment.
          </li>
          <li>
            In the event that, for any reason, a stylist Payment can&apos;t be transferred or
            generally made to the {Meteor.settings.public.appName} stylist or came back to the
            Client (as the case may be) or no claim is otherwise made for a Stylist Payment, the
            Stylist Payment will stay in
            {Meteor.settings.public.appName} Account until paid or generally for up to three months
            from the date the Client at first paid the Task Payment into the{' '}
            {Meteor.settings.public.appName} Account.
          </li>
          <li>
            As a client you agree that the payment information you provide is correct and has
            sufficient funds to complete payment once the service has been provided by stylist.
          </li>
        </ol>
      </p>

      <p>
        Intellectual Property<br />
        The Services contains substance and innovation of the Company that is ensured by copyright,
        trademark, patent, competitive advantage and different laws. The Company possesses licensed
        innovation rights to any protectable piece of the Services, including yet not constrained to
        the outline, work of art, logos, usefulness, and documentation (all things considered, the
        &quot;Organization Property&quot;). You may not duplicate, alter, or figure out any piece of
        the Services or the Company Property.
      </p>

      <p>
        Client responsibility<br />
        As the beneficiary of in-home excellence service given by stylists, you consent to accept
        certain obligations. When you book an arrangement, you consent to agree to any standards or
        prerequisites of the specialist organization pertinent to the service acquired and that you
        are influenced mindful of, including as a feature of any affirmation to email (the
        &quot;Necessities&quot;). Regardless of whether there are Requirements, you consent to: (a)
        make in your home (or other space where our specialist organizations are welcome to do their
        work) a sheltered, clean, and sensibly agreeable workspace that is free of conditions that
        would make it troublesome for our specialist organizations to play out their employments
        (all as decided in each of our stylist&apos;s sole prudence); (b) give a workspace that
        approaches lavatory offices and is in closeness to an electrical outlet and a sink with hot
        and cool running water; and (c) hold back, and cause different people introduce in your
        family unit to abstain, from any discourse, lead, or individual shows that a sensible
        individual would discover hostile, scary, antagonistic, irritating, profane or damaging
        while our stylists are available. On the off chance that you have pets, you consent to bind
        the greater part of your pets to a room where our stylists won&apos;t work. In the event
        that you have a kid or kids younger than 13, you agree that childcare (gave by somebody
        other than you and our specialist organization) will be available. This is imperative as the
        stylist will have tools that can hurt a kid and our specialist will be centered around you.
        Specialist maintain all authority to end or decline to give their services to anybody
        whenever in the occasion you don&apos;t satisfy your obligations as put forward in this
        Section or if a stylist feels perilous or awkward with her in-home workplace or conditions
        for any reason. You comprehend, recognize and concur that stylists are not representatives
        or operators of {Meteor.settings.public.appName}, but rather are self employed entities who
        work business ventures particular and unmistakable from {Meteor.settings.public.appName}. No
        Support or Maintenance. You recognize and concur that we will have no commitment to furnish
        you with any help or support regarding the Services.
      </p>

      <p>
        Suggestions<br />
        In the event that you give us any feedback or proposals with respect to the Services
        (&quot;Feedback&quot;), you therefore dole out to every one of us rights in the Feedback and
        concur that we will have the privilege to utilize such Feedback and related data in any way
        we consider proper. We will treat any Feedback you give to us as non-classified and
        non-exclusive. You concur that you won&apos;t submit to us any data or thoughts that you
        consider to be secret or restrictive.
      </p>

      <p>
        Insurance<br />
        {Meteor.settings.public.appName}, may likewise take out some coincidental property and
        injury insurance itself and that insurance may extent cover {Meteor.settings.public.appName}{' '}
        Stylist for specific sorts of work. You recognize and agree that if a claim is made
        identifying with any service performed as well as merchandise given by an{' '}
        {Meteor.settings.public.appName} Stylist, and the protection taken out via
        {Meteor.settings.public.appName}(assuming any) reacts to that claim then this clause
        applies. In the event that a claim is made against an {Meteor.settings.public.appName}{' '}
        Stylist, {Meteor.settings.public.appName} may choose to make a claim under such strategy and
        if the claim is fruitful, {Meteor.settings.public.appName} maintains its authority to
        recuperate any excess or deductible payable in regard of the claim from the{' '}
        {Meteor.settings.public.appName} Stylist. Where
        {Meteor.settings.public.appName} makes a claim and the back up plan evaluates that the{' '}
        {Meteor.settings.public.appName} Stylist is responsible, {Meteor.settings.public.appName} is
        qualified to rely on that appraisal. In the event that you don&apos;t pay any excess due
        under this clause, {Meteor.settings.public.appName} may likewise choose to set this sum off
        a few or the majority of the excess paid by it against future money it might owe to the{' '}
        {Meteor.settings.public.appName}
        Stylist.
        <br />
        <br />
        The {Meteor.settings.public.appName} Stylist recognizes and agrees that if a claim is made
        identifying with any services performed as well as merchandise gave by an{' '}
        {Meteor.settings.public.appName} Stylist, and the insurance taken out via{' '}
        {Meteor.settings.public.appName} (assuming any) does not react to the claim or the claim is
        under the excess payable to the back up plan, at that point this condition applies.{' '}
        {Meteor.settings.public.appName} may choose to pay a sum to settle the claim. To the degree
        that the {Meteor.settings.public.appName} Stylist was or would be at risk for the measure of
        the claim, the sum paid via {Meteor.settings.public.appName} might be recuperated via
        {Meteor.settings.public.appName} from the {Meteor.settings.public.appName} Stylist.{' '}
        {Meteor.settings.public.appName} may likewise choose to set this sum off against future
        funds it might owe to the {Meteor.settings.public.appName} Stylist.
      </p>

      <p>
        Promo Codes<br />
        Limited time codes qualify you for a discount as set out by the special terms and
        conditions. Promo codes can only be used once by the customer and not in conjunction with
        any other offer. Clients esteemed to abusing the terms of these promo codes will have promo
        codes expelled from their account as well as their account closed.
      </p>
    </div>

    <div className="margin-bottom-40">
      <Header as="h2">Stylist Terms &amp; Conditions</Header>

      <p>
        Limitations<br />
        In no event shall {Meteor.settings.public.appName} or its suppliers be liable for any
        damages (including, without limitation, damages for loss of data or profit, or due to
        business interruption) arising out of the use or inability to use the materials on{' '}
        {Meteor.settings.public.appName}&apos;s website, even if {Meteor.settings.public.appName} or
        a {Meteor.settings.public.appName} authorized representative has been notified orally or in
        writing of the possibility of such damage. Because some jurisdictions do not allow
        limitations on implied warranties, or limitations of liability for consequential or
        incidental damages, these limitations may not apply to you.
        <br />
        <br />
        The Services are ensured by copyright laws and global copyright arrangements and in addition
        other protected innovation laws and treaties. Unapproved propagation or dispersion of the
        Services, or any bit of them, may bring about extreme common and criminal punishments and
        will be indicted to the greatest degree conceivable under the law. The Services are
        licensed, not sold.
        <br />
        <br />
        By making an Account as a stylist, you guarantee that you are, or on the off chance that you
        are a salon or different business entity, self-employed entities or specialists who are
        giving the Styling Services each are, an authorized proficient and that your business data
        is accurately provided to on {Meteor.settings.public.appName}. You additionally guarantee
        that you are appropriately authorized to give Styling Services &quot;in-home&quot; or
        generally outside your place of business should you promote such Styling Services on{' '}
        {Meteor.settings.public.appName}. {Meteor.settings.public.appName} maintains whatever
        authority is needed to evacuate or conceal any erroneous, obsolete, or illicit data from
        profiles, and additionally expel or shroud the whole profile itself.
        <br />
        <br />
        On the off chance that you are accepting these Terms of Service and utilizing the Services
        on behalf of an organization, association or company, you speak to and warrant to the
        Company that you have full power and expert to do as such.
      </p>

      <p>
        Account<br />
        You may request to close your account and delete your stylist profile at anytime. If a
        booking has been made and confirmed prior to your request than you agree to provide service
        to any existing booking.
      </p>

      <p>
        Currency<br />
        All adjustments, charges, and any transaction on {Meteor.settings.public.appName} are in
        Australian dollars.
      </p>

      <p>
        Service<br />
        When you receive a notification of a service request by client, you agree to respond in
        timely manner. Once agreed, you are liable to provide service as requested and agreed upon.
        If for any circumstances you are unable to provide the service, you are required to
        communicate with the client explain the circumstances and organise a replacing stylist if
        the client agrees too. If you do not show up for an appointment, you will be charged
        penalty.
      </p>
    </div>

    <div className="margin-bottom-40">
      <p>Last update: 19 March 2018.</p>
    </div>
  </Container>
);

export default TermsPage;
