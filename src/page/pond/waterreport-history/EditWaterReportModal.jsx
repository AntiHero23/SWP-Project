import { useEffect } from "react";
import { Modal, Form, InputNumber, Row, Col, Popover } from "antd";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { WATER_PARAMETERS } from "../../../constants/waterValidation";
import PropTypes from "prop-types";

const EditWaterReportModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  form,
  handleEdit,
  editingWaterReport,
}) => {
  useEffect(() => {
    if (editingWaterReport) {
      const formattedData = {
        waterUpdateDate: editingWaterReport.waterReportUpdatedDate,
        temperature: editingWaterReport.waterReportTemperature,
        oxygen: editingWaterReport.waterReportOxygen,
        pH: editingWaterReport.waterReport_pH,
        hardness: editingWaterReport.waterReportHardness,
        ammonia: editingWaterReport.waterReportAmmonia,
        nitrite: editingWaterReport.waterReportNitrite,
        nitrate: editingWaterReport.waterReportNitrate,
        carbonate: editingWaterReport.waterReportCarbonate,
        salt: editingWaterReport.waterReportSalt,
        carbonDioxide: editingWaterReport.waterReportCarbonDioxide,
      };

      form.setFieldsValue(formattedData);

      Object.entries(formattedData).forEach(([key, value]) => {
        const param = WATER_PARAMETERS[key];
        if (param && value !== null && value !== undefined) {
          if (value < param.min || value > param.max) {
            form.setFields([
              {
                name: key,
                errors: [param.errorMessage],
                status: "error",
              },
            ]);
          } else {
            form.setFields([
              {
                name: key,
                errors: [],
                status: "success",
              },
            ]);
          }
        }
      });
    }
  }, [editingWaterReport, form]);

  const onFinish = (values) => {
    const formattedData = {
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
    };

    handleEdit(formattedData);
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
                  status: "error",
                },
              ]);
            } else {
              form.setFields([
                {
                  name,
                  errors: [],
                  status: "success",
                },
              ]);
            }
          }}
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
      <Form form={form} layout="vertical" onFinish={onFinish}>
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

EditWaterReportModal.propTypes = {
  isEditModalOpen: PropTypes.bool.isRequired,
  setIsEditModalOpen: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  handleEdit: PropTypes.func.isRequired,
  editingWaterReport: PropTypes.object,
};

export default EditWaterReportModal;
