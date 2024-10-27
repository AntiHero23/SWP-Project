import React from "react";
import PropTypes from 'prop-types';
import {
  Modal,
  Form,
  InputNumber,
  Row,
  Col,
  Popover,
  Input,
} from "antd";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { WATER_PARAMETERS } from "../../../constants/waterValidation";
import dayjs from "dayjs";

const onChange = (date, dateString) => {
  console.log(date, dateString);
};

const CreateWaterReportModal = ({
  isModalOpen,
  handleCancel,
  form,
  handleCreateWaterReport,
  pondID,
}) => {
  const onFinish = (values) => {
    const formattedData = {
      waterReportUpdatedDate: dayjs(values.waterUpdateDate).format(
        "YYYY-MM-DD"
      ),
      waterReportTemperature: values.temperature,
      waterReportOxygen: values.oxygen,
      waterReport_pH: values.pH,
      waterReportHardness: values.hardness,
      waterReportAmmonia: values.ammonia,
      waterReportNitrite: values.nitrite,
      waterReportNitrate: values.nitrate,
      waterReportCarbonate: values.carbonate,
      waterReportSalt: values.salt,
      waterReportCarbonDioxide: values.carbonDioxide,
      pondID: pondID,
    };

    handleCreateWaterReport(formattedData);
  };

  const renderFormItem = (name, label) => {
    const param = WATER_PARAMETERS[name];
    
    return (
      <Form.Item
        label={
          <span>
            {label}{" "}
            <Popover
              content={
                <div>
                  <p>{param.errorMessage}</p>
                </div>
              }
            >
              <AiOutlineExclamationCircle style={{ cursor: "pointer" }} />
            </Popover>
          </span>
        }
        name={name}
      >
        <InputNumber
          style={{ width: "100%" }}
          step="0.1"
          placeholder={`Enter ${label}`}
          onChange={(value) => {
            if (value !== null && (value < param.min || value > param.max)) {
              form.setFields([
                {
                  name,
                  errors: [param.errorMessage],
                  status: 'error'
                }
              ]);
            } else {
              form.setFields([
                {
                  name,
                  errors: [],
                  status: 'success'
                }
              ]);
            }
          }}
        />
      </Form.Item>
    );
  };

  return (
    <Modal
      title={<h2>Create Water Report</h2>}
      open={isModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Water Update Date"
          name="waterUpdateDate"
          rules={[{ required: true, message: "Please select a date!" }]}
        >
          <Input type="date" placeholder="Date" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            {renderFormItem("temperature", "Temperature")}
            {renderFormItem("oxygen", "Oxygen")}
            {renderFormItem("pH", "pH")}
            {renderFormItem("hardness", "Hardness")}
            {renderFormItem("ammonia", "Ammonia")}
          </Col>
          <Col span={12}>
            {renderFormItem("nitrite", "Nitrite")}
            {renderFormItem("nitrate", "Nitrate")}
            {renderFormItem("carbonate", "Carbonate")}
            {renderFormItem("salt", "Salt")}
            {renderFormItem("carbonDioxide", "Carbon Dioxide")}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

CreateWaterReportModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  handleCreateWaterReport: PropTypes.func.isRequired,
  pondID: PropTypes.string.isRequired,
};

export default CreateWaterReportModal;
