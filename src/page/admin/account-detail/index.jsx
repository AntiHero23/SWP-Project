import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { Button, Modal } from "antd";

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
        {!loading && (
          <div>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Username: </b>
            {account.username}
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Name: </b>
            {account.name || "-"}
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Phone: </b>
            {account.phone || "-"}
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Role: </b>
            {account.role}
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Email: </b>
            {account.email}
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            {account.role === "MEMBER" && (
              <>
                <b>Premium Status: </b>
                {account?.premiumStatus === 0
                  ? "Basic "
                  : account?.premiumStatus === 1
                  ? "Premium"
                  : "Unknown"}
                <p>
                  ______________________________________________________________________________________________________________________________________________________________________________________________________________________
                </p>
                <br />
              </>
            )}
            {account.role === "SHOP" && (
              <>
                <b>Number of Posts: </b>
                {account.numberOfPosts || "-"}
                <p>
                  ______________________________________________________________________________________________________________________________________________________________________________________________________________________
                </p>
                <br />
              </>
            )}
            {account.role !== "ADMIN" && (
              <>
                <b>Validation: </b>
                {account.status ? "Valid" : "Banned"}
                <p>
                  ______________________________________________________________________________________________________________________________________________________________________________________________________________________
                </p>
                <br />
              </>
            )}
            {account.role !== "ADMIN" &&
              (account.status ? (
                <>
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
                    onOk={() => {
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
                  />
                  <p>
                    ______________________________________________________________________________________________________________________________________________________________________________________________________________________
                  </p>
                  <br />
                </>
              ) : (
                <>
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
                    onOk={() => {
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
                  />
                  <p>
                    ______________________________________________________________________________________________________________________________________________________________________________________________________________________
                  </p>
                  <br />
                </>
              ))}
          </div>
        )}
      </div>
    </>
  );
}

export default AccountDetails;
