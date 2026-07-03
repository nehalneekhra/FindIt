import { useEffect, useState } from "react";
import "./progressbar.css";

export default function ProgressBar() {

    const [scroll,setScroll]=useState(0);

    useEffect(()=>{

        const handleScroll=()=>{

            const totalHeight=

            document.documentElement.scrollHeight-
            document.documentElement.clientHeight;

            const progress=

            (window.scrollY/totalHeight)*100;

            setScroll(progress);

        };

        window.addEventListener("scroll",handleScroll);

        return()=>window.removeEventListener("scroll",handleScroll);

    },[]);

    return(

        <div

            className="progress-bar"

            style={{

                width:`${scroll}%`

            }}

        />

    );

}