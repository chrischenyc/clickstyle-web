import React from 'react';
import { Grid, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import SideMenu from './SideMenu';

const SideMenuContainer = props => (
  <div style={{ marginTop: '51px', paddingTop: '1rem' }}>
    <Responsive
      minWidth={Responsive.onlyTablet.minWidth}
      as={Grid}
      style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
    >
      <Grid.Row>
        <Grid.Column width="3">
          <SideMenu />
        </Grid.Column>
        <Grid.Column width="13">{props.children}</Grid.Column>
      </Grid.Row>
    </Responsive>

    <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>{props.children}</Responsive>
  </div>
);

SideMenuContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

SideMenuContainer.defaultProps = {
  children: null, // or [] I guess
};

export default SideMenuContainer;
