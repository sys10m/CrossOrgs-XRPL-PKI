'use client';

import LogoutButton from '@/components/LogoutButton';
import EmailDetail from '@/components/EmailDetail';
import { useState, useEffect } from 'react';
import CreateEmailButton from '@/components/CreateEmailButton';
import apiClient from '@/libs/api';

const Chat = () => {
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);

    const fetchEmails = async () => {
        try {
            const data = await apiClient.get('/emails');
            setEmails(data.emails);
            console.log(data.emails);
        } catch (err) {
            console.error('Error fetching emails:', err);
        } finally {
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    return (
        // Inside your component render method

        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/4 bg-[#147eb2] shadow-md p-4 flex flex-col justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Inbox</h2>
                    {/* List of email items */}
                    <ul>
                        {/* Map through email items */}
                        {emails.map((email, index) => (
                            <li
                                key={index}
                                className="my-2 p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => setSelectedEmail(email)}
                            >
                                {email.subject}
                            </li>
                        ))}
                    </ul>
                </div>
                <CreateEmailButton />
            </div>

            {/* Main content area */}
            {selectedEmail && <EmailDetail email={selectedEmail} />}
        </div>
    );
}

export default Chat;