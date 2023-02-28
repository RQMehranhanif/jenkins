import React from "react";
import { Col, Row, Modal,Form } from "react-bootstrap";
import PhysicianType from "@/Types/Physician";
import { Button, Input } from "antd";

interface Props {
  isOpen: boolean;
  title: string;
  physician: PhysicianType;
  handleChange: (e: any) => void;
  handleCloseModel: () => void;
  handleSubmit: (e: any) => void;
  handleContact: (e: any) => void;
  specialists: any;
  loading: any;
}
const PhysicianForm: React.FC<Props> = ({
  isOpen,
  title,
  physician,
  specialists,
  loading,
  handleChange,
  handleCloseModel,
  handleContact,
  handleSubmit,
}) => {
  const handleClose = () => console.log("close");
  return (
    <Modal
      show={isOpen}
      animation={false}
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
            <Col col={6}>
              <Form.Group>
                <Form.Label className="required-field">First Name:</Form.Label>
                <Input
                  placeholder="First Name"
                  name="first_name"
                  value={physician.first_name}
                  type="text"
                  required
                  maxLength={60}
                  className="float-right"
                  onChange={(e: any) => handleChange(e)}
                />
              </Form.Group>
            </Col>
            <Col col={6}>
              <Form.Group>
                <Form.Label>Middle Name:</Form.Label>
                <Input
                  placeholder="Middle Name"
                  name="mid_name"
                  value={physician.mid_name}
                  type="text"
                  maxLength={60}
                  className="float-right"
                  onChange={(e: any) => handleChange(e)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col col={6}>
              <Form.Group>
                <Form.Label className="required-field">Last Name:</Form.Label>
                <Input
                  placeholder="Last Name"
                  name="last_name"
                  value={physician.last_name}
                  type="text"
                  required
                  maxLength={60}
                  className="float-right"
                  onChange={(e: any) => handleChange(e)}
                />
              </Form.Group>
            </Col>
            <Col col={6}>
              <Form.Group>
                <Form.Label className="required-field">Designation</Form.Label>
                <select
                  style={{ width: "100%" }}
                  placeholder="Designation"
                  name="role"
                  required
                  value={physician.role}
                  className="float-right form-control"
                  onChange={(e: any) => handleChange(e)}
                >
                  <option value="" selected disabled>
                    Select
                  </option>
                  <option value="5">Physician</option>
                  {/* {Object.keys(roles).map((key, i) => (
                    <option value={key} key={i}>
                      {roles[key]}
                    </option>
                  ))}
                </select> */}
                </select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col col={6}>
              <Form.Group>
                <Form.Label className="required-field">Contact No:</Form.Label>
                <Input
                  placeholder="333-333-3333"
                  name="contact_no"
                  value={physician.contact_no}
                  type="tel"
                  required
                  maxLength={60}
                  className="float-right"
                  onChange={(e: any) => handleContact(e)}
                />
              </Form.Group>
            </Col>
            <Col col={6}>
              <Form.Group>
                <Form.Label className="required-field">Gender</Form.Label>
                <select
                  placeholder="Gender"
                  name="gender"
                  required
                  style={{ width: "100%" }}
                  value={physician.gender}
                  className="float-right form-control"
                  onChange={(e: any) => handleChange(e)}
                >
                  <option value="" selected disabled>
                    Select
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col col={12}>
              <Form.Group>
                <Form.Label className="required-field">Speciality</Form.Label>
                <select
                  style={{ width: "100%" }}
                  name="speciality"
                  className="form-control"
                  required
                  value={physician.speciality}
                  onChange={(e: any) => handleChange(e)}
                >
                  <option value="" selected disabled>
                    Select
                  </option>

                  {specialists.map((key: { id: any; name: any }) => (
                    <option value={key.name} key={key.id}>
                      {key.name}
                    </option>
                  ))}
                </select>
              </Form.Group>
            </Col>
          </Row>
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
            className="rounded-pill "

            style={{ fontSize: "12px", marginTop: "6px" }}
          >
            Cancel
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};
export default PhysicianForm;
