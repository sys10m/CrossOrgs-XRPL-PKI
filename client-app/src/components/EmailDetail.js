"use client";

import { useState } from 'react';

const EmailDetail = (props) => {
    const [text, setText] = useState(props.email.text);
    const [isDecrypted, setIsDecrypted] = useState(false);



    return (
        <div className="flex-1 p-4">
            {/* Email details section */}
            <div className="bg-[#154c79] rounded-lg shadow-md p-4">
                <h2 className="text-xl font-bold">{props.email.subject}</h2>
                <p className="text-gray-100">From: {props.email.from}</p>
                <div className="mt-2">
                    {isDecrypted ? (
                        <p>{text}</p>
                    ) : (
                        <div>
                            <button
                                onClick={
                                    async () => {
                                        setText(await props.decrypt(text));
                                        setIsDecrypted((prev) => !prev);
                                    }}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Decrypt
                            </button>
                            <p>{text}</p>
                        </div>
                    )}
                </div>
            </div >
        </div >
    );
}

export default EmailDetail;