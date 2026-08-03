import { loginUser } from "../services/authService";
import "../components/login/login.css";

import Navbar from "../components/layout/navbar";
import Footer from "../components/footer/footer";

import { motion } from "framer-motion";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {

FaEnvelope,

FaLock,

FaEye,

FaEyeSlash,

FaGoogle

} from "react-icons/fa";

export default function Login(){
    const navigate = useNavigate();

const[showPassword,setShowPassword]=useState(false);

const[remember,setRemember]=useState(false);

const[formData,setFormData]=useState({

email:"",

password:""

});

const handleChange=(e)=>{

setFormData({

...formData,

[e.target.name]:e.target.value

});

};

const handleSubmit = async (e) => {

    e.preventDefault();

    const response = await loginUser({
        email: formData.email,
        password: formData.password,
    });

    if (response.success) {

        localStorage.setItem("token", response.token);

        localStorage.setItem(
            "user",
            JSON.stringify(response.user)
        );

        alert("Login Successful!");

        navigate("/");

    } else {

        alert(response.message);

    }

};

return(

<>

<Navbar/>

<section className="login-page">

<div className="container">

<motion.div

className="login-wrapper"

initial={{opacity:0,y:40}}

animate={{opacity:1,y:0}}

transition={{duration:.6}}

>

<div className="login-left">

<span className="login-tag">

Welcome Back 👋

</span>

<h1>

FindIt

</h1>

<p>

Helping students reconnect with their lost belongings.

Sign in to manage your reports, browse found items,

and stay updated with claims.

</p>

<div className="login-features">

<div>

✓ Report Lost Items

</div>

<div>

✓ Report Found Items

</div>

<div>

✓ Track Your Claims

</div>

<div>

✓ Secure Dashboard

</div>

</div>

</div>

<div className="login-right">

<h2>

Sign In

</h2>

<p>

Continue your journey with FindIt.

</p>

<form

onSubmit={handleSubmit}

>

<div className="input-group">

<label>

<FaEnvelope/>

Email Address

</label>

<input

type="email"

name="email"

placeholder="Enter your email"

value={formData.email}

onChange={handleChange}

required

/>

</div>

<div className="input-group">

<label>

<FaLock/>

Password

</label>

<div className="password-box">

<input

type={

showPassword

?

"text"

:

"password"

}

name="password"

placeholder="Enter your password"

value={formData.password}

onChange={handleChange}

required

/>

<button

type="button"

className="eye-btn"

onClick={()=>setShowPassword(!showPassword)}

>

{

showPassword

?

<FaEyeSlash/>

:

<FaEye/>

}

</button>

</div>

</div>
                <div className="login-options">

                    <label className="remember-me">

                        <input

                            type="checkbox"

                            checked={remember}

                            onChange={()=>

                                setRemember(!remember)

                            }

                        />

                        Remember Me

                    </label>

                    <a

                        href="#"

                        className="forgot-password"

                    >

                        Forgot Password?

                    </a>

                </div>

                <button

                    type="submit"

                    className="login-btn"

                >

                    Sign In

                </button>

                <div className="divider">

                    <span>

                        OR

                    </span>

                </div>

                <button

                    type="button"

                    className="google-btn"

                >

                    <FaGoogle/>

                    Continue with Google

                </button>

                <div className="signup-link">

                    Don't have an account?

                    <a href="/signup">

                        Create Account

                    </a>

                </div>

            </form>

        </div>

    </motion.div>

</div>

</section>

<Footer/>

</>

);

}