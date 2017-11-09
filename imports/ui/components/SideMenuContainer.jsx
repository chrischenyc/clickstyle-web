import React from 'react';
import { Grid, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import SideMenu from './SideMenu';

const SideMenuContainer = props => (
  <Grid className="below-fixed-menu">
    <Responsive minWidth={Responsive.onlyTablet.minWidth} as={Grid.Row}>
      <Grid.Column width="3">
        <SideMenu />
      </Grid.Column>
      <Grid.Column width="13">{props.children}</Grid.Column>
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
