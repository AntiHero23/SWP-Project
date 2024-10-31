import { Button, Card, Col, Row, Table, Tag, Select, Input } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function AdminHome() {
  const [adminInfo, setAdminInfo] = useState([]);
  const [historyTransaction, setHistoryTransaction] = useState([]);
  const [totalAccount, setTotalAccount] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [memberPackages, setMemberPackages] = useState([]);
  const [shopPackages, setShopPackages] = useState([]);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedPackageYear, setSelectedPackageYear] = useState(dayjs().year());
  const [filteredData, setFilteredData] = useState([]);
  const [packageSearch, setPackageSearch] = useState("All");
  const [dateSearch, setDateSearch] = useState("");
  const [packageOptions, setPackageOptions] = useState([]);
  const [searchCustomer, setSearchCustomer] = useState("");

  const navigate = useNavigate();

  // Mapping for package types
  const packageMapping = {
    "normal-me": "Normal",
    "vip-me": "VIP",
    "supervip-me": "Super VIP",
    "normal-sh": "Normal",
    "vip-sh": "VIP",
    "supervip-sh": "Super VIP",
  };

  // Helper function to calculate percentages
  const calculatePercentage = (value, total) =>
    ((value / total) * 100).toFixed(2);

  const getTotalAccount = async () => {
    try {
      const response = await api.get("admin/totalAccount");
      setTotalAccount(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalOrder = async () => {
    try {
      const response = await api.get("admin/totalOrder");
      setTotalOrder(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalRevenue = async () => {
    try {
      const response = await api.get("admin/totalRevenue");
      setTotalRevenue(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const getAdminInfo = async () => {
    try {
      const response = await api.get("currentAccount");
      setAdminInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchHistoryTransaction = async () => {
    try {
      const responsePeding = await api.get("transaction/viewAll");
      setHistoryTransaction(responsePeding.data);
      setFilteredData(responsePeding.data);
      const uniquePackages = [
        ...new Set(responsePeding.data.map((item) => item.apackage)),
      ];
      setPackageOptions([
        { value: "All", label: "All" },
        ...uniquePackages.map((pkg) => ({ value: pkg, label: pkg })),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const response = await api.get("statistic/revenue");
      const result = response.data.result;

      // Create an array of all 12 months for the selected year
      const fullYearData = Array.from({ length: 12 }, (_, index) => {
        const monthData = result.find(
          (item) => item.month === index + 1 && item.year === selectedYear
        );

        return {
          month: dayjs().month(index).format("MMMM"), // This ensures all months (0-11) are included
          year: selectedYear,
          revenue: monthData ? monthData.revenue : 0,
        };
      });

      // Sort the data to ensure months are in correct order
      const sortedData = fullYearData.sort(
        (a, b) =>
          dayjs().month(a.month).format("M") -
          dayjs().month(b.month).format("M")
      );

      setRevenueData(sortedData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMemberPackages = async () => {
    try {
      const response = await api.get("statistic/memberpackage", {
        params: { month: selectedMonth, year: selectedPackageYear },
      });
      const filteredMemberPackages = response.data.result.filter(
        (pkg) => pkg.month === selectedMonth && pkg.year === selectedPackageYear
      );
      setMemberPackages(filteredMemberPackages);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchShopPackages = async () => {
    try {
      const response = await api.get("statistic/shoppackage", {
        params: { month: selectedMonth, year: selectedPackageYear },
      });
      const filteredShopPackages = response.data.result.filter(
        (pkg) => pkg.month === selectedMonth && pkg.year === selectedPackageYear
      );
      setShopPackages(filteredShopPackages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHistoryTransaction();
    getTotalAccount();
    getTotalOrder();
    getTotalRevenue();
    getAdminInfo();
    fetchRevenueData();
    fetchMemberPackages();
    fetchShopPackages();
  }, []);

  useEffect(() => {
    const filtered = historyTransaction.filter((item) => {
      const matchesPackage = packageSearch
        ? packageSearch === "All"
          ? true
          : item.apackage === packageSearch
        : true;
      const matchesDate = dateSearch
        ? dayjs(item.date).format("YYYY-MM-DD").includes(dateSearch)
        : true;
      return matchesPackage && matchesDate;
    });
    setFilteredData(filtered);
  }, [historyTransaction, packageSearch, dateSearch]);

  useEffect(() => {
    let name = historyTransaction;
    if (searchCustomer) {
      name = name.filter((data) =>
        data.customer.toLowerCase().includes(searchCustomer.toLowerCase())
      );
    }
    setFilteredData(name);
  }, [searchCustomer, historyTransaction]);

  useEffect(() => {
    fetchRevenueData();
  }, [selectedYear]);

  useEffect(() => {
    fetchMemberPackages();
    fetchShopPackages();
  }, [selectedMonth, selectedPackageYear]);

  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const COLORS = {
    Normal: "#00C49F",   // Green for Normal
    VIP: "#0088FE",      // Yellow for VIP
    "Super VIP": "#FFBB28"  // Blue for Super VIP
  };

  const columns = [
    {
      title: <b style={{ fontSize: "18px" }}>Order Code</b>,
      dataIndex: "orderCode",
      key: "orderCode",
    },
    {
      title: <b style={{ fontSize: "18px" }}>Package</b>,
      dataIndex: "apackage",
      key: "apackage",
      render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
    },
    {
      title: <b style={{ fontSize: "18px" }}>Price</b>,
      dataIndex: "price",
      key: "price",
      render: (value) => VND.format(value),
    },
    {
      title: <b style={{ fontSize: "18px" }}>Date of purchase</b>,
      dataIndex: "date",
      key: "date",
      render: (value) => <p>{dayjs(value).format("MMMM D, YYYY h:mm A")}</p>,
    },
    {
      title: <b style={{ fontSize: "18px" }}>Expiration date</b>,
      dataIndex: "duration",
      key: "duration",
      render: (value, record) => {
        const date = dayjs(record.date).add(record.duration, "month");
        return date.format("MMMM D, YYYY h:mm A");
      },
    },
    {
      title: <b style={{ fontSize: "18px" }}>Status</b>,
      dataIndex: "status",
      key: "status",
      render: (value) => {
        if (value === "FAIL") {
          return <Tag color="red">{value}</Tag>;
        } else if (value === "SUCCESS") {
          return <Tag color="green">{value}</Tag>;
        }
      },
    },
    {
      title: <b style={{ fontSize: "18px" }}>Customer</b>,
      dataIndex: "customer",
      key: "customer",
    },
  ];

  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        Welcome back, {adminInfo.name || adminInfo.email}!
      </h1>
      <br />
      <h2>Overview</h2>
      <br />
      <Row gutter={16} style={{ textAlign: "center" }}>
        <Col span={8}>
          <Card
            title={<b style={{ fontSize: "24px" }}>Total Account</b>}
            bordered={false}
            style={{ backgroundColor: "#6495ed" }}
          >
            {`${totalAccount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={<b style={{ fontSize: "24px" }}>Total Order</b>}
            bordered={false}
            style={{ backgroundColor: "#6495ed" }}
          >
            {totalOrder}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={<b style={{ fontSize: "24px" }}>Total Revenue</b>}
            bordered={false}
            style={{ backgroundColor: "#6495ed" }}
          >
            {VND.format(totalRevenue)}
          </Card>
        </Col>
      </Row>
      <br />
      <h2>Transaction Dashboard</h2>
      <div style={{ marginBottom: "20px" }}>
        <Select
          value={selectedYear}
          onChange={setSelectedYear}
          style={{ width: 120 }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Select.Option key={i} value={dayjs().year() - 2 + i}>
              {dayjs().year() - 2 + i}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value, name, props) => {
                const monthYear = `${props.payload.month} ${props.payload.year}`;
                return [VND.format(value), `${name} (${monthYear})`];
              }}
            />
            <Legend />
            <Bar dataKey="revenue" name="Revenue" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <br />

      {/* Package Statistics Section */}
      <h2>Package Statistics</h2>
      <div style={{ marginBottom: "20px" }}>
      <Select
          value={selectedMonth}
          onChange={setSelectedMonth}
          style={{ width: 120, marginLeft: "10px" }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <Select.Option key={i} value={i + 1}>
              {dayjs().month(i).format("MMMM")}
            </Select.Option>
          ))}
        </Select>
        <Select
          value={selectedPackageYear}
          onChange={setSelectedPackageYear}
          style={{ width: 120, marginLeft: "10px" }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Select.Option key={i} value={dayjs().year() - 2 + i}>
              {dayjs().year() - 2 + i}
            </Select.Option>
          ))}
        </Select>
        </div>
      <Row gutter={16}>
        <Col span={12}>
          <h3>Member Packages</h3>
          <ResponsiveContainer width="100%" height={300}>
          <PieChart>
  <Pie
    data={memberPackages}
    dataKey="numberOfPackage"
    nameKey="nameOfPackage"
    outerRadius={100}
    label={(entry) => {
      const total = memberPackages.reduce(
        (sum, item) => sum + item.numberOfPackage,
        0
      );
      return `${packageMapping[entry.nameOfPackage]}: ${calculatePercentage(
        entry.numberOfPackage,
        total
      )}%`;
    }}
  >
    {memberPackages.map((entry) => (
      <Cell
        key={`cell-${entry.nameOfPackage}`}
        fill={COLORS[packageMapping[entry.nameOfPackage]]}
      />
    ))}
  </Pie>
  <Tooltip
    formatter={(value, name, props) => {
      const total = memberPackages.reduce(
        (sum, item) => sum + item.numberOfPackage,
        0
      );
      const percentage = calculatePercentage(value, total);
      return [
        `${value} (${percentage}%)`,
        packageMapping[props.payload.nameOfPackage],
      ];
    }}
  />
  <Legend
    payload={[
      { value: "Normal", type: "square", color: COLORS.Normal },
      { value: "VIP", type: "square", color: COLORS.VIP },
      { value: "Super VIP", type: "square", color: COLORS["Super VIP"] },
    ]}
  />
</PieChart>
          </ResponsiveContainer>
        </Col>
        <Col span={12}>
          <h3>Shop Packages</h3>
          <ResponsiveContainer width="100%" height={300}>
          <PieChart>
        <Pie
          data={shopPackages}
          dataKey="numberOfPackage"
          nameKey="nameOfPackage"
          outerRadius={100}
          label={(entry) => {
            const total = shopPackages.reduce(
              (sum, item) => sum + item.numberOfPackage,
              0
            );
            return `${packageMapping[entry.nameOfPackage]}: ${calculatePercentage(
              entry.numberOfPackage,
              total
            )}%`;
          }}
        >
          {shopPackages.map((entry) => (
            <Cell
              key={`cell-${entry.nameOfPackage}`}
              fill={COLORS[packageMapping[entry.nameOfPackage]]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => {
            const total = shopPackages.reduce(
              (sum, item) => sum + item.numberOfPackage,
              0
            );
            const percentage = calculatePercentage(value, total);
            return [
              `${value} (${percentage}%)`,
              packageMapping[props.payload.nameOfPackage],
            ];
          }}
        />
        <Legend
          payload={[
            { value: "Normal", type: "square", color: COLORS.Normal },
            { value: "VIP", type: "square", color: COLORS.VIP },
            { value: "Super VIP", type: "square", color: COLORS["Super VIP"] },
          ]}
        />
      </PieChart>
          </ResponsiveContainer>
        </Col>
      </Row>

      <br />
      <h2>History Transaction</h2>
      <div style={{ textAlign: "center" }}>
        <Select
          placeholder="Select package"
          value={packageSearch}
          onChange={(value) => setPackageSearch(value)}
          style={{ marginBottom: 20, width: 200 }}
          options={packageOptions}
        />
        <Input
          type="date"
          placeholder="Search by date"
          style={{ marginLeft: 10, marginBottom: 20, width: 200 }}
          value={dateSearch}
          onChange={(value) => setDateSearch(value.target.value)}
        />
        <Input
          placeholder="Search by customer"
          style={{ marginLeft: 10, marginBottom: 20, width: 200 }}
          value={searchCustomer}
          onChange={(value) => setSearchCustomer(value.target.value)}
        />
      </div>
      <Table dataSource={filteredData} columns={columns} />
    </>
  );
}

export default AdminHome;
