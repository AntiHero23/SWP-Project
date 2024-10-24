import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { Button, Modal, Table } from "antd";

function PondStandard() {
  const [pondStandard, setPondStandard] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [form] = useForm();
  const navigate = useNavigate();

  const fetchPondStandard = async () => {
    try {
      const response = await api.get("admin/viewall/pondstandard");
      setPondStandard(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsOpenModal(false);
  };

  useEffect(() => {
    fetchPondStandard();
  }, []);

  const columns = [
    {
      title: "Acreage",
      dataIndex: "area",
      key: "area",
      render: (value) => `${value} m²`,
    },
    {
      title: "Depth",
      dataIndex: ["minDepth", "maxDepth"],
      key: ["minDepth", "maxDepth"],
      render: (value, record) => `${record.minDepth} - ${record.maxDepth} m`,
    },
    {
      title: "Volume",
      dataIndex: ["minVolume", "maxVolume"],
      key: ["minVolume", "maxVolume"],
      render: (value, record) => `${record.minVolume} - ${record.maxVolume} l`,
    },
    // {
    //   title: "Drain Count",
    //   dataIndex: "drainCount",
    //   key: "drainCount",
    // },
    // {
    //   title: "Skimmer Count",
    //   dataIndex: "skimmerCount",
    //   key: "skimmerCount",
    // },
    // {
    //   title: "Maximum Pumping Capacity",
    //   dataIndex: "maxPumpingCapacity",
    //   key: "maxPumpingCapacity",
    //   render: (value) => `${value} l/h`,
    // },
    {
      title: "Number of fish",
      dataIndex: ["minAmountFish", "maxAmountFish"],
      key: ["minAmountFish", "maxAmountFish"],
      render: (value, record) =>
        `${record.minAmountFish} - ${record.maxAmountFish} fish`,
    },
    {
      title: "Details",
      dataIndex: "pondStandardID",
      key: "pondStandardID",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            navigate(`/admin/pondStandard/details/${value}`);
          }}
        >
          Details
        </Button>
      ),
    },
  ];
  return (
    <>
      <h1>Pond Standard</h1>
      <br />
      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          style={{ width: "175px", textAlign: "center" }}
          onClick={() => setIsOpenModal(true)}
        >
          Add Pond Standard
        </Button>
        <Modal
          title="Add Pond Standard"
          open={isOpenModal}
          onCancel={handleCancel}
          // footer={null}
        />
      </div>
      <br />
      <h2>Pond Standard Table</h2>
      <Table dataSource={pondStandard} columns={columns} />
    </>
  );
}

export default PondStandard;
