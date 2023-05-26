import React, { useEffect, useState } from "react";
import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import {
    Row,
    Col,
    Form,
    Checkbox,
    Divider,
    InputNumber,
    Button,
    Rate,
    Tabs,
    Pagination,
    Spin,
} from "antd";
import "./Home.scss";
import { callFetchCategory, callGetListBook } from "../../services/api";
const Home = () => {
    const [form] = Form.useForm();
    const [listCategory, setListCategory] = useState([]);
    const [listBook, setListBook] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [sortQuery, setSortQuery] = useState("sort=-sold");
    const [filter, setFilter] = useState("");

    const fetchBook = async () => {
        setIsLoading(true);
        let query = `&current=${current}&pageSize=${pageSize}`;

        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        if (filter) {
            query += `&${filter}`;
        }

        const res = await callGetListBook(query);
        if (res && res.data) {
            setIsLoading(false);
            setListBook(res.data.result);
            setTotal(res.data.meta.total);
        }
    };

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, sortQuery, filter]);

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await callFetchCategory();
            if (res && res.data) {
                setListCategory(res.data);
            }
        };
        fetchCategory();
    }, []);

    const handleChangeFilter = (changedValues, values) => {
        if (changedValues.category) {
            const cate = values.category;
            if (cate && cate.length > 0) {
                const newCate = cate.join(",");
                setFilter(`category=${newCate}`);
            } else {
                setFilter("");
            }
        }
    };

    const onFinish = (values) => {
        console.log("<<< Check values ", values);

        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
            if (values?.category) {
                const cate = values?.category.join(",");
                f += `&category=${cate}`;
            }
            setFilter(f);
        }
    };

    const onChange = (key) => {
        console.log(key);
    };

    const handleOnChangePage = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };

    const items = [
        {
            key: "sort=-sold",
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: "sort=-updatedAt",
            label: `Hàng Mới`,
            children: <></>,
        },
        {
            key: "sort=price",
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: "sort=-price",
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ];
    return (
        <div style={{ background: "#efefef", padding: "20px 0" }}>
            <div
                className="homepage-container"
                style={{ maxWidth: 1440, margin: "0 auto" }}
            >
                <Row gutter={[20, 20]}>
                    <Col md={4} sm={0} xs={0} style={{ background: "#fff" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "20px",
                            }}
                        >
                            <span>
                                {" "}
                                <FilterTwoTone /> Bộ lọc tìm kiếm
                            </span>
                            <ReloadOutlined
                                title="Reset"
                                onClick={() => {
                                    form.resetFields();
                                    setFilter("");
                                }}
                            />
                        </div>
                        <Form
                            onFinish={onFinish}
                            form={form}
                            onValuesChange={(changedValues, values) =>
                                handleChangeFilter(changedValues, values)
                            }
                            style={{ padding: "0 20px" }}
                        >
                            <Form.Item
                                name="category"
                                label="Danh mục sản phẩm"
                                labelCol={{ span: 24 }}
                            >
                                <Checkbox.Group>
                                    <Row>
                                        {listCategory.length > 0 &&
                                            listCategory.map((item, index) => {
                                                return (
                                                    <Col
                                                        span={24}
                                                        key={index}
                                                        style={{
                                                            paddingBottom:
                                                                "4px",
                                                        }}
                                                    >
                                                        <Checkbox value={item}>
                                                            {item}
                                                        </Checkbox>
                                                    </Col>
                                                );
                                            })}
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                            <Divider />
                            <Form.Item
                                label="Khoảng giá"
                                labelCol={{ span: 24 }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: 20,
                                    }}
                                >
                                    <Form.Item name={["range", "from"]}>
                                        <InputNumber
                                            name="from"
                                            min={0}
                                            placeholder="đ TỪ"
                                            formatter={(value) =>
                                                `${value}`.replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                )
                                            }
                                        />
                                    </Form.Item>
                                    <span>-</span>
                                    <Form.Item name={["range", "to"]}>
                                        <InputNumber
                                            name="to"
                                            min={0}
                                            placeholder="đ ĐẾN"
                                            formatter={(value) =>
                                                `${value}`.replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                )
                                            }
                                        />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Button
                                        onClick={() => form.submit()}
                                        style={{ width: "100%" }}
                                        type="primary"
                                    >
                                        Áp dụng
                                    </Button>
                                </div>
                            </Form.Item>
                            <Divider />
                            <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                                <div>
                                    <Rate
                                        value={5}
                                        disabled
                                        style={{
                                            color: "#ffce3d",
                                            fontSize: 15,
                                        }}
                                    />
                                    <span className="ant-rate-text"></span>
                                </div>
                                <div>
                                    <Rate
                                        value={4}
                                        disabled
                                        style={{
                                            color: "#ffce3d",
                                            fontSize: 15,
                                        }}
                                    />
                                    <span className="ant-rate-text">
                                        trở lên
                                    </span>
                                </div>
                                <div>
                                    <Rate
                                        value={3}
                                        disabled
                                        style={{
                                            color: "#ffce3d",
                                            fontSize: 15,
                                        }}
                                    />
                                    <span className="ant-rate-text">
                                        trở lên
                                    </span>
                                </div>
                                <div>
                                    <Rate
                                        value={2}
                                        disabled
                                        style={{
                                            color: "#ffce3d",
                                            fontSize: 15,
                                        }}
                                    />
                                    <span className="ant-rate-text">
                                        trở lên
                                    </span>
                                </div>
                                <div>
                                    <Rate
                                        value={1}
                                        disabled
                                        style={{
                                            color: "#ffce3d",
                                            fontSize: 15,
                                        }}
                                    />
                                    <span className="ant-rate-text">
                                        trở lên
                                    </span>
                                </div>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col
                        md={20}
                        xs={24}
                        style={{
                            background: "#fff",
                            borderLeft: "1px solid #ccc",
                        }}
                    >
                        <Spin spinning={isLoading} tip="Loading... ">
                            <Row>
                                <Tabs
                                    defaultActiveKey="1"
                                    items={items}
                                    onChange={(value) => setSortQuery(value)}
                                />
                            </Row>
                            <Row className="customize-row">
                                {listBook.length > 0 &&
                                    listBook.map((item) => {
                                        return (
                                            <div
                                                className="column"
                                                key={item._id}
                                            >
                                                <div className="wrapper">
                                                    <div className="thumbnail">
                                                        <img
                                                            src={`http://localhost:8080/images/book/${item.thumbnail}`}
                                                            alt="thumbnail book"
                                                        />
                                                    </div>
                                                    <div className="text">
                                                        {item.mainText}
                                                    </div>
                                                    <div className="price">
                                                        {new Intl.NumberFormat(
                                                            "vi-VN",
                                                            {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }
                                                        ).format(item.price)}
                                                    </div>
                                                    <div className="rating">
                                                        <Rate
                                                            value={5}
                                                            disabled
                                                            style={{
                                                                color: "#ffce3d",
                                                                fontSize: 10,
                                                            }}
                                                        />
                                                        <span>{item.sold}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </Row>
                            <Divider />
                            <Row
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Pagination
                                    // defaultCurrent={6}
                                    current={current}
                                    total={total}
                                    pageSize={pageSize}
                                    responsive
                                    onChange={(p, s) =>
                                        handleOnChangePage({
                                            current: p,
                                            pageSize: s,
                                        })
                                    }
                                />
                            </Row>
                        </Spin>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Home;
