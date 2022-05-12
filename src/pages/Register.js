import React, { useRef, useState } from "react"
import { IoPersonCircleOutline } from "react-icons/io5"
import { toast } from "react-toastify"
import { useHistory } from "react-router-dom"
import axios from "axios"

const Register = () => {
    const imageInput = useRef()
    const history = useHistory()

    const [image, setImage] = useState("")
    const [username, setUsername] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")

    const registerHandle = () => {
        if (image == "" || username == "" || phone == "" || password == "") {
            toast.error("لطفا تمامی فیلد ها پرشود")
        } else {
            const data = new FormData()
            data.append("username", username)
            data.append("phone", phone)
            data.append("password", password)
            data.append("image", image)

            axios({
                url: "/register",
                method: "POST",
                data: data
            })
                .then((response) => {
                    toast.success(response.data.success)
                    history.push("/login")
                })
                .catch((err) => {
                    toast.error(err.response.data.error)
                    setImage("")
                    setUsername("")
                    setPhone("")
                    setPassword("")
                })
        }
    }

    return (
        <div className="container">
            <div className="row d-flex flex-column align-items-center mt-5">
                <div className="col-lg-5 bg-white d-flex flex-column align-items-center shadow-sm rounded mt-5 p-3">
                    <p className="fw-bold fs-5">عضویت در چت روم</p>
                    <div className="image-box my-3" onClick={() => imageInput.current.click()}>
                        <IoPersonCircleOutline className="image-icon" />
                    </div>
                    <input
                        type={"file"}
                        placeholder="عکس"
                        className="form-control w-75 my-2"
                        hidden
                        ref={imageInput}
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    <input
                        type={"text"}
                        placeholder="نام کاربری"
                        className="form-control w-75 my-2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
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
                    <button className="btn btn-primary w-75 my-3" onClick={registerHandle}>عضویت</button>
                </div>
            </div>
        </div>
    )
}

export default Register;