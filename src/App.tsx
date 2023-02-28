import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/css/ccmcareplan.css";
import "./assets/css/awvcareplan.css";
import "antd/dist/antd.min.css";
import "assets/css/style.css";

import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import Users from "./components/view/Users/Users";
import ClinicAdmin from "./components/view/clinicAdmin/ClinicAdmin";
import Program from "./components/view/programs/Program";
import Insurance from "./components/view/insurance/Insurance";
import Clinic from "./components/view/clinic/Clinic";
import Specialists from "./components/view/specialist/Specialists";
import Login from "./components/view/Login/Login";
import Physician from "./components/view/physician/Physician";
import TABS from "./components/view/Patient/Tabs";
import Scheduled from "./components/view/scheduled/Scheduled";
import Questionaires from "./components/view/Questionaires/Questionairs";
import QuestionairesForm from "./components/view/Questionaires/QuestionairesForm/QuestionairesForm";
import AwvCarePlan from "./components/Program/awv_care_plan";
import SuperBill from "./components/Program/super-bill";
import CCMGeneralCarePlan from "./components/Program/ccm_care_plan";
import CCMMonthlyCarePlan from "./components/Program/ccm_monthly_careplan";
import Viewquestions from "./components/view/Questionview/Viewquestions";

//
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/Questionnaires"
          element={
            <Layout>
              <Questionaires />
            </Layout>
          }
        />

        <Route
          path="/users"
          element={
            <Layout>
              <Users />
            </Layout>
          }
        />
        <Route
          path="/Clinic"
          element={
            <Layout>
              <Clinic />
            </Layout>
          }
        />
        <Route
          path="/ClinicAdmin"
          element={
            <Layout>
              <ClinicAdmin />
            </Layout>
          }
        />
        <Route
          path="/ClinicAdmin"
          element={
            <Layout>
              <ClinicAdmin />
            </Layout>
          }
        />
        <Route
          path="/clinics"
          element={
            <Layout>
              <Clinic />
            </Layout>
          }
        />

        <Route
          path="/Program"
          element={
            <Layout>
              <Program />
            </Layout>
          }
        />

        <Route
          path="/Physician"
          element={
            <Layout>
              <Physician />
            </Layout>
          }
        />
        <Route
          path="/specialists"
          element={
            <Layout>
              <Specialists />
            </Layout>
          }
        />
        <Route
          path="/patients"
          element={
            <Layout>
              <TABS />
            </Layout>
          }
        />
        <Route
          path="/insurances"
          element={
            <Layout>
              <Insurance />
            </Layout>
          }
        />

        <Route
          path="/scheduled"
          element={
            <Layout>
              <Scheduled />
            </Layout>
          }
        />
        <Route
          path="/questionaires/create"
          element={
            <Layout>
              <QuestionairesForm />
            </Layout>
          }
        />
        <Route
          path="/awvcareplan/:id"
          element={
            <Layout>
              <AwvCarePlan />
            </Layout>
          }
        />
        <Route
          path="/view_questions/:id"
          element={
            <Layout>
              <Viewquestions />
            </Layout>
          }
        />

        <Route
          path="/ccm-general-careplan/:id"
          element={
            <Layout>
              <CCMGeneralCarePlan />
            </Layout>
          }
        />

        <Route
          path="/ccm-monthly-careplan/:id"
          element={
            <Layout>
              <CCMMonthlyCarePlan />
            </Layout>
          }
        />

        <Route
          path="/questionaire/edit/:id"
          element={
            <Layout>
              <QuestionairesForm />
            </Layout>
          }
        />
        <Route
          path="/questionaire/superbill/:id"
          element={
            <Layout>
              <SuperBill questionid={undefined} />
            </Layout>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
