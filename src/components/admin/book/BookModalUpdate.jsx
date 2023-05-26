import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Upload,
    message,
    notification,
} from "antd";
import React, { useEffect, useState } from "react";
import {
    callFetchCategory,
    callUpdateBook,
    callUploadBookImg,
} from "../../../services/api";
import { v4 as uuidv4 } from "uuid";

const BookModalUpdate = ({
    openModalUpdate,
    setOpenModalUpdate,
    dataBookUpdate,
    fetchBook,
}) => {
    const [form] = Form.useForm();

    const [isSubmit, setIsSubmit] = useState(false);
    const [dataSlider, setDataSlider] = useState([]);
    const [dataThumbnail, setDataThumbnail] = useState([]);
    const [listCategory, setListCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [initForm, setInitForm] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await callFetchCategory();
            if (res && res.data) {
                const d = res.data.map((item) => {
                    return { label: item, value: item };
                });
                setListCategory(d);
            }
        };
        fetchCategory();
    }, []);

    useEffect(() => {
        if (dataBookUpdate?._id) {
            const arrThumbnail = [
                {
                    uid: uuidv4(),
                    name: dataBookUpdate.thumbnail,
                    status: "done",
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
                        dataBookUpdate.thumbnail
                    }`,
                },
            ];

            const arrSlider = dataBookUpdate?.slider?.map((item) => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: "done",
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/images/book/${item}`,
                };
            });

            const init = {
                _id: dataBookUpdate._id,
                mainText: dataBookUpdate.mainText,
                author: dataBookUpdate.author,
                price: dataBookUpdate.price,
                category: dataBookUpdate.category,
                quantity: dataBookUpdate.quantity,
                sold: dataBookUpdate.sold,
                thumbnail: { fileList: arrThumbnail },
                slider: { fileList: arrSlider },
            };
            setInitForm(init);
            setDataThumbnail(arrThumbnail);
            setDataSlider(arrSlider);
            form.setFieldsValue(init);
        }
        return () => {
            form.resetFields();
        };
    }, [dataBookUpdate]);

    const onFinish = async (values) => {
        console.log(values);
        if (dataThumbnail.length === 0) {
            notification.error({
                message: "Lỗi validate",
                description: "Vui lòng upload ảnh thumbnail",
            });
            return;
        }

        if (dataSlider.length === 0) {
            notification.error({
                message: "Lỗi validate",
                description: "Vui lòng upload ảnh slider",
            });
            return;
        }

        const { mainText, author, price, sold, quantity, category } = values;
        const thumbnail = dataThumbnail[0].name;
        const slider = dataSlider.map((item) => item.name);

        setIsSubmit(true);
        const res = await callUpdateBook(
            mainText,
            author,
            price,
            sold,
            quantity,
            category,
            thumbnail,
            slider,
            dataBookUpdate._id
        );
        if (res && res.data) {
            message.success("Tạo mới book thành công");
            form.resetFields();
            setDataSlider([]);
            setDataThumbnail([]);
            setInitForm(null);
            setOpenModalUpdate(false);
            await fetchBook();
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message,
            });
        }
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info, type) => {
        if (info.file.status === "uploading") {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }
        if (info.file.status === "done") {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            setDataThumbnail([
                {
                    name: res.data.fileUpload,
                    uid: file.uid,
                },
            ]);
            onSuccess("ok");
        } else {
            onError("Đã có lỗi khi upload file");
        }
    };

    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            setDataSlider((dataSlider) => [
                ...dataSlider,
                {
                    name: res.data.fileUploaded,
                    uid: file.uid,
                },
            ]);
            onSuccess("ok");
        } else {
            onError("Đã có lỗi khi upload file");
        }
    };

    const handleRemoveFile = (file, type) => {
        if (type === "thumbnail") {
            setDataThumbnail([]);
        }
        if (type === "slide") {
            const newSlide = dataSlider.filter((x) => x.uid !== file.uid);
            setDataSlider(newSlide);
        }
    };

    return (
        <>
            <Modal
                title="Cập nhật book"
                open={openModalUpdate}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => {
                    form.resetFields();
                    setOpenModalUpdate(false);
                    setInitForm(null);
                }}
                okText={"Cập nhật"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
                width={"50vw"}
                maskClosable={false}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tên sách"
                                name="mainText"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên hiển thị!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tác giả"
                                name="author"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tác giả!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Giá tiền"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập giá tiền!",
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: "100%" }}
                                    formatter={(value) =>
                                        `${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )
                                    }
                                    addonAfter="VND"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Thể loại"
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn thể loại!",
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue={null}
                                    showSearch
                                    allowClear
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Số lượng"
                                name="quantity"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập số lượng!",
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Đã bán"
                                name="sold"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng nhập số lượng đã bán!",
                                    },
                                ]}
                                initialValue={0}
                            >
                                <InputNumber
                                    min={0}
                                    defaultValue={0}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Thumbnail"
                                name="thumbnail"
                            >
                                <Upload
                                    name="thumbnail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileThumbnail}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onRemove={(file) =>
                                        handleRemoveFile(file, "thumbnail")
                                    }
                                    defaultFileList={
                                        initForm?.thumbnail?.fileList ?? []
                                    }
                                >
                                    <div>
                                        {loading ? (
                                            <LoadingOutlined />
                                        ) : (
                                            <PlusOutlined />
                                        )}
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Slider"
                                name="slider"
                            >
                                <Upload
                                    multiple
                                    name="slider"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    customRequest={handleUploadFileSlider}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) =>
                                        handleChange(info, "slider")
                                    }
                                    onRemove={(file) =>
                                        handleRemoveFile(file, "slider")
                                    }
                                    defaultFileList={
                                        initForm?.slider?.fileList ?? []
                                    }
                                >
                                    <div>
                                        {loadingSlider ? (
                                            <LoadingOutlined />
                                        ) : (
                                            <PlusOutlined />
                                        )}
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default BookModalUpdate;
