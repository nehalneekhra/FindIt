import "./howitworks.css";
import steps from "./stepsdata";

import { motion } from "framer-motion";

export default function HowItWorks(){

    return(

        <section className="how-it-works">

            <div className="container">

                <motion.div

                    className="how-header"

                    initial={{opacity:0,y:40}}
                    whileInView={{opacity:1,y:0}}
                    transition={{duration:.7}}
                    viewport={{once:true}}

                >

                    <span className="how-tag">

                        Simple Process

                    </span>

                    <h2>

                        How FindIt Works

                    </h2>

                    <p>

                        Reconnecting people with their belongings
                        is easier than ever.

                    </p>

                </motion.div>

                <div className="steps-grid">

                    {

                        steps.map((step,index)=>{

                            const Icon=step.icon;

                            return(

                                <motion.div

                                    key={step.id}

                                    className="step-card"

                                    initial={{opacity:0,y:60}}

                                    whileInView={{opacity:1,y:0}}

                                    transition={{
                                        delay:index*.15
                                    }}

                                    viewport={{once:true}}

                                    whileHover={{
                                        y:-12
                                    }}

                                >

                                    <div className="step-icon">

                                        <Icon/>

                                    </div>

                                    <h3>

                                        {step.title}

                                    </h3>

                                    <p>

                                        {step.description}

                                    </p>

                                </motion.div>

                            );

                        })

                    }

                </div>

            </div>

        </section>

    );

}