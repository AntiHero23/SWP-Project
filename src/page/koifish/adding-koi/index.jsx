import React, { useState, useEffect } from "react";
import "./index.scss";
import { Form, Input, Button, Select, Upload, Image, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { Option } from "antd/es/mentions";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../../assets/hook/useUpload";

function AddKoi() {
  const [koiName, setKoiName] = useState("");
  const [birthday, setBirthday] = useState(new Date().toISOString());
  const [koiSex, setKoiSex] = useState("");
  const [image, setImage] = useState("");
  const [pondID, setPondID] = useState(0);
  const [koiVarietyID, setKoiVarietyID] = useState(0);
  const [ponds, setPonds] = useState([]);
  const [koiVarieties, setKoiVarieties] = useState([]);
  const navigate = useNavigate();
  const pondOptions = ponds.map((pond) => ({
    value: pond.pondID,
    label: pond.pondName,
  }));
  const varietyOptions = koiVarieties.map((variety) => ({
    value: variety.koiVarietyID,
    label: variety.varietyName,
  }));

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
        color: "black",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  useEffect(() => {
    const fetchPonds = async () => {
      try {
        const response = await api.get("pond");
        setPonds(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPonds();
  }, []);
  useEffect(() => {
    const fetchVarieties = async () => {
      try {
        const response = await api.get("koivariety");
        setKoiVarieties(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVarieties();
  }, []);

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const url = await uploadFile(fileList[0].originFileObj);
      values.image = url;
      const response = await api.post("koifish/create", values);
      console.log(response.data);
      alert("Koi added successfully");
      // navigate("/managerKoi");
    } catch (error) {
      console.error("koi adding failed", error);
    }
  };

  return (
    <div className="addKoi">
      <div className="addKoi-form-container">
        <h1 className="addKoi-title">Add Koi</h1>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Name" name="koiName">
            <Input
              value={koiName}
              onChange={(e) => setKoiName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Birthday" name="birthday">
            <Input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Sex" name="koiSex">
            <Select
              options={[
                { label: "male", value: "Male" },
                { label: "female", value: "Female" },
              ]}
              value={koiSex}
              onChange={(e) => setKoiSex(e)}
            />
          </Form.Item>
          <Form.Item label="Image" name="image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item label="Pond" name="pondID">
            <Select
              value={pondID}
              onChange={(value) => setPondID(value)}
              options={pondOptions}
            ></Select>
          </Form.Item>
          <Form.Item label="Variety ID" name="koiVarietyID">
            <Select
              value={koiVarietyID}
              onChange={(value) => setKoiVarietyID(value)}
              options={varietyOptions}
            ></Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </Form.Item>
        </Form>
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </div>
    </div>
  );
}

export default AddKoi;
