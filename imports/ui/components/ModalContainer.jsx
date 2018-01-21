import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { closeModal } from '../../modules/client/redux/ui';

const ModalContainer = props => (
  <Modal
    size="small"
    open
    closeOnDimmerClick={props.dismissible}
    closeIcon={props.dismissible}
    onClose={() => {
      props.closeModal();
    }}
  >
    {props.title && <Modal.Header>{props.title}</Modal.Header>}

    <Modal.Content>{props.component}</Modal.Content>
  </Modal>
);

ModalContainer.defaultProps = {
  title: null,
};

ModalContainer.propTypes = {
  component: PropTypes.node.isRequired,
  title: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  dismissible: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  component: state.ui.modalComponent,
  title: state.ui.modalTitle,
  dismissible: state.ui.modalDismissible,
});

export default connect(mapStateToProps, { closeModal })(ModalContainer);
