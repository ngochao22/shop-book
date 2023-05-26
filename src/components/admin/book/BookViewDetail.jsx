import { Badge, Descriptions, Divider, Drawer, Modal, Upload } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const BookViewDetail = ({
    openViewDetail,
    setOpenViewDetail,
    dataBookViewDetail,
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [fileList, setFileList] = useState([]);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        setPreviewImage(file.url);
        setPreviewOpen(true);
        setPreviewTitle(
            file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
        );
    };

    useEffect(() => {
        if (dataBookViewDetail) {
            let imgThumbnail = {},
                imgSlider = [];
            if (dataBookViewDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataBookViewDetail.thumbnail,
                    status: "done",
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
                        dataBookViewDetail.thumbnail
                    }`,
                };
            }

            if (
                dataBookViewDetail.slider &&
                dataBookViewDetail.slider.length > 0
            ) {
                dataBookViewDetail.slider.map((item) => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: "done",
                        url: `${
                            import.meta.env.VITE_BACKEND_URL
                        }/images/book/${item}`,
                    });
                });
            }

            setFileList([imgThumbnail, ...imgSlider]);
        }
    }, [dataBookViewDetail]);

    const handleChange = ({ fileList: newFileList }) =>
        setFileList(newFileList);
    return (
        <>
            <Drawer
                title="Chức năng xem chi tiết"
                width={"50vw"}
                open={openViewDetail}
                onClose={() => setOpenViewDetail(false)}
            >
                <Descriptions title="Thông tin user" bordered column={2}>
                    <Descriptions.Item label="Id">
                        {dataBookViewDetail._id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên sách">
                        {dataBookViewDetail.mainText}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tác gỉa">
                        {dataBookViewDetail.author}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giá tiền">
                        {dataBookViewDetail.price}
                    </Descriptions.Item>

                    <Descriptions.Item label="Category" span={2}>
                        <Badge
                            status="processing"
                            text={dataBookViewDetail?.category}
                        ></Badge>
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At">
                        {moment(dataBookViewDetail.createdAt).format(
                            "DD-MM-YYYY HH:mm:ss"
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(dataBookViewDetail.updatedAt).format(
                            "DD-MM-YYYY HH:mm:ss"
                        )}
                    </Descriptions.Item>
                </Descriptions>

                <Divider orientation="left">Ảnh Book</Divider>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={{ showRemoveIcon: false }}
                ></Upload>
                <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                >
                    <img
                        alt="example"
                        style={{ width: "100%" }}
                        src={previewImage}
                    />
                </Modal>
            </Drawer>
        </>
    );
};

export default BookViewDetail;
