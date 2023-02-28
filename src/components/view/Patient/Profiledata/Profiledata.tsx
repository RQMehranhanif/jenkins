import { Descriptions } from "antd";
import React from "react";

// import { Container } from './styles';
interface props {
  patient: any;
}

const Profiledata: React.FC<props> = ({ patient }) => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 col-lg-8">
            <div className="card border-info">
              <div className="card-body">
                <h5 className="card-title text-center mb-3">
                  PATIENT INFORMATION
                </h5>

                <Descriptions>
                  <Descriptions.Item label="First Name">
                    {patient?.first_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mid Name">
                    {patient?.mid_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Name">
                    {patient?.last_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Gender">
                    {patient?.gender}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {patient?.contact_no}
                  </Descriptions.Item>
                  <Descriptions.Item label="Age / DOB">
                    {patient?.age} / {patient?.dob}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {patient?.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="City">
                    {patient?.city}
                  </Descriptions.Item>
                  <Descriptions.Item label="State">
                    {patient?.state}
                  </Descriptions.Item>
                  <Descriptions.Item label="Identity">
                    {patient?.identity}
                  </Descriptions.Item>
                  <Descriptions.Item label="ZipCode">
                    {patient?.zipCode}
                  </Descriptions.Item>
                  <Descriptions.Item label="Doctor name">
                    {patient?.doctor_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {patient?.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address 2">
                    {patient?.address_2}
                  </Descriptions.Item>
                  <Descriptions.Item label="Insurance name">
                    {patient?.insurance_name}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4">
            <div className="card border-info">
              <div className="card-body">
                <h5 className="card-title text-center mb-2">FAMILY HISTORY</h5>

                {/* <div className="row mb-3">
                                    <div className="col-md-4 col-lg-4">
                                        <h6 className="card-text font-weight-bold">First Name: {patient?.first_name}</h6>

                                    </div>
                                    <div className="col-md-4 col-lg-4">
                                        <h6 className="card-text ">Mid Name: {patient?.mid_name}</h6>

                                    </div>
                                    <div className="col-md-4 col-lg-4">
                                        <h6 className="card-text ">Last Name: {patient?.last_name}</h6>

                                    </div>

                                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profiledata;
