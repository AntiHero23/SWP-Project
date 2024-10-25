import { useState, useEffect } from "react";
import "./index.scss";
import { Form, Input, Button, Select, Upload, Image, InputNumber } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../../assets/hook/useUpload";

function AddKoi() {
  const [koiName, setKoiName] = useState("");
  const [birthday, setBirthday] = useState(new Date().toISOString());
  const [koiSex, setKoiSex] = useState("");
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
  const [standardRanges, setStandardRanges] = useState(null);
  const [form] = Form.useForm();
  const length = Form.useWatch("length", form);
  const weight = Form.useWatch("weight", form);

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
        setPonds(response.data || []);
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
        setKoiVarieties(response.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVarieties();
  }, []);

  const fetchStandardRanges = async (varietyId, birthday, sex) => {
    console.log(varietyId, birthday, sex);
    try {
      const response = await api.post("koistandard/byKoiVarietyID", {
        varietyID: varietyId,
        koiBirthday: birthday,
        koiSex: sex,
      });
      setStandardRanges(response.data.result);
    } catch (error) {
      console.error("Error fetching standard ranges:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const url = await uploadFile(fileList[0].originFileObj);
      values.image = url;
      const response = await api.post("koifish/create", values);
      console.log(response.data);
      alert("Koi added successfully");
      navigate("/managerKoi");
    } catch (error) {
      console.error("koi adding failed", error);
    }
  };

  useEffect(() => {
    if (koiVarietyID && birthday && koiSex) {
      fetchStandardRanges(koiVarietyID, birthday, koiSex);
    }
  }, [koiVarietyID, birthday, koiSex]);

  return (
    <div className="addKoi">
      <div className="addKoi-form-container">
        <h1 className="addKoi-title">Add Koi</h1>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="koiName"
            rules={[{ required: true, message: "Please input your koi name" }]}
          >
            <Input
              value={koiName}
              onChange={(e) => setKoiName(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Birthday"
            name="birthday"
            rules={[
              { required: true, message: "Please input your koi birthday" },
            ]}
          >
            <Input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Sex"
            name="koiSex"
            rules={[{ required: true, message: "Please input your koi sex" }]}
          >
            <Select
              options={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
              ]}
              value={koiSex}
              onChange={(e) => setKoiSex(e)}
            />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image"
            rules={[
              { required: true, message: "Please upload your koi image" },
            ]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            label="Pond"
            name="pondID"
            rules={[{ required: true, message: "Please select your koi pond" }]}
          >
            <Select
              value={pondID}
              onChange={(value) => setPondID(value)}
              options={pondOptions}
            ></Select>
          </Form.Item>
          <Form.Item
            label="Variety ID"
            name="koiVarietyID"
            rules={[
              { required: true, message: "Please select your koi variety" },
            ]}
          >
            <Select
              value={koiVarietyID}
              onChange={(value) => setKoiVarietyID(value)}
              options={varietyOptions}
            ></Select>
          </Form.Item>
          <Form.Item
            label="Length(cm):"
            name="length"
            rules={[
              { required: true, message: "Please input your koi length" },
            ]}
            extra={
              standardRanges
                ? `Recommended range: ${standardRanges.lowLength}cm - ${standardRanges.hiLength}cm`
                : ""
            }
            help={
              standardRanges &&
              length &&
              (length < standardRanges.lowLength ||
                length > standardRanges.hiLength) ? (
                <span style={{ color: "red" }}>
                  Warning: Length is outside the recommended range
                </span>
              ) : (
                ""
              )
            }
          >
            <InputNumber
              min={0}
              placeholder="Length in cm"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="Weight(g):"
            name="weight"
            rules={[
              { required: true, message: "Please input your koi weight" },
            ]}
            extra={
              standardRanges
                ? `Recommended range: ${standardRanges.lowWeigh}g - ${standardRanges.hiWeight}g`
                : ""
            }
            help={
              standardRanges &&
              weight &&
              (weight < standardRanges.lowWeigh ||
                weight > standardRanges.hiWeight) ? (
                <span style={{ color: "red" }}>
                  Warning: Weight is outside the recommended range
                </span>
              ) : (
                ""
              )
            }
          >
            <InputNumber
              min={0}
              placeholder="Weight in grams"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              style={{ marginRight: 10 }}
              onClick={() => navigate("/managerKoi")}
            >
              Back
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
