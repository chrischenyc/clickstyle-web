import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { closeModal } from '../../modules/client/redux/modal';

const ModalContainer = ({ closeModal: close, title, component }) => (
  <Modal
    size="small"
    open
    closeOnDimmerClick={false}
    closeIcon
    onClose={() => {
      close();
    }}
  >
    {title && <Modal.Header>{title}</Modal.Header>}

    <Modal.Content>{component}</Modal.Content>
  </Modal>
);

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
