import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setToken, setUser } from '../redux/authSlice'
import { useNavigate } from 'react-router-dom'
import { Images } from '../assets/Images/Appassets'
import Swal from 'sweetalert2'
import Loader from "react-js-loader";

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [refreshed, setRefreshed] = useState(false);
    const [isloading, setIsLoading] = useState(false)
    const token = useSelector(state => state.user.token)

    useEffect(() => {
        // console.log('toksssen', token);


        if (token) {
            navigate('/home');
        }
    }, [token]);

    const login = () => {
        setIsLoading(true);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "email": email,
            "password": password
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        if (!email || !password) {
            Swal.fire("Plz Fill Out The Required Fields");

        } else {
            fetch("https://appsdemo.pro/AceTech/user/login", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setIsLoading(false);
                    if (result.success == 'false') {
                        setIsLoading(false)

                        Swal.fire(result.message);

                    } else {
                        dispatch(setToken(result.token));
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Login Successful",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        // console.log('reduxtoken', result.token);
                        setTimeout(() => {
                            // window.location.reload()

                            navigate('/home');

                            setIsLoading(false)
                        }, 1000)
                        // console.log('response', result);
                    }

                })
                .catch((error) => {
                    setIsLoading(false);
                    console.error(error)
                });
        }

    }

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            <div style={{ backgroundColor: '#EEF0FF', display: 'flex', borderRadius: 5, boxShadow: '1px 0px 30px rgba(0,0,0,0.4)', flexDirection: 'column', alignItems: 'center', height: 550, padding: "30px 40px 10px 40px" }}>
                {isloading && (
                    <div className='item' style={{ position: 'absolute', zIndex: 45, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <Loader type="spinner-default" bgColor={'gray'} color={"gray"} size={60} />
                    </div>
                )}
                <img src={Images.logo} alt="Logo" />
                <div style={{ height: '100%', marginTop: 10 }}>
                    <text style={{ alignSelf: 'flex-start', fontSize: 18, fontWeight: 'bold' }}>Sign In with email <br /> or username</text>
                    <div style={{ display: 'flex', gap: 10, marginTop: 20, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <div >
                            <input style={{ backgroundColor: '#EEF0FF', border: '1px solid #000000', width: 240, height: 28, borderRadius: 5, padding: 5 }} type="text" placeholder='email' onChange={(e) => {

                                setEmail(e.target.value);
                            }} />
                        </div>
                        <div>
                            <input style={{ backgroundColor: '#EEF0FF', border: '1px solid #000000', width: 240, height: 28, borderRadius: 5, padding: 5 }} type="text" placeholder='password' onChange={(e) => {
                                setPassword(e.target.value)
                            }} />
                        </div>
                        <text style={{ alignSelf: 'flex-end', color: '#000000', fontSize: 13, fontWeight: 629 }}>Forgot Password?</text>
                        <div>
                            <button onClick={login} style={{ backgroundColor: '#01138F', marginTop: 5, cursor: 'pointer', color: '#FFFFFF', borderRadius: 30, border: 'none', height: 40, width: 250 }}>Login</button>
                        </div>
                        <div style={{ marginTop: 10, height: 1, width: '100%', backgroundColor: '#000000' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                                <text style={{ color: 'black', fontSize: 14, textAlign: 'center' }}>Don't have an account?</text>
                            </div>

                            <button style={{ cursor: 'pointer', marginTop: 15, marginBottom: 15, border: '1px solid #000000', height: 50, textAlign: 'center', borderRadius: 5, backgroundColor: '#EEF0FF', width: '100%', padding: 10 }}>
                                Create an account?
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
