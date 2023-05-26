import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
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
import { callDeleteBook, callGetListBook } from "../../../services/api";
import BookInput from "./BookInput";
import BookViewDetail from "./BookViewDetail";
import BookModalCreate from "./BookModalCreate";
import BookModalUpdate from "./BookModalUpdate";

const BookTable = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataBookViewDetail, setDataBookViewDetail] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataBookUpdate, setDataBookUpdate] = useState([]);
    const [pageSize, setPageSize] = useState(2);

    const onConfirm = async (id) => {
        const res = await callDeleteBook(id);
        if (res && res.data) {
            message.success("Xóa book thành công");
            fetchBook();
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message,
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
                            setOpenViewDetail(true);
                            setDataBookViewDetail(record);
                        }}
                    >
                        {record._id}
                    </a>
                );
            },
        },
        {
            title: "tên sách",
            dataIndex: "mainText",
            sorter: true,
        },
        {
            title: "Thể loại",
            dataIndex: "category",
            sorter: true,
        },
        {
            title: "Tác giả",
            dataIndex: "author",
            sorter: true,
        },
        {
            title: "Giá tiền",
            dataIndex: "price",
            sorter: true,
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "createdAt",
            sorter: true,
        },
        {
            title: "Action",
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            title="Xác nhận xóa book"
                            placement="leftTop"
                            description="Bạn có chắc chắn muốn xóa book này ?"
                            onConfirm={() => onConfirm(record._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <DeleteOutlined style={{ color: "red" }} />
                        </Popconfirm>
                        <EditOutlined
                            style={{ color: "orange", marginLeft: "10px" }}
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setDataBookUpdate(record);
                            }}
                        />
                    </>
                );
            },
        },
    ];

    const renderHeader = () => {
        return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Table List Book</span>
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

    useEffect(() => {
        fetchBook();
    }, [current, pageSize]);

    const fetchBook = async (searchQuery) => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (searchQuery) {
            query += `${searchQuery}`;
        }
        const res = await callGetListBook(query);
        setIsLoading(false);
        if (res.data) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total);
        }
    };

    const onChange = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };

    const handleSearch = (searchQuery) => {
        fetchBook(searchQuery);
    };
    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <BookInput handleSearch={handleSearch}></BookInput>
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        columns={columns}
                        loading={isLoading}
                        dataSource={listBook}
                        onChange={onChange}
                        rowKey={"_id"}
                        pagination={{
                            current: current,
                            pageSize: pageSize,
                            total: total,
                            showSizeChanger: true,
                        }}
                    ></Table>
                </Col>
            </Row>

            <BookViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataBookViewDetail={dataBookViewDetail}
            ></BookViewDetail>

            <BookModalCreate
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchBook={fetchBook}
            ></BookModalCreate>

            <BookModalUpdate
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                dataBookUpdate={dataBookUpdate}
                fetchBook={fetchBook}
            ></BookModalUpdate>
        </>
    );
};

export default BookTable;
