import { Row, Col, Rate, Divider, Button, message } from "antd";
import "./Book.scss";
import ImageGallery from "react-image-gallery";
import { useRef, useState } from "react";
import ModalGallery from "./ModalGallery";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
import BookLoader from "./BookLoader";
import { useDispatch, useSelector } from "react-redux";
import { doAddBookAction } from "../../redux/orders/orderSlice";
import { useNavigate } from "react-router-dom";

const ViewDetail = ({ dataBook }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentQuantity, setCurrentQuantity] = useState(1);
    const isAuthenticated = useSelector(
        (state) => state.account.isAuthenticated
    );

    const refGallery = useRef(null);

    const images = dataBook?.items ?? [];

    const handleOnClickImage = () => {
        //get current index onClick
        // alert(refGallery?.current?.getCurrentIndex());
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
        // refGallery?.current?.fullScreen()
    };

    const handleChangeButton = (type) => {
        if (type === "MINUS") {
            if (currentQuantity - 1 <= 0) return;
            setCurrentQuantity(currentQuantity - 1);
        }

        if (type === "PLUS") {
            if (currentQuantity === +dataBook.quantity) return;
            setCurrentQuantity(currentQuantity + 1);
        }
    };

    const handleChangeInput = (value) => {
        if (!isNaN(value)) {
            if (+value > 0 && +value < +dataBook.quantity) {
                setCurrentQuantity(+value);
            }
        }
    };

    const handleAddToCart = (quantity, book) => {
        if (isAuthenticated) {
            dispatch(
                doAddBookAction({ quantity, _id: book._id, detail: book })
            );

            message.success("Thêm vào giỏ hàng thành công");
        } else {
            message.error("Vui lòng đăng nhập để sử dụng tính năng");
        }
    };

    const onChange = (value) => {
        console.log("changed", value);
    };

    return (
        <div style={{ background: "#efefef", padding: "20px 0" }}>
            <div
                className="view-detail-book"
                style={{
                    maxWidth: 1440,
                    margin: "0 auto",
                    minHeight: "calc(100vh - 150px)",
                }}
            >
                <div
                    style={{
                        padding: "20px",
                        background: "#fff",
                        borderRadius: 5,
                    }}
                >
                    {dataBook && dataBook._id ? (
                        <Row gutter={[20, 20]}>
                            <Col md={10} sm={0} xs={0}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={images}
                                    showPlayButton={false} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>} //right arrow === <> </>
                                    slideOnThumbnailOver={true} //onHover => auto scroll images
                                    onClick={() => handleOnClickImage()}
                                />
                            </Col>
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={images}
                                        showPlayButton={false} //hide play button
                                        showFullscreenButton={false} //hide fullscreen button
                                        renderLeftNav={() => <></>} //left arrow === <> </>
                                        renderRightNav={() => <></>} //right arrow === <> </>
                                        showThumbnails={false}
                                    />
                                </Col>
                                <Col span={24}>
                                    <div className="author">
                                        Tác giả:{" "}
                                        <a href="#">{dataBook.author}</a>{" "}
                                    </div>
                                    <div className="title">
                                        {dataBook.mainText}
                                    </div>
                                    <div className="rating">
                                        <Rate
                                            value={5}
                                            disabled
                                            style={{
                                                color: "#ffce3d",
                                                fontSize: 12,
                                            }}
                                        />
                                        <span className="sold">
                                            <Divider type="vertical" />
                                            Đã bán {dataBook.sold}
                                        </span>
                                    </div>
                                    <div className="price">
                                        <span className="currency">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(dataBook.price)}
                                        </span>
                                    </div>
                                    <div className="delivery">
                                        <div>
                                            <span className="left">
                                                Vận chuyển
                                            </span>
                                            <span className="right">
                                                Miễn phí vận chuyển
                                            </span>
                                        </div>
                                    </div>
                                    <div className="quantity">
                                        <span className="left">Số lượng</span>
                                        <span className="right">
                                            <button>
                                                <MinusOutlined
                                                    onClick={() =>
                                                        handleChangeButton(
                                                            "MINUS"
                                                        )
                                                    }
                                                />
                                            </button>
                                            <input
                                                defaultValue={1}
                                                onChange={(e) =>
                                                    handleChangeInput(
                                                        e.target.value
                                                    )
                                                }
                                                value={currentQuantity}
                                            />
                                            <button
                                                onClick={() =>
                                                    handleChangeButton("PLUS")
                                                }
                                            >
                                                <PlusOutlined />
                                            </button>
                                        </span>
                                    </div>
                                    <div className="buy">
                                        <button
                                            className="cart"
                                            onClick={() =>
                                                handleAddToCart(
                                                    currentQuantity,
                                                    dataBook
                                                )
                                            }
                                        >
                                            <BsCartPlus className="icon-cart" />
                                            <span>Thêm vào giỏ hàng</span>
                                        </button>
                                        <button
                                            className="now"
                                            onClick={() => {
                                                handleAddToCart(
                                                    currentQuantity,
                                                    dataBook
                                                );
                                                navigate("/order");
                                            }}
                                        >
                                            Mua ngay
                                        </button>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    ) : (
                        <BookLoader></BookLoader>
                    )}
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={images}
                title={"hardcode"}
            />
        </div>
    );
};

export default ViewDetail;
