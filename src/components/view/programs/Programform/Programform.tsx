import { Input, Button } from "antd";
import React from "react";
import { Col, Row, Modal, Form } from "react-bootstrap";
import ProgramType from "../../../../Types/ProgramType";

interface Props {
  isOpen: boolean;
  title: string;
  loading: any;
  user: ProgramType;
  handleChange: (e: any) => void;
  handleCloseModel: () => void;
  handleSubmit: (e: any) => void;
}
const ProgramFrom: React.FC<Props> = ({
  isOpen,
  title,
  user,
  loading,
  handleChange,
  handleCloseModel,
  handleSubmit,
}) => {
  const handleClose = () => console.log("close");
  return (
    <Modal
      show={isOpen}
      onHide={() => handleClose()}
      style={{ zIndex: "1050" }}
    >
      <Modal.Header className="pt-0 bg-info" style={{ color: "white" }}>
        <Modal.Title style={{ fontSize: "18px" }} className="mt-2 mb-2">
          {title}
        </Modal.Title>
        <i
          className="fa fa-times float-right mt-3 cursor-pointer"
          aria-hidden="true"
          onClick={() => handleCloseModel()}
        ></i>
      </Modal.Header>
      <Modal.Body style={{ lineHeight: "1.9rem" }}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Row>
            <Col col={12}>
              <Form.Group>
                <Form.Label className="required-field">Name:</Form.Label>
                <Input
                  placeholder="Name"
                  name="name"
                  value={user.name}
                  type="text"
                  required
                  maxLength={60}
                  className="float-right"
                  onChange={(e: any) => handleChange(e)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col col={12}>
              <Form.Group>
                <Form.Label className="required-field">Short Name:</Form.Label>
                <Input
                  placeholder="Short Name"
                  name="short_name"
                  value={user.short_name}
                  type="text"
                  required
                  maxLength={4}
                  className="float-right"
                  onChange={(e: any) => handleChange(e)}
                />
                <span style={{ color: "gray", fontSize: "12px" }}>
                  Note: Max character length is 4.
                </span>
              </Form.Group>
            </Col>
          </Row>
          <br />
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="rounded-pill float-right "
            style={{ fontSize: "12px", marginTop: "6px" }}
          >
            Save
          </Button>
          <Button
            onClick={() => handleCloseModel()}
            className="rounded-pill"
            style={{ fontSize: "12px", marginTop: "6px" }}
          >
            Cancel
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};
export default ProgramFrom;
