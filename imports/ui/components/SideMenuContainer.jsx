import React from 'react';
import { Grid, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import SideMenu from './SideMenu';

const SideMenuContainer = props => (
  <Grid stackable className="below-fixed-menu">
    <Responsive minWidth={Responsive.onlyTablet.minWidth}>
      <Grid.Row>
        <Grid.Column width="1">
          <SideMenu />
        </Grid.Column>
        <Grid.Column width="15">{props.children}</Grid.Column>
      </Grid.Row>
    </Responsive>

    <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>{props.children}</Responsive>
  </Grid>
);

SideMenuContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

SideMenuContainer.defaultProps = {
  children: null, // or [] I guess
};

export default SideMenuContainer;
