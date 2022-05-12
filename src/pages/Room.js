import React, { useEffect, useRef, useState } from "react"
import { IoSend } from "react-icons/io5"
import { useLocation, useHistory } from "react-router-dom"
import SocketIoClient from "socket.io-client"
import { toast } from "react-toastify"
import axios from "axios"

const Room = () => {
    const location = useLocation()
    const history = useHistory()
    const socket = useRef(SocketIoClient("http://localhost:5000/socket"))

    const [userList, setUserList] = useState([])
    const [messageValue, setMessageValue] = useState("")
    const [messageList, setMessageList] = useState([])
    const [guestUserId, setGuestUserId] = useState("")
    const [guestUsername, setGuestUsername] = useState("")
    const [guestUserImage, setGuestUserImage] = useState("")
    const [preMessage, setPreMessage] = useState([])

    //check user login
    useEffect(() => {
        const checkUserLogin = () => {
            const userId = location?.state?.userId
            if (!userId) {
                history.push("/login")
            }
        }
        checkUserLogin()
    }, [])

    //get all user
    useEffect(() => {
        axios({
            url: "/getAllUser",
            method: "GET",
        })
            .then((response) => {
                setUserList(response.data.filter(item => item._id !== location.state.userId))
            })
            .catch((err) => {
                toast.error(err.response.data.error)
            })
    }, [])

    //send message
    const sendMessageHandle = () => {
        if (messageValue == "") {
            toast.error("لطفا چیزی بنویسید")
        } else {
            socket.current.emit("newMessage", {
                hostUsername: location.state.username,
                guestUsername: guestUsername,
                text: messageValue,
                hostUserId: location.state.userId,
                guestUserId: guestUserId
            })
            setMessageValue("")
        }
    }

    //get message
    useEffect(() => {
        const getMessageHandle = () => {
            socket.current.on("newMessage", (data) => {
                setMessageList(messageList => messageList.concat(data))
            })
        }
        getMessageHandle()
    }, [])

    //send online
    useEffect(() => {
        socket.current.emit("online", {
            username: location.state.username
        })
    }, [])

    //check online
    /* useEffect(() => {
        socket.current.on("online", (data) => {
            toast.success(data.message)
        })
    }, []) */

    //select guestUser
    const selectGuestUserHandle = (id, username, image) => {
        setGuestUserId(id)
        setGuestUsername(username)
        setGuestUserImage(image)
    }

    //create chat
    const createChatHandle = (username) => {
        socket.current.emit("createChat", {
            hostUsername: location.state.username,
            guestUsername: username
        })
    }

    //clear chat
    useEffect(() => {
        setMessageList([])
    }, [guestUserId])

    //get all pre message
    const getAllPreMessageHandle = (id) => {
        axios({
            url: "/getAllMessage",
            method: "POST",
            data: {
                sender: location.state.userId,
                receiver: id
            }
        })
            .then((response) => {
                setPreMessage(response.data)
            })
            .catch((err) => {
                toast.error(err.response.data.error)
            })
    }

    return (
        <div className="container">
            <div className="row mt-5">

                {/* user list box */}
                <div className="col-lg-3 pe-0">
                    <div className="bg-white p-3 shadow-sm rounded">
                        <p>لیست کاربران</p>
                        <ul className="px-2">
                            {
                                userList.map((item, key) => (
                                    <li className="d-flex flex-row align-items-center justify-content-between my-4" onClick={() => { selectGuestUserHandle(item._id, item.username, item.image); createChatHandle(item.username); getAllPreMessageHandle(item._id); }}>
                                        <img
                                            src={`http://localhost:5000/${item.image}`}
                                            className="user-list-image"
                                        />
                                        <span style={{ fontSize: 13, fontWeight: "bold" }}>{item.username}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>

                {/* content */}
                {
                    guestUserId ?
                        <div className="col-lg-9 ps-0">
                            <div className="shadow-sm rounded content">

                                {/* header */}
                                <div className="header-container p-3">
                                    <div className="d-flex flex-row align-items-center justify-content-start">
                                        <img
                                            src={`http://localhost:5000/${guestUserImage}`}
                                            className="user-list-image"
                                        />
                                        <span style={{ fontSize: 13, fontWeight: "bold", marginRight: 8 }}>{guestUsername}</span>
                                    </div>
                                </div>

                                {/* message */}
                                <div className="message-container p-3">

                                    {/* pre message */}

                                    {
                                        preMessage.map((item, key) => (
                                            item.sender == location.state.userId ?
                                                <>
                                                    <div className="hostMessageBox pt-1 pe-2">
                                                        <span className="hostMessageText">{item.text}</span>
                                                    </div>
                                                    <br />
                                                </>
                                                :
                                                <>
                                                    <div className="guestMessageBox pt-1 pe-2">
                                                        <span className="guestMessageText">{item.text}</span>
                                                    </div>
                                                    <br /><br />
                                                </>
                                        ))
                                    }

                                    {
                                        messageList.map((item, key) => (
                                            item.hostUsername == location.state.username ?
                                                <>
                                                    <div className="hostMessageBox pt-1 pe-2">
                                                        <span className="hostMessageText">{item.text}</span>
                                                    </div>
                                                    <br />
                                                </>
                                                :
                                                <>
                                                    <div className="guestMessageBox pt-1 pe-2">
                                                        <span className="guestMessageText">{item.text}</span>
                                                    </div>
                                                    <br /><br />
                                                </>
                                        ))
                                    }

                                </div>

                                {/* footer */}
                                <div className="footer-container p-3 d-flex flex-row align-items-center justify-content-between">
                                    <input
                                        type={"text"}
                                        placeholder="چیزی بنویسید..."
                                        className="message-input"
                                        value={messageValue}
                                        onChange={(e) => setMessageValue(e.target.value)}
                                    />
                                    <button className="send-message-button" onClick={sendMessageHandle}>
                                        <IoSend style={{ fontSize: 22, color: "#fff" }} />
                                    </button>
                                </div>

                            </div>
                        </div> :
                        <div className="col-lg-9 ps-0">
                            <div class="alert alert-warning" role="alert">
                                کاربری برای گفتگو انتخاب نشده است
                            </div>
                        </div>
                }

            </div>
        </div>
    )
}

export default Room;