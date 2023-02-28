import React, { useState } from "react";
import "assets/css/loginform.css";
import "assets/css/questions_answers.css";
import { Input, Button } from "antd";
import { SubmitLogin } from "../../../actions/Login/LoginActions";
import { OpenNotification } from "../../../Utilties/Utilties";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

function Login() {
  const token = localStorage.getItem("token");
  if (typeof token === "undefined" && token === "" && token === null) {
    window.location.href = "/";
  }
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, settLoading] = useState<boolean>(false);

  const handleChange = (e: { target: { value: any; name: any } }) => {
    const { value } = e.target;
    setCredentials({
      ...credentials,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    settLoading(true);
    SubmitLogin(credentials)
      .then(({ data: response }) => {
        settLoading(false);
        if (response.success) {
          localStorage.setItem("role_id", response.loggedIn_user_role);
          localStorage.setItem("token", response.token);
          OpenNotification("success", response.message);
          window.location.href = "/";
        }
      })
      .catch(() => {
        settLoading(false);
      });
  };

  return (
    <>
      <div className="signup-form">
        <form className="container" onSubmit={handleSubmit}>
          <div className="row justify-content-center">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <h2>Login</h2>
              <p className="hint-text">You can login here.</p>

              <div className="form-group">
                <Input
                  type="email"
                  required
                  value={credentials.email}
                  name="email"
                  placeholder="Email"
                  onChange={(e: any) => handleChange(e)}
                  allowClear
                />
              </div>
              <div className="form-group">
                <Input.Password
                  type="password"
                  required
                  name="password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  placeholder="Password"
                  onChange={(e: any) => handleChange(e)}
                  allowClear
                />
              </div>
              <Button
                shape="round"
                type="primary"
                className="float-right"
                htmlType="submit"
                loading={loading}
              >
                Login
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
