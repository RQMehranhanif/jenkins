import Enzyme, { shallow } from "enzyme";
import Scheduled from "./Scheduled";

describe("Scheduled", () => {
  it("Render component properly without any error", () => {
    const wrapper = shallow(<Scheduled />);
    expect(wrapper.find("button")).toBeInTheDocument();
  });
});
