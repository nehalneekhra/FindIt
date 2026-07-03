import {
  FaBoxOpen,
  FaHandshake,
  FaUsers,
  FaChartLine
} from "react-icons/fa";

const stats = [

  {
    id:1,
    icon:FaBoxOpen,
    number:1250,
    suffix:"+",
    title:"Lost Reports",
    color:"red"
  },

  {
    id:2,
    icon:FaHandshake,
    number:980,
    suffix:"+",
    title:"Successfully Returned",
    color:"green"
  },

  {
    id:3,
    icon:FaUsers,
    number:4300,
    suffix:"+",
    title:"Students Helped",
    color:"blue"
  },

  {
    id:4,
    icon:FaChartLine,
    number:78,
    suffix:"%",
    title:"Recovery Rate",
    color:"gold"
  }

];

export default stats;