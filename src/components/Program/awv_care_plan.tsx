import React, { useState, useRef } from "react";

import { useLocation } from "react-router-dom";

import SuperBill from "./super-bill";
import Careplan from "./AWVCarePlane";
import { Tabs } from "antd";

const AwvCarePlan: React.FC = () => {
  const location = useLocation();
  const id = location.state.questionid;
  const newTabIndex = useRef(0);

  const add = (questionid: any) => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    setItems([
      ...items,
      {
        label: "SuperBill",
        children: <SuperBill questionid={questionid} />,
        key: newActiveKey,
      },
    ]);
    setActiveKey(newActiveKey);
  };
  const defaultPanes = [
    {
      label: `Careplan`,
      children: <Careplan questionid={id} add={add} />,
      key: id,
    },
  ];
  const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
  const [items, setItems] = useState<any>(defaultPanes);

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <Tabs
      onChange={onChange}
      activeKey={activeKey}
      hideAdd
      type="card"
      items={items}
    />
  );
};
export default AwvCarePlan;
