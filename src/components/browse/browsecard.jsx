import "./browsecard.css";

import { useState } from "react";

import { motion } from "framer-motion";

import ItemModal from "../modal/itemmodal";

import {

FaHeart,

FaRegHeart,

FaMapMarkerAlt,

FaClock,

FaUser,

FaArrowRight

} from "react-icons/fa";

export default function BrowseCard({ item, type }) {

const [favorite,setFavorite]=useState(false);

const [open,setOpen]=useState(false);

return(

<>

<motion.div

className="browse-card"

whileHover={{

y:-10,

scale:1.02

}}

transition={{

duration:.25

}}

>

<div

className="browse-image"

onClick={()=>setOpen(true)}

>

<img

src={item.image}

alt={item.title}

/>

<button

className={`browse-favorite ${type}`}

onClick={(e)=>{

e.stopPropagation();

setFavorite(!favorite);

}}

>

{

favorite

?

<FaHeart/>

:

<FaRegHeart/>

}

</button>

<span

className={`browse-status ${type}`}

>

{

type==="lost"

?

"LOST"

:

"FOUND"

}

</span>

</div>

<div className="browse-content">

<h3>

{item.title}

</h3>

<div className="browse-info">

<span>

<FaMapMarkerAlt/>

{item.location}

</span>

{

type==="lost"

?

(

<span>

<FaClock/>

{item.time}

</span>

)

:

(

<span>

<FaUser/>

{item.finder}

</span>

)

}

</div>

<div className="browse-category">

{item.category}

</div>

<button

className="browse-btn"

onClick={()=>setOpen(true)}

>

View Details

<FaArrowRight/>

</button>

</div>

</motion.div>

<ItemModal

item={

open

?

item

:

null

}

onClose={()=>setOpen(false)}

/>

</>

)

}