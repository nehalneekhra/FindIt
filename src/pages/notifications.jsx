import "../components/notifications/notifications.css";

import Navbar from "../components/layout/navbar";
import Footer from "../components/footer/footer";

import { motion } from "framer-motion";

import {
  FaBell,
  FaCheckCircle,
  FaBoxOpen,
  FaUserCheck,
  FaTrash,
} from "react-icons/fa";

export default function Notifications() {

  const notifications = [

    {
      id:1,
      title:"Possible Match Found",
      message:"Someone found a black wallet matching your report.",
      time:"2 mins ago",
      unread:true,
      icon:<FaCheckCircle/>
    },

    {
      id:2,
      title:"Item Claimed",
      message:"A student has requested ownership of your found ID Card.",
      time:"15 mins ago",
      unread:true,
      icon:<FaUserCheck/>
    },

    {
      id:3,
      title:"Report Approved",
      message:"Your lost AirPods report is now visible to everyone.",
      time:"Yesterday",
      unread:false,
      icon:<FaBoxOpen/>
    },

    {
      id:4,
      title:"Welcome to FindIt",
      message:"Thanks for joining the FindIt community.",
      time:"2 Days Ago",
      unread:false,
      icon:<FaBell/>
    }

  ];

  return(

    <>

      <Navbar/>

      <section className="notification-page">

        <div className="container">

          <motion.div
            className="notification-header"
            initial={{opacity:0,y:30}}
            animate={{opacity:1,y:0}}
          >

            <div>

              <h1>Notifications</h1>

              <p>
                Stay updated with everything happening on your account.
              </p>

            </div>

            <div className="notification-actions">

              <button>

                Mark All Read

              </button>

              <button className="delete-btn">

                <FaTrash/>

                Clear

              </button>

            </div>

          </motion.div>

          <div className="notification-list">

            {notifications.map((item,index)=>(

              <motion.div

                key={item.id}

                className={`notification-card ${item.unread?"unread":""}`}

                initial={{opacity:0,x:-40}}

                animate={{opacity:1,x:0}}

                transition={{delay:index*.12}}

              >

                <div className="notification-icon">

                  {item.icon}

                </div>

                <div className="notification-content">

                  <div className="notification-top">

                    <h3>{item.title}</h3>

                    <span>{item.time}</span>

                  </div>

                  <p>{item.message}</p>

                </div>

                {item.unread &&

                  <div className="notification-dot"></div>

                }

              </motion.div>

            ))}

          </div>

        </div>

      </section>

      <Footer/>

    </>

  );

}