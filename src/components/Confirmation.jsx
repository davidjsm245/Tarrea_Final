import React from 'react';

import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { confirmable, createConfirmation } from "react-confirm";
import 'bootstrap/dist/css/bootstrap.min.css';

const Confirmation = ({
  okLabel = "Aceptar",
  cancelLabel = "Cancelar",
  title = "Confirmación",
  confirmation,
  show,
  proceed,
  enableEscape = true
}) => {
  return (
    <div className="static-modal">
      <Modal
        animation={false}
        show={show}
        onHide={() => proceed(false)}
        backdrop={enableEscape ? true : "static"}
        keyboard={enableEscape}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmation}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => proceed(false)}>
            {cancelLabel}
          </Button>
          <Button
            className="button-l"
            variant="primary"
            onClick={() => proceed(true)}
          >
            {okLabel}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

Confirmation.propTypes = {
  okLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  title: PropTypes.string,
  confirmation: PropTypes.string,
  show: PropTypes.bool,
  proceed: PropTypes.func,
  enableEscape: PropTypes.bool
};

// Esta es la función que estás llamando en Empresa.jsx
export function confirm(
  confirmation,
  options = {}
) {
  return createConfirmation(confirmable(Confirmation))({
    confirmation,
    ...options
  });
}