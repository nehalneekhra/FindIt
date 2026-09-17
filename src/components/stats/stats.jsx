import "./stats.css";
import stats from "./statsdata";

// import CountUp from "react-countup";
import { motion } from "framer-motion";

export default function Stats(){
    return(

        <section className="stats">

            <div className="container">

                <motion.div

                    className="stats-header"

                    initial={{opacity:0,y:40}}

                    whileInView={{opacity:1,y:0}}

                    viewport={{once:true}}

                    transition={{duration:.7}}

                >

                    <span className="stats-tag">

                        Community Impact

                    </span>

                    <h2>

                        Every Number Tells A Story

                    </h2>

                    <p>

                        Thousands of students have already reunited
                        with their belongings through FindIt.

                    </p>

                </motion.div>

                <div className="stats-grid">

                    {

                        stats.map((item,index)=>{

                            const Icon=item.icon;

                            return(

                                <motion.div

                                    key={item.id}

                                    className={`stat-card ${item.color}`}

                                    initial={{opacity:0,y:60}}

                                    whileInView={{opacity:1,y:0}}

                                    viewport={{once:true}}

                                    transition={{

                                        delay:index*.15

                                    }}

                                    whileHover={{

                                        y:-10

                                    }}

                                >

                                    <div className="icon-circle">

                                        <Icon/>

                                    </div>

                                    <h3>
  {item.number}
  {item.suffix}
</h3>

                                    <p>

                                        {item.title}

                                    </p>

                                </motion.div>

                            )

                        })

                    }

                </div>

            </div>

        </section>

    )

}