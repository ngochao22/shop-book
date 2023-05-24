import {
    Button,
    Col,
    Popconfirm,
    Row,
    Table,
    message,
    notification,
} from "antd";
import React, { useEffect, useState } from "react";
import UserInput from "./UserInput";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { callDeleteUser, callGetListUser } from "../../../services/api";
import UserViewDetail from "./UserViewDetail";
import UserModalCreate from "./UserModalCreate";
import UserModalUpdate from "./UserModalUpdate";

const UserTable = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [total, setTotal] = useState(0);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState([]);

    const fetchUser = async (searchFilter) => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (searchFilter) {
            query += `${searchFilter}`;
        }
        const res = await callGetListUser(query);
        if (res && res.data) {
            setListUser(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, [current, pageSize]);

    const onConfirm = async (userId) => {
        const res = await callDeleteUser(userId);
        console.log(res);
        if (res.data) {
            message.success("xóa user thành công");
            fetchUser();
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message,
                duration: 5,
            });
        }
    };

    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
            render: (text, record, index) => {
                return (
                    <a
                        href="#"
                        onClick={() => {
                            console.log(record);
                            setDataViewDetail(record);
                            setOpenViewDetail(true);
                        }}
                    >
                        {record._id}
                    </a>
                );
            },
        },
        {
            title: "Tên hiển thị",
            dataIndex: "fullName",
            sorter: true,
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: true,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            sorter: true,
        },
        {
            title: "Action",
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            title="Xác nhận xóa user"
                            placement="leftTop"
                            description="Bạn có chắc chắn muốn xóa user này ?"
                            onConfirm={() => onConfirm(record._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <DeleteOutlined style={{ color: "red" }} />
                        </Popconfirm>
                        <EditOutlined
                            style={{ color: "orange", marginLeft: "25px" }}
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setDataUpdate(record);
                            }}
                        />
                    </>
                );
            },
        },
    ];

    const onChange = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };

    const handleSearch = (query) => {
        fetchUser(query);
    };

    const renderHeader = () => {
        return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Table List User</span>
                <span style={{ display: "flex", gap: 15 }}>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => setOpenModalCreate(true)}
                    >
                        Thêm mới
                    </Button>
                </span>
            </div>
        );
    };

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <UserInput handleSearch={handleSearch}></UserInput>
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        columns={columns}
                        loading={isLoading}
                        dataSource={listUser}
                        onChange={onChange}
                        rowKey={"_id"}
                        pagination={{
                            current: current,
                            pageSize: pageSize,
                            total: total,
                            showSizeChanger: true,
                        }}
                    />
                </Col>
            </Row>

            <UserViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
            ></UserViewDetail>

            <UserModalCreate
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchUser={fetchUser}
            ></UserModalCreate>

            <UserModalUpdate
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                dataUpdate={dataUpdate}
                fetchUser={fetchUser}
            ></UserModalUpdate>
        </>
    );
};

export default UserTable;
