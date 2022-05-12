import React, { useRef, useState } from "react"
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
    const history = useHistory()

    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")

    const loginHandle = () => {
        if (phone == "" || password == "") {
            toast.error("لطفا تمامی فیلد ها پرشود")
        } else {
            axios({
                url: "/login",
                method: "POST",
                data: {
                    phone: phone,
                    password: password
                }
            })
                .then((response) => {
                    toast.success(response.data.success)
                    history.push({
                        pathname: "/",
                        state: {
                            userId: response.data.info._id,
                            username: response.data.info.username,
                            phone: response.data.info.phone,
                            image: response.data.info.image
                        }
                    })
                })
                .catch((err) => {
                    toast.error(err.response.data.error)
                    setPhone("")
                    setPassword("")
                })
        }
    }

    return (
        <div className="container">
            <div className="row d-flex flex-column align-items-center mt-5">
                <div className="col-lg-5 bg-white d-flex flex-column align-items-center shadow-sm rounded mt-5 p-3">
                    <p className="fw-bold fs-5">ورود به چت روم</p>
                    <input
                        type={"text"}
                        placeholder="شماره همراه"
                        className="form-control w-75 my-2"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <input
                        type={"password"}
                        placeholder="رمزعبور"
                        className="form-control w-75 my-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="btn btn-primary w-75 my-3" onClick={loginHandle}>ورود</button>
                    <p className="mt-3" onClick={() => history.push("/register")}>حساب کاربری ندارید؟ ثبت نام کنید</p>
                </div>
            </div>
        </div>
    )
}

export default Login;