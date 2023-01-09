import React, { useEffect, useState } from "react";
import { Card, Container, Row, Table } from "react-bootstrap";
import "../../assets/css/style.css";
import "./Dashboard.css";
import { Spin } from "antd";
import { FilterData } from "../../actions/Dashboard/Dashboard";
import { useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../store/store";
import { LoadingOutlined } from "@ant-design/icons";

function Dashboard() {
  const [data, setdata] = useState({
    totalPopulation: 0,
    activeUsers: 0,
    group_a1: 0,
    group_a2: 0,
    group_b: 0,
    group_c: 0,
    total_refused: 0,
    total_scheduled: 0,
    total_scheduled_A12: 0,
    awv_completed_A12: 0,
    awv_completed_A12_per: 0,
    awv_completed_population_per: 0,
    awv_completed_total: 0,
    awv_pending_A12: 0,
    awv_pending_A12_per: 0,
    awv_pending_population: 0,
    awv_pending_population_per: 0,
  });
  const [loading, setloading] = useState(false);

  const { doctor_id, program_id, clinic_id, insurance_id } = useAppSelector(
    (state: RootState) => state.DashboardFilters
  );

  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  useEffect(() => {
    setloading(true);
    FilterData(doctor_id, program_id, clinic_id, insurance_id).then(
      ({ data: response }) => {
        const { data } = response;
        setdata(data);
        setloading(false);
      }
    );
  }, [doctor_id, program_id, clinic_id, insurance_id]);

  return (
    <Spin spinning={loading} size="large" tip="Loading" indicator={antIcon}>
      <Container fluid className="mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 col-xl-12">
              <div className="cards mb-4" style={{ minHeight: "70px" }}>
                <div className="row  align-items-center">
                  <div className="col-5 text-left ">
                    <div className="card-block p-0">
                      <h5 className=" m-0  text-right mt-3">
                        Total Population
                      </h5>
                    </div>
                  </div>
                  <div className="col-1 text-center ">
                    <div className="card-block p-0">
                      <i className="fa fa-users foricon text-success  mt-3" />
                    </div>
                  </div>
                  <div className="col-5 ">
                    <div className="card-block p-0">
                      <h5 className="m-0  text-left  mt-3">
                        <a className="text-secondary link ml-4  ">
                          {data?.totalPopulation}
                        </a>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-xl-6">
              <div
                className=" mb-0 card bg-c-green foruse order-card mb-3 "
                style={{ minHeight: "144px" }}
              >
                <div className="row  ">
                  <div className="col-4 text-left ">
                    <div className="card-block ">
                      <h5 className="m-0 text-nowrap">Active Users</h5>
                    </div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="card-block">
                      <i
                        className="fa fa-user fa-lg foricon text-primary   "
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div className="col-4 ">
                    <div className="card-block">
                      <h5 className="m-0 text-nowrap text-right ">
                        {data?.activeUsers}
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 ">
                    <div className="card-block">
                      <h6 className="m-0">
                        <b>Group A1</b>
                        <span className="font-weight-bold ml-4 ">
                          {data?.group_a1}
                        </span>
                      </h6>
                      <h6 className="text-secondary mt-1">
                        Last seen 6 months ago
                      </h6>
                    </div>
                  </div>
                  <div className="col-6 ">
                    <div className="card-block">
                      <h6 className="m-0">
                        <b>Group A2</b>
                        <span className="font-weight-bold ml-4 ">
                          {data?.group_a2}
                        </span>
                      </h6>
                      <h6 className="text-secondary mt-1">
                        Last seen 6 - 12 months ago
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-xl-3">
              <div
                className="card bg-c-pink order-card mb-3"
                style={{ minHeight: "144px" }}
              >
                <div className="row">
                  <div className="col-5 text-center">
                    <div className="card-block">
                      <h5 className="text-left m-0">Group B</h5>
                    </div>
                  </div>
                  <div className="col-2 ">
                    <i
                      className="fa fa-user-times text-info ml-2 mt-2"
                      aria-hidden="true"
                      style={{ fontSize: "35px" }}
                    />
                  </div>
                  <div className="col-5 text-center">
                    <div className="card-block">
                      <h5 className="f-right">{data?.group_b}</h5>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 ">
                    <div className="card-block">
                      <h6 className="text-secondary pt-3">
                        Bad Patients PCP Changed / Deceased / Hospice / Relocate
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-xl-3">
              <div
                className="card bg-c-pink order-card mb-3"
                style={{ minHeight: "144px" }}
              >
                <div className="row">
                  <div className="col-5 text-center">
                    <div className="card-block">
                      <h5 className="text-left m-0">Group C</h5>
                    </div>
                  </div>
                  <div className="col-2 ">
                    <i
                      className="fa fa-user-minus text-danger ml-2 mt-2"
                      aria-hidden="true"
                      style={{ fontSize: "35px" }}
                    />
                  </div>
                  <div className="col-5 text-center">
                    <div className="card-block">
                      <h5 className="f-right">{data?.group_c}</h5>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 ">
                    <div className="card-block">
                      <h6 className="text-secondary pt-3">
                        Contact Not seen in last 12 months
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*   <div className="col-md-12 col-xl-3">
              <div className="card bg-c-pink order-card">
                <div className="row">
                  <div className="col-12 text-center">
                    <div className="card-block">
                      <i
                        className="fa fa-user-minus fa-lg foricon text-danger  "
                        aria-hidden="true"
                      />
                      <h4 className="text-left m-0 mt-3">
                        Group C <span className="f-right">{data?.group_c}</span>
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 ">
                    <div className="card-block">
                      <small className="text-secondary">
                        Contact Not seen in last 12 months
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <Row>
          <div className="col-md-12 col-xl-8">
            <Card className="card-stats dashboardCard">
              <Table hover className="text-dark">
                <thead>
                  <tr>
                    <th>Program</th>
                    <th>Members</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ paddingTop: 0 }}>
                      Annual Wellness Completed Total
                    </td>
                    <td>{data?.awv_completed_total}</td>
                    <td>{data?.awv_completed_population_per.toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td>Annual Wellness Completed From Group A1 & Group A2</td>
                    <td>{data?.awv_completed_A12}</td>
                    <td>{data?.awv_completed_A12_per.toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td>Annual Wellness Incomplete From Group A1 & Group A2</td>
                    <td>{data?.awv_pending_A12}</td>
                    <td>{data?.awv_pending_A12_per.toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td> Annual Wellness Incomplete From Population </td>
                    <td>{data?.awv_pending_population}</td>
                    <td>{data?.awv_pending_population_per.toFixed(2)}%</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </div>
          <div className="col-md-12 col-xl-4">
            <Card className="card-stats dashboardCard">
              <Table hover className="text-dark">
                <thead>
                  <tr>
                    <th>Scheduled</th>
                    <th>Member</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total Scheduled from Group A1 & A2</td>
                    <td>{data?.total_scheduled_A12}</td>
                  </tr>
                  <tr>
                    <td>Total Scheduled from Total Poplulation</td>
                    <td>{data?.total_scheduled}</td>
                  </tr>
                  <tr>
                    <td>Total Refused</td>
                    <td>{data?.total_refused}</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </Spin>
  );
}

export default Dashboard;
