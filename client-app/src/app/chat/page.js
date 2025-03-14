'use client';

import EmailDetail from '@/components/EmailDetail';
import { useState, useEffect } from 'react';
import CreateEmailButton from '@/components/CreateEmailButton';
import apiClient from '@/libs/api';

const Chat = () => {
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [emailContent, setEmailContent] = useState(null);
    const fetchEmails = async () => {
        try {
            const data = await apiClient.get('/emails');
            let fetchEmails = data.fetchedEmails;
            // Sort emails by date, latest first
            fetchEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
            setEmails(fetchEmails);
        } catch (err) {
            console.error('Error fetching emails:', err);
        } finally {
        }
    };

    const fetchContent = async (email) => {
        if (email) {
            try{
                const formData = new FormData();
                formData.append('uid', email.uid);
                const data = await apiClient.post('/emails/content', formData);
                console.log(data.emailContent);
                setEmailContent(data.emailContent.body);
            } catch (err) {
                console.error('Error fetching email content:', err);
            }
        }
    }

    useEffect(() => {
        fetchEmails();
    }, []);

    useEffect(() => {
        fetchContent(selectedEmail);
    }, [selectedEmail]);

    const handleDecrypt = async (message) => {
        const formData = new FormData();
        formData.append('encryptedMessage', message);
        const { decryptedMessage } = await apiClient.post('/decryptEmail', formData);
        console.log(typeof decryptedMessage);
        console.log(decryptedMessage)
        return decryptedMessage;
    }

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
                        {emails.map((email) => (
                            <li
                                key={email.uid}
                                className="my-2 p-2 hover:bg-gray-200 hover:text-black cursor-pointer rounded"
                                onClick={() => setSelectedEmail(email)}
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <span className="font-bold">{email.subject}</span>
                                        <span className="text-sm text-gray-350 block">{email.from}</span>
                                    </div>
                                    <span className="text-sm">{new Date(email.date).toLocaleString()}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <CreateEmailButton />
            </div>

            {/* Main content area */}
            {selectedEmail && <EmailDetail decrypt={handleDecrypt} email={selectedEmail} content={emailContent} />}
        </div>
    );
}

export default Chat;