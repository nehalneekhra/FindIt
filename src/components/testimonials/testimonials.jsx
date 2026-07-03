import "./testimonials.css";
import testimonials from "./testimonialdata";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FaStar } from "react-icons/fa";

export default function Testimonials() {

    const [current,setCurrent]=useState(0);

    useEffect(()=>{

        const interval=setInterval(()=>{

            setCurrent((prev)=>

                prev===testimonials.length-1 ? 0 : prev+1

            );

        },5000);

        return ()=>clearInterval(interval);

    },[]);

    const item=testimonials[current];

    return(

        <section className="testimonials">

            <div className="container">

                <div className="testimonial-header">

                    <span className="testimonial-tag">

                        Trusted by Our Community

                    </span>

                    <h2>

                        Every Reunion Has A Story

                    </h2>

                    <p>

                        Every successful reunion starts with
                        someone willing to help.

                    </p>

                </div>

                <AnimatePresence mode="wait">

                    <motion.div

                        key={item.id}

                        className="testimonial-card"

                        initial={{opacity:0,y:40}}

                        animate={{opacity:1,y:0}}

                        exit={{opacity:0,y:-40}}

                        transition={{duration:.55}}

                    >

                        <div className="quote">

                            ❝

                        </div>

                        <div className="stars">

                            {

                                [...Array(item.rating)].map((_,index)=>(

                                    <FaStar key={index}/>

                                ))

                            }

                        </div>

                        <p className="review">

                            {item.review}

                        </p>

                        <h4>

                            {item.name}

                        </h4>

                        <span>

                            {item.course}

                        </span>

                    </motion.div>

                </AnimatePresence>

                <div className="dots">

                    {

                        testimonials.map((_,index)=>(

                            <button

                                key={index}

                                className={
                                    current===index
                                    ?
                                    "dot dot-active"
                                    :
                                    "dot"
                                }

                                onClick={()=>setCurrent(index)}

                            />

                        ))

                    }

                </div>

            </div>

        </section>

    );

}