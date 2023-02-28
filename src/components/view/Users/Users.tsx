import React, { useState, useEffect } from "react";
import "react-dyn-tabs/style/react-dyn-tabs.min.css";
import "react-dyn-tabs/themes/react-dyn-tabs-card.min.css";
import "assets/css/style.css";
import "assets/css/questions_answers.css";
import { Popconfirm, Table, Pagination, Input } from "antd";
import { OpenNotification } from "../../../Utilties/Utilties";
import UserType from "@/Types/User";
import {
  getUsersList,
  addNewUser,
  updateUser,
  deleteUser,
  searchUser,
} from "../../../actions/Users/UserActions";
import UserForm from "./UserForm/UserForm";
import { LoadingOutlined } from "@ant-design/icons";

function Users() {
  const defaultData: UserType = {
    id: "",
    first_name: "",
    mid_name: "",
    last_name: "",
    contact_no: "",
    role: "",
    role_id: "",
    gender: "",
    email: "",
    password: "",
  };
  const [user, setUser] = useState<UserType>(defaultData);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, settLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [data, setData] = React.useState<any[]>([]);
  const [roles, setRoles] = React.useState<any>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { Search } = Input;
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;
  
  const handleChange = (e: any) => {
    const { value } = e.target;

    setUser({
      ...user,
      [e.target.name]: value,
    });
  };
  const handleRoleChange = (e: any) => {
    const { value } = e.target;
    setUser({
      ...user,
      [e.target.name]: parseInt(value),
    });
  };
  const handleContact = (e: any) => {
    const x = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !x[2]
      ? x[1]
      : +x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
    const value = e.target.value;

    setUser({
      ...user,
      [e.target.name]: value,
    });
  };

  useEffect(() => {
    settLoading(true);
    getUsersList(search, currentPage)
      .then(({ data: response }) => {
        settLoading(false);
        setData(response.data);
        setRoles(response.roles_data);
        setTotalRecords(response.total_records);
      })
      .catch((err) => {
        settLoading(false);
        OpenNotification("error", err?.message);
      });
  }, [currentPage]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    settLoading(true);
    e.preventDefault();
    if (user.id !== "") {
      updateUser(user.id, user)
        .then(({ data: response }) => {
          settLoading(false);

          const newdata = [...data];
          const index = data.findIndex((item) => item.id === user.id);
          newdata[index] = response.data;
          setData(newdata);
          if (response.success) {
            OpenNotification("success", response.message);
            setIsOpen(false);
            setUser(defaultData);
          } else {
            OpenNotification("error", response.message);
          }
        })
        .catch((err) => {
          OpenNotification("error", err.message);
        });
    } else {
      addNewUser(user).then(({ data: response }) => {
        settLoading(false);
        setData([...data, response.data]);
        if (response.success) {
          setIsOpen(false);
          OpenNotification("success", response.message);
          setUser(defaultData);
        } else {
          OpenNotification("error", response.errors.email);
        }
      });
    }
  };

  const deleteUserRecord = (id: any) => {
    settLoading(true);
    deleteUser(id)
      .then(({ data: response }) => {
        if (response.success) {
          settLoading(false);
          const list = data.filter((item) => item.id !== id);
          setData(list);
          OpenNotification("success", response.message);
        } else {
          settLoading(false);
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        OpenNotification("error", err?.message);
      });
  };

  const roleId = localStorage.getItem("role_id");

  const columns = [
    {
      title: "Sr",
      dataIndex: "index",
      render: (text: string, record: any, index: number) =>
        (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "email",
      dataIndex: "email",
    },
    {
      title: "role",
      dataIndex: "role_name",
    },
    {
      title: [roleId === "1" || roleId === "11" ? "Action" : ""],
      dataIndex: "btn",
      render: (_: any, record: { id: React.SetStateAction<null> }) =>
        data.length >= 1 && roleId === "1" || roleId === "11" ? (
          <>
            <div
              className="mr-3 btn btn-info btn-sm cursor-pointer"
              onClick={() => handleEdit(record)}
            >
              Edit
            </div>
            <Popconfirm
              title="Sure to delete?"
              className="btn btn-danger btn-sm"
              onConfirm={() => deleteUserRecord(record.id)}
            >
              Delete
            </Popconfirm>
          </>
        ) : null,
    },
  ];

  const handleCloseModel = () => {
    setIsOpen(false);
  };

  const handleFormOpen = () => {
    setTitle("Add User");
    setIsOpen(true);
  };

  const handleEdit = (data: any) => {
    let roleID = data?.role;
    roleID = "" + roleID;
    const role = Object.keys(roles).find((items) => items === roleID);
    data = { ...data, role };

    setUser(data);
    setTitle("Update User");
    setIsOpen(true);
  };
  const onSearch = (value: any) => {
    settLoading(true);
    setSearch(value);

    searchUser(value).then(({ data: response }) => {
      settLoading(false);

      setData(response.data);
      setTotalRecords(response.total_records);
    });
  };
  return (
    <>
      <div
        className="container mt-5"
        style={{
          margin: "",
          background: "white",
          padding: "10px",
          borderRadius: "7px",
        }}
      >
        <div style={{ width: "100%" }}>
          <div className="row">
            <div className="col-6 sm-12 ">
              <h2>Users</h2>
            </div>
            <div className="col-6 sm-12 ">
              <button
                className="btn btn-info float-right "
                style={{ fontSize: "12px" }}
                onClick={() => handleFormOpen()}
              >
                Add New
              </button>
              <Search
                placeholder="Search"
                className="float-right mr-2 btn-info"
                onSearch={onSearch}
                enterButton
                style={{ width: "auto" }}
              />
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            bordered
            pagination={false}
            loading={{ spinning: loading, indicator: antIcon }}
          />
          <br />
          <Pagination
            total={totalRecords}
            current={currentPage}
            pageSize={10}
            onChange={(page: number) => setCurrentPage(page)}
            hideOnSinglePage
          />
        </div>
      </div>
      <UserForm
        isOpen={isOpen}
        handleCloseModel={handleCloseModel}
        title={title}
        user={user}
        loading={loading}
        handleContact={handleContact}
        roles={roles}
        handleRoleChange={handleRoleChange}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default Users;
