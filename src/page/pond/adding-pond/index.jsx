import React, { useState } from "react";
import { Form, Input, Button, Image, Upload, InputNumber } from "antd";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../../assets/hook/useUpload";
import "./index.scss";

function AddPond() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePondStandard = async (value) => {
    try {
      const response = await api.get(`admin/viewByArea/${value}`);
      // console.log(response.data.result);
      const {
        minDepth,
        maxDepth,
        minVolume,
        maxVolume,
        minPumpingCapacity,
        maxPumpingCapacity,
        drainCount,
        skimmerCount,
      } = response.data.result;
      form.setFieldsValue({
        depth: minDepth,
        volume: (maxVolume + minVolume) / 2,
        pumpingCapacity: (maxPumpingCapacity + minPumpingCapacity) / 2,
        drainCount: drainCount,
        skimmerCount: skimmerCount,
      });
    } catch (error) {
      console.log(error);
    }
  };

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

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const url = await uploadFile(fileList[0].originFileObj);
      console.log(url);
      values.pondImage = url;
      const response = await api.post("pond/create", values);
      console.log(response.data);
      alert("Pond added successfully");
      navigate("/managerPond");
    } catch (error) {
      console.log("pond adding failed");
    }
  };

  return (
    <div className="addPond-container">
      <div className="addPond-form-container">
        <Form
          layout="vertical"
          form={form}
          name="add-pond-form"
          onFinish={handleSubmit}
          className="addPond-form"
        >
          <h1 className="addPond-title">Add Pond</h1>

          <Form.Item
            label="Pond Name"
            name="pondName"
            rules={[{ required: true, message: "Please input pond name!" }]}
            className="form-item"
          >
            <Input className="form-input" />
          </Form.Item>

          <Form.Item
            label="Image"
            name="pondImage"
            rules={[{ required: true, message: "Please upload pond image!" }]}
            className="form-item"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              className="upload-container"
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item
            label="Area: m2"
            name="area"
            rules={[
              { required: true, message: "Please input area!" },
              {
                validator: (_, value) =>
                  value > 5
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Area must be greater than 5 m2")
                      ),
              },
            ]}
            className="form-item"
          >
            <Input
              type="number"
              className="form-input"
              min={0}
              onChange={(e) => {
                const value = e.target.value;
                if (value >= 5) {
                  handlePondStandard(value);
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="Depth: m"
            name="depth"
            rules={[{ required: true, message: "Please input depth!" }]}
            className="form-item"
          >
            <InputNumber
              min={0}
              placeholder="Depth"
              className="form-input"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Volume: L"
            name="volume"
            rules={[{ required: true, message: "Please input volume!" }]}
            className="form-item"
          >
            <Input type="number" className="form-input" min={0} />
          </Form.Item>

          <Form.Item
            label="Drain Count: "
            name="drainCount"
            rules={[{ required: true, message: "Please input drain count!" }]}
            className="form-item"
          >
            <Input type="number" className="form-input" min={0} />
          </Form.Item>

          <Form.Item
            label="Skimmer Count: "
            name="skimmerCount"
            rules={[{ required: true, message: "Please input skimmer count!" }]}
            className="form-item"
          >
            <Input type="number" className="form-input" min={0} />
          </Form.Item>

          <Form.Item
            label="Pumping Capacity: L/h"
            name="pumpingCapacity"
            rules={[
              { required: true, message: "Please input pumping capacity!" },
            ]}
            className="form-item"
          >
            <Input type="number" className="form-input" min={0} />
          </Form.Item>

          <Form.Item className="submit-button-container">
            <Button type="primary" htmlType="submit" className="submit-button">
              Add Pond
            </Button>
          </Form.Item>
          <Form.Item className="back-button-container">
            <Button
              type="default"
              onClick={() => navigate(-1)}
              className="back-button"
            >
              Back
            </Button>
          </Form.Item>
        </Form>
      </div>

      {previewImage && (
        <Image
          className="image-preview"
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
  );
}

export default AddPond;
