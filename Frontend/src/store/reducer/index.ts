import QuestionairesReducer from "./QuestionairesReducer";
import PatientReducer from "./PatientReducer";
import DashboardReducer from "./DashboardReducer";

const { combineReducers } = require("redux");

const rootReducer = combineReducers({
  questionairesReduer: QuestionairesReducer,
  PatientService: PatientReducer,
  DashboardFilters: DashboardReducer,
});

export default rootReducer;
