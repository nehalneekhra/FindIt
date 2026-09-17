import "./hero.css";

import { FaArrowRight } from "react-icons/fa";

import {
    FaLaptop,
    FaWallet,
    FaBook,
    FaKey,
    FaMobileAlt,
} from "react-icons/fa";

import { Link } from "react-router-dom";


const categories = [
    {
        icon: <FaLaptop />,
        title: "Electronics"
    },
    {
        icon: <FaWallet />,
        title: "Wallets"
    },
    {
        icon: <FaBook />,
        title: "Books"
    },
    {
        icon: <FaKey />,
        title: "Keys"
    },
    {
        icon: <FaMobileAlt />,
        title: "Mobiles"
    }
];


export default function CategorySection() {

    return (

        <section className="categories">

            <h2>
                Popular Categories
            </h2>


            <div className="category-grid">

                {categories.map((item, index) => (

                    <Link
                        to={`/browse?category=${encodeURIComponent(item.title)}`}
                        className="category-card"
                        key={index}
                    >

                        <div className="category-icon">
                            {item.icon}
                        </div>


                        <h4>
                            {item.title}
                        </h4>


                        <div className="category-arrow">
                            <FaArrowRight />
                        </div>

                    </Link>

                ))}

            </div>

        </section>

    );

}