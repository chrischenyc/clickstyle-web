import React from 'react';
import { Divider, Grid, Header, Icon, Image, Segment } from 'semantic-ui-react';

const HowItWorks = () => (
  <Segment style={{ padding: '4em' }} vertical textAlign="center">
    <Header as="h2" style={{ fontSize: '2em' }>HOW IT WORKS</Header>

    <Grid columns="equal" stackable>
      <Grid.Row textAlign="center">
        <Grid.Column style={{ padding: '2em 2em' }}>
          <Icon name="search" size="big" color="teal" />
          <Header as="h3" style={{ fontSize: '2em' }>View and select our services</Header>
          <p style={{ fontSize: '1.2em' }}>
            Non dignissimos quidem quae assumenda enim quasi et. Officiis rem ut qui voluptatem
            laboriosam commodi quibusdam hic. Odio quia sunt sed quod totam sequi reiciendis quia.
            Dolores quibusdam et doloribus qui et consequatur fugit vel totam. Beatae ea quia non
            non necessitatibus rerum explicabo.
          </p>
        </Grid.Column>
        <Grid.Column style={{ padding: '2em 2em' }}>
          <Icon name="checked calendar" size="big" color="teal" />
          <Header as="h3" style={{ fontSize: '2em' }>Book your appointment</Header>
          <p style={{ fontSize: '1.2em' }}>
            Est maiores explicabo neque amet. Culpa quia qui est magnam adipisci neque quae
            consectetur aliquam. Velit suscipit et ex eum voluptatem.
          </p>
        </Grid.Column>
        <Grid.Column style={{ padding: '2em 2em' }}>
          <Icon name="smile" size="big" color="teal" />
          <Header as="h3" style={{ fontSize: '2em' }>Prepare to get pampered</Header>
          <p style={{ fontSize: '1.2em' }}>
            Consequatur similique sunt est iure est accusantium sunt et. Necessitatibus autem
            explicabo. Porro temporibus nostrum. Repellendus vel nostrum sapiente non autem hic
            distinctio. Aut rerum quia enim rerum dignissimos aut sunt.
          </p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Segment>
);

export default HowItWorks;
