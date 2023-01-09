import React from "react";
import { Col, Row, Modal, Form } from "react-bootstrap";
import ClinicType from "../../../../Types/Clinic";
import { Input, Button } from "antd";

interface Props {
  isOpen: boolean;
  title: string;
  clinic: ClinicType;
  loading: any;
  handleChange: (e: any) => void;
  handleCloseModel: () => void;
  handleSubmit: (e: any) => void;
  handleContact: (e: any) => void;
}
const ClinicForm: React.FC<Props> = ({
  isOpen,
  title,
  clinic,
  loading,
  handleChange,
  handleCloseModel,
  handleContact,
  handleSubmit,
}) => {
  const handleClose = () => console.log("close");
  return (
    <Modal
      animation={false}
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
          <Form.Group>
            <Form.Label className="required-field">Name:</Form.Label>
            <Input
              placeholder="Name"
              name="name"
              value={clinic.name}
              type="text"
              required
              maxLength={60}
              className="float-right"
              onChange={(e: any) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="required-field">Short Name:</Form.Label>
            <Input
              placeholder="Short Name"
              name="short_name"
              value={clinic.short_name}
              type="text"
              required
              maxLength={4}
              className="float-right"
              onChange={(e: any) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="required-field">Contact no:</Form.Label>
            <Input
              placeholder="301-123-4567"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              name="contact_no"
              value={clinic.contact_no}
              type="tel"
              required
              maxLength={12}
              className="float-right"
              onChange={(e: any) => handleContact(e)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Phone No:</Form.Label>
            <Input
              placeholder="301-123-4567"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              name="phone"
              value={clinic.phone}
              type="tel"
              maxLength={12}
              className="float-right"
              onChange={(e: any) => handleContact(e)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="required-field">City:</Form.Label>
            <Input
              placeholder="City"
              name="city"
              required
              value={clinic.city}
              type="text"
              maxLength={60}
              className="float-right"
              onChange={(e: any) => handleChange(e)}
            />
          </Form.Group>
          <Row>
            <Col col={6}>
              <Form.Group>
                <Form.Label className="required-field">Zip Code:</Form.Label>
                <Input
                  placeholder="Zip Code"
                  name="zip_code"
                  value={clinic.zip_code}
                  type="tel"
                  required
                  maxLength={5}
                  className="float-right"
                  onChange={(e: any) => handleChange(e)}
                />
              </Form.Group>
            </Col>
            <Col col={6}>
              <Form.Group>
                <Form.Label className="required-field">State:</Form.Label>
                <Input
                  placeholder="State (2 alpha characters only)"
                  name="state"
                  value={clinic.state}
                  type="text"
                  required
                  maxLength={2}
                  className="float-right text-uppercase"
                  onChange={(e: any) => handleChange(e)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label className="required-field">Address Line 1:</Form.Label>
            <Input
              placeholder="Address Line 1"
              name="address"
              value={clinic.address}
              type="text"
              required
              className="float-right"
              onChange={(e: any) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Address Line 2:</Form.Label>
            <Input
              placeholder="Address Line 2"
              name="address_2"
              value={clinic.address_2}
              type="text"
              className="float-right"
              onChange={(e: any) => handleChange(e)}
            />
          </Form.Group>
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
export default ClinicForm;
