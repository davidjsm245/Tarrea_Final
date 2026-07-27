import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Nuevo from "../../components/Nuevo";

const ModalAlmacen = ({
    show,
    onHide,
    notificacion
}) => {

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Almacén</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Nuevo
                    notificacion={notificacion}
                    cerrarModal={onHide}
                />
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={onHide}
                >
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAlmacen;