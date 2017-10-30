import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import _ from 'lodash';

class ModalLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
    };
  }

  render() {
    return (
      <div>
        <Link
          {..._.omit(this.props, ['component'])}
          onClick={(e) => {
            e.preventDefault();
            this.setState({ openModal: true });
          }}
        />

        <Modal
          size="large"
          open={this.state.openModal}
          closeIcon
          onClose={() => {
            this.setState({ openModal: false });
          }}
        >
          <Modal.Content>{this.props.component}</Modal.Content>
        </Modal>
      </div>
    );
  }
}

ModalLink.propTypes = {
  to: PropTypes.string.isRequired,
  component: PropTypes.node.isRequired,
};

export default ModalLink;
