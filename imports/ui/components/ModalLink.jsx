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
          size="small"
          open={this.state.openModal}
          closeIcon
          onClose={() => {
            this.setState({ openModal: false });
          }}
        >
          {this.props.title && <Modal.Header>{this.props.title}</Modal.Header>}
          <Modal.Content>{this.props.component}</Modal.Content>
        </Modal>
      </div>
    );
  }
}

ModalLink.defaultProps = {
  title: null,
};

ModalLink.propTypes = {
  to: PropTypes.string.isRequired,
  component: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default ModalLink;
