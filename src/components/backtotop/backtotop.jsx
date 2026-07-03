import "./backtotop.css";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function BackToTop() {

    const [showButton, setShowButton] = useState(false);

    useEffect(() => {

        const handleScroll = () => {

            if (window.scrollY > 450) {

                setShowButton(true);

            } else {

                setShowButton(false);

            }

        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);

    }, []);

    const scrollToTop = () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };

    return (

        <button

            className={`back-to-top ${showButton ? "show" : ""}`}

            onClick={scrollToTop}

        >

            <FaArrowUp />

        </button>

    );

}