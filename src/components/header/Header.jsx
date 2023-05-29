import { DownOutlined } from "@ant-design/icons";
import {
    Badge,
    Divider,
    Drawer,
    Dropdown,
    Popover,
    Space,
    message,
} from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { callLogout } from "../../services/api";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import "./Header.scss";

const Header = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const isAuthenticated = useSelector(
        (state) => state.account.isAuthenticated
    );
    const user = useSelector((state) => state.account.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const carts = useSelector((state) => state.order.carts);

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(doLogoutAction());
            message.success("Đăng xuất thành công");
            navigate("/");
        }
    };

    let items = [
        {
            label: (
                <label
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/admin")}
                >
                    Trang quản trị
                </label>
            ),
        },
        {
            label: (
                <label style={{ cursor: "pointer" }}>Quản lý tài khoản</label>
            ),
            key: "account",
        },
        {
            label: (
                <label
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        navigate("/history");
                    }}
                >
                    Lịch sử mua hàng
                </label>
            ),
        },
        {
            label: (
                <label
                    style={{ cursor: "pointer" }}
                    onClick={() => handleLogout()}
                >
                    Đăng xuất
                </label>
            ),
            key: "logout",
        },
    ];

    const content = () => {
        return (
            <>
                {carts.length > 0 &&
                    carts.map((item) => (
                        <div className="view-container" key={item._id}>
                            <div className="wrapper">
                                <img
                                    src={`${
                                        import.meta.env.VITE_BACKEND_URL
                                    }/images/book/${item.detail.thumbnail}`}
                                    alt=""
                                    className="image"
                                />
                                <div className="content">
                                    <span className="title">
                                        {item.detail.mainText}
                                    </span>
                                    <span className="price">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(item.detail.price)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                <div className="btn-container">
                    <button
                        className="button"
                        onClick={() => navigate("/order")}
                    >
                        Đến giỏ hàng
                    </button>
                </div>
            </>
        );
    };

    return (
        <>
            <div className="header-container">
                <header className="page-header">
                    <div className="page-header__top">
                        <div
                            className="page-header__toggle"
                            onClick={() => {
                                setOpenDrawer(true);
                            }}
                        >
                            ☰
                        </div>
                        <div
                            className="page-header__logo"
                            onClick={() => {
                                navigate("/");
                            }}
                        >
                            <span className="logo">
                                <FaReact className="rotate icon-react" />
                                Shop Book
                                <VscSearchFuzzy className="icon-search" />
                            </span>
                            <input
                                className="input-search"
                                type={"text"}
                                placeholder="Bạn tìm gì hôm nay"
                            />
                        </div>
                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                {isAuthenticated && carts.length > 0 ? (
                                    <Popover
                                        title="Sản phẩm mới thêm"
                                        content={content}
                                    >
                                        <Badge
                                            count={carts.length}
                                            size={"small"}
                                            showZero
                                        >
                                            <FiShoppingCart className="icon-cart" />
                                        </Badge>
                                    </Popover>
                                ) : (
                                    <Badge
                                        count={carts.length}
                                        size={"small"}
                                        showZero
                                    >
                                        <FiShoppingCart className="icon-cart" />
                                    </Badge>
                                )}
                            </li>
                            <li className="navigation__item mobile">
                                <Divider type="vertical" />
                            </li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ? (
                                    <span onClick={() => navigate("/login")}>
                                        {" "}
                                        Tài Khoản
                                    </span>
                                ) : (
                                    <Dropdown
                                        menu={{ items }}
                                        trigger={["click"]}
                                    >
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                Welcome {user?.fullName}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                )}
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer
                title="Menu chức năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Quản lý tài khoản</p>
                <Divider />

                <p>Đăng xuất</p>
                <Divider />
            </Drawer>
        </>
    );
};

export default Header;
