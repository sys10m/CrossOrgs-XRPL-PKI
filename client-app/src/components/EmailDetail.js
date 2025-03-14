"use client";

import { useState, useEffect } from 'react';

const EmailDetail = (props) => {
    const [text, setText] = useState(props.content);
    const [isDecrypted, setIsDecrypted] = useState(false);

    const trimText = (orgText) => {
        const prefix = "This is an encrypted email: ";
        if (orgText.startsWith(prefix)) {
            return orgText.substring(prefix.length).trim(); // Remove the prefix and trim any extra whitespace
        }
        return orgText; // Return the original string if the prefix is not found
    }


    useEffect(() => {
        setText(props.content);
        setIsDecrypted(false);
    }, [props.content]);

    return (
        <div className="flex-1 p-4">
            {/* Email details section */}
            <div className="bg-[#154c79] rounded-lg shadow-md p-4">
                <h2 className="text-xl font-bold">{props.email.subject}</h2>
                <p className="text-gray-100">From: {props.email.senderEmail}</p>
                <div className="mt-2">
                    {isDecrypted ? (
                        <p>{text}</p>
                    ) : (
                        <div>
                            <button
                                onClick={
                                    async () => {
                                        setText(await props.decrypt(trimText(text)));
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