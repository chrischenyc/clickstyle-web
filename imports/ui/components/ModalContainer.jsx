import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { closeModal } from '../../modules/client/redux/modal';

class ModalContainer extends Component {
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  render() {
    return (
      <Modal
        size="small"
        open
        closeOnDimmerClick={false}
        closeIcon
        onClose={() => {
          this.props.closeModal();
        }}
      >
        {this.props.title && <Modal.Header>{this.props.title}</Modal.Header>}

        <Modal.Content>{this.props.component}</Modal.Content>
      </Modal>
    );
  }
}

ModalContainer.defaultProps = {
  title: null,
};

ModalContainer.propTypes = {
  component: PropTypes.node.isRequired,
  title: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  component: state.modal.component,
  title: state.modal.title,
});

export default connect(mapStateToProps, { closeModal })(ModalContainer);
