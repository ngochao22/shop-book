import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ViewDetail from "./ViewDetail";
import { callGetBookDetail } from "../../services/api";

const BookPage = () => {
    let location = useLocation();
    const [dataBook, setDataBook] = useState([]);

    let params = new URLSearchParams(location.search);
    const id = params?.get("id");

    console.log(">>> check book id: ", id);

    useEffect(() => {
        fetchBook(id);
    }, [id]);

    const fetchBook = async (id) => {
        const res = await callGetBookDetail(id);
        if (res && res.data) {
            let raw = res.data;
            raw.items = getImages(raw);

            setTimeout(() => {
                setDataBook(raw);
            }, 200);
        }
    };

    const getImages = (raw) => {
        const images = [];
        if (raw.thumbnail) {
            images.push({
                original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
                    raw.thumbnail
                }`,
                thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
                    raw.thumbnail
                }`,
                originalClass: "original-image",
                thumbnailClass: "thumbnail-image",
            });
        }
        if (raw.slider) {
            raw.slider?.map((item) => {
                images.push({
                    original: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/images/book/${item}`,
                    thumbnail: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/images/book/${item}`,
                    originalClass: "original-image",
                    thumbnailClass: "thumbnail-image",
                });
            });
        }
        return images;
    };
    return (
        <>
            <ViewDetail dataBook={dataBook}></ViewDetail>
        </>
    );
};

export default BookPage;
