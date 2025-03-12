"use client";

import { useState } from "react";
import apiClient from "@/libs/api";

const CreateEmailButton = ({ onClick }) => {
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    const handleSend = async () => {
        // send email
        const formData = new FormData();
        formData.append('recipient', to);
        formData.append('subject', subject);
        formData.append('body', body);

        try{
            await apiClient.post('/emails', formData);
        } catch (err) {
            console.error('Error sending email:', err);
        }
        // clean up
        setTo("");
        setSubject("");
        setBody("");
    }

    return (
        <>
            <button
                onClick={() => document.getElementById('my_modal_5').showModal()}
                className="mt-4 w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Create Email
            </button>
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">New Email</h3>
                    <form className="pt-4 space-y-4">
                        <label className="block">
                            <span className="text-gray-700">To</span>
                            <input
                                type="email"
                                className="mt-1 block w-full p-2  rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                placeholder="Recipient's email"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                            />
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Subject</span>
                            <input
                                type="text"
                                className="mt-1 block w-full p-2  rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                placeholder="Subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Body</span>
                            <textarea
                                className="mt-1 block w-full p-2  rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                placeholder="Body"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                            />
                        </label>
                    </form>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button
                                className="btn w-full bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                type="submit"
                                onClick={handleSend}
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default CreateEmailButton;