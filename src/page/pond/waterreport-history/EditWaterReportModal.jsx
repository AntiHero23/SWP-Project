import React from "react";
import { Modal, Form, InputNumber, Row, Col, Popover } from "antd";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { WATER_PARAMETERS } from "../../../constants/waterValidation";

const EditWaterReportModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  form,
  handleEdit,
  editingWaterReport
}) => {
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
                  <p>Valid range: {param.min} - {param.max} {param.unit}</p>
                  <p>{param.errorMessage}</p>
                </div>
              }
            >
              <AiOutlineExclamationCircle style={{ cursor: "pointer" }} />
            </Popover>
          </span>
        }
        name={name}
        rules={[
          { required: true, message: `Please input ${label}` },
          {
            type: 'number',
            min: param.min,
            max: param.max,
            message: param.errorMessage
          }
        ]}
      >
        <InputNumber
          style={{ width: "100%" }}
          step="0.1"
          placeholder={`Enter ${label}`}
        />
      </Form.Item>
    );
  };

  return (
    <Modal
      title={<h2>Edit Water Report</h2>}
      open={isEditModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        setIsEditModalOpen(false);
        form.resetFields();
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={editingWaterReport}
        onFinish={handleEdit}
      >
        <Row gutter={16}>
          <Col span={12}>
            {renderFormItem("temperature", "Temperature")}
            {renderFormItem("dissolvedOxygen", "Dissolved Oxygen")}
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

export default EditWaterReportModal;
