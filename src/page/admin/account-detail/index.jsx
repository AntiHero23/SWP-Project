import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { Button, Card, Modal, Tag } from "antd";

function AccountDetails() {
  const { id } = useParams();
  const userId = parseInt(id);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const navigate = useNavigate();

  const fetchAccount = async () => {
    setLoading(true);
    try {
      const response = await api.get(`account/${userId}`);
      setAccount(response.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Account Details</h1>
        <br />
        {!loading && (
          <Card style={{ backgroundColor: "#6495ed" }}>
            <Card>
              <b>Username: </b>
              {account.username}
            </Card>
            <Card>
              <b>Name: </b>
              {account.name || "-"}
            </Card>
            <Card>
              <b>Phone: </b>
              {account.phone || "-"}
            </Card>
            <Card>
              <b>Role: </b>
              {account.role}
            </Card>
            <Card>
              <b>Email: </b>
              {account.email}
            </Card>

            {account.role === "MEMBER" && (
              <Card>
                <b>Premium Status: </b>
                {account?.premiumStatus === 0
                  ? "Basic "
                  : account?.premiumStatus === 1
                  ? "Premium"
                  : "Unknown"}
              </Card>
            )}
            {account.role === "SHOP" && (
              <Card>
                <b>Number of Posts: </b>
                {account.numberOfPosts || "-"}
              </Card>
            )}
            {account.role !== "ADMIN" && (
              <Card>
                <b>Validation: </b>
                <Tag color={account.status ? "green" : "red"}>
                  {account.status ? "Valid" : "Banned"}
                </Tag>
              </Card>
            )}
            {account.role !== "ADMIN" &&
              (account.status ? (
                <Card>
                  <Button
                    type="primary"
                    danger
                    style={{ width: "100px" }}
                    onClick={() => setIsOpenModal(true)}
                  >
                    BAN
                  </Button>
                  <Modal
                    style={{ textAlign: "center" }}
                    title="Are you sure you want to BAN this account?"
                    open={isOpenModal}
                    onCancel={() => setIsOpenModal(false)}
                    footer={null}
                    closable={false}
                  >
                    <Button
                      type="primary"
                      onClick={() => {
                        api
                          .delete(`/admin/deleteAccount/${userId}`)
                          .then(() => {
                            fetchAccount();
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                        alert("Account banned! Please wait for a while!");
                        setTimeout(() => {
                          navigate(`/admin/userManage/details/${userId}`);
                        }, 5000);
                        setIsOpenModal(false);
                      }}
                      style={{
                        width: "100px",
                        marginTop: "10px",
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      type="primary"
                      danger
                      onClick={() => setIsOpenModal(false)}
                      style={{
                        width: "100px",
                        marginLeft: "50px",
                      }}
                    >
                      No
                    </Button>
                  </Modal>
                </Card>
              ) : (
                <Card>
                  <Button
                    type="primary"
                    style={{ width: "100px" }}
                    onClick={() => setIsOpenModal(true)}
                  >
                    RESTORE
                  </Button>
                  <Modal
                    style={{ textAlign: "center" }}
                    title="Are you sure you want to RESTORE this account?"
                    open={isOpenModal}
                    onCancel={() => setIsOpenModal(false)}
                    footer={null}
                    closable={false}
                  >
                    <Button
                      type="primary"
                      onClick={() => {
                        api
                          .put(`/admin/restoreAccount/${userId}`)
                          .then(() => {
                            fetchAccount();
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                        alert("Account restored! Please wait for a while!");
                        setTimeout(() => {
                          navigate(`/admin/userManage/details/${userId}`);
                        }, 5000);
                        setIsOpenModal(false);
                      }}
                      style={{
                        width: "100px",
                        marginTop: "10px",
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      type="primary"
                      danger
                      onClick={() => setIsOpenModal(false)}
                      style={{
                        width: "100px",
                        marginLeft: "50px",
                      }}
                    >
                      No
                    </Button>
                  </Modal>
                </Card>
              ))}
          </Card>
        )}
      </div>
    </>
  );
}

export default AccountDetails;
