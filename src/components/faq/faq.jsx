import "./faq.css";
import faq from "./faqdata";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FaChevronDown } from "react-icons/fa";

export default function Faq(){

    const [open,setOpen]=useState(null);

    return(

        <section className="faq">

            <div className="container">

                <div className="faq-header">

                    <span className="faq-tag">

                        Frequently Asked Questions

                    </span>

                    <h2>

                        Have Questions?

                    </h2>

                    <p>

                        Everything you need to know before
                        using FindIt.

                    </p>

                </div>

                <div className="faq-list">

                    {

                        faq.map((item,index)=>(

                            <motion.div

                                key={item.id}

                                className="faq-item"

                                initial={{opacity:0,y:40}}

                                whileInView={{opacity:1,y:0}}

                                transition={{delay:index*.08}}

                                viewport={{once:true}}

                            >

                                <button

                                    className="faq-question"

                                    onClick={()=>{

                                        setOpen(

                                            open===item.id
                                            ?
                                            null
                                            :
                                            item.id

                                        )

                                    }}

                                >

                                    <span>

                                        {item.question}

                                    </span>

                                    <FaChevronDown

                                        className={
                                            open===item.id
                                            ?
                                            "rotate"
                                            :
                                            ""
                                        }

                                    />

                                </button>

                                <AnimatePresence>

                                    {

                                        open===item.id && (

                                            <motion.div

                                                className="faq-answer"

                                                initial={{height:0,opacity:0}}

                                                animate={{
                                                    height:"auto",
                                                    opacity:1
                                                }}

                                                exit={{
                                                    height:0,
                                                    opacity:0
                                                }}

                                            >

                                                <p>

                                                    {item.answer}

                                                </p>

                                            </motion.div>

                                        )

                                    }

                                </AnimatePresence>

                            </motion.div>

                        ))

                    }

                </div>

            </div>

        </section>

    );

}