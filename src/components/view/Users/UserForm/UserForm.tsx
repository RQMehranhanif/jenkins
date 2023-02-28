import { Button, Input } from "antd";
import React from "react";
import { Col, Row, Modal, Form } from "react-bootstrap";
import UserType from "../../../../Types/User";

interface Props {
  isOpen: boolean;
  title: string;
  user: UserType;
  loading: any;
  handleChange: (e: any) => void;
  handleCloseModel: () => void;
  handleSubmit: (e: any) => void;
  handleContact: (e: any) => void;
  handleRoleChange: (e: any) => void;
  roles: any;
}
const UserForm: React.FC<Props> = ({
  isOpen,
  title,
  user,
  loading,
  handleChange,
  handleCloseModel,
  handleSubmit,
  handleContact,
  handleRoleChange,
  roles,
}) => {
  const roleId = localStorage.getItem('role_id')
  if (roleId !== '1') {
    delete roles['1']
  }
  
  return (
    <Modal
      animation={false}
      show={isOpen}
      onHide={() => handleCloseModel()}
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
                  value={user.first_name}
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
                  value={user.mid_name}
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
                  value={user.last_name}
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
                <Form.Label className="required-field">Contact No:</Form.Label>
                <Input
                  maxLength={12}
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  placeholder="301-123-4567"
                  name="contact_no"
                  value={user.contact_no}
                  type="text"
                  required
                  className="float-right"
                  onChange={(e: any) => handleContact(e)}
                />
              </Form.Group>
            </Col>
          </Row>
          {/* //// */}
          <Row>
            <Col col={6}>
              <Form.Group>
                <Form.Label className="required-field">Designation:</Form.Label>
                <select
                  style={{ width: "100%" }}
                  name="role"
                  required
                  className="form-control"
                  value={user.role}
                  onChange={(e) => handleRoleChange(e)}
                >
                  {" "}
                  <option value="" selected disabled>
                    Select
                  </option>
                  {Object.keys(roles).map((key, i) => (
                      <option value={key} key={i}>
                        {roles[key]}
                      </option>
                  ))}
                </select>
              </Form.Group>
            </Col>
            <Col col={6}>
              <Form.Group>
                <Form.Label className="required-field">Gender:</Form.Label>
                <select
                  className="form-control"
                  style={{ width: "100%" }}
                  name="gender"
                  required
                  value={user.gender}
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
          {/* ///// */}

          <Row>
            <Col col={6}>
              <Form.Group>
                <Form.Label className="required-field">Email:</Form.Label>
                <Input
                  placeholder="abcd@gmail.com"
                  name="email"
                  value={user.email}
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
                <Form.Label>Password:</Form.Label>
                <Input
                  placeholder="1234567"
                  name="password"
                  value={user.password}
                  type="password"
                  maxLength={8}
                  className="float-right"
                  onChange={(e: any) => handleChange(e)}
                />
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
export default UserForm;
