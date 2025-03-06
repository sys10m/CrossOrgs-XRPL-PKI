'use client';

import AddCertificate from '@/components/AddCertificate';
import LogoutButton from '@/components/LogoutButton';
import SSLRequestsTable from '@/components/SSLRequestsTable';
import { useEffect, useState } from 'react';
import apiClient from '@/libs/api';

export default function Dashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = async () => {
        try {
            const data = await apiClient.get('/my-request');
            setRequests(data.requests);
            console.log(data.requests);
        } catch (err) {
            setError('Failed to fetch requests');
            console.error('Error fetching requests:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id) => {
        const formData = new FormData();
        formData.append('id', id);
        try {
            console.log("Btn clicked");
            await apiClient.post(`/approve-request`, formData);
            fetchRequests(); // Refresh the list
        } catch (err) {
            setError('Failed to approve request');
            console.error('Error approving request:', err);
        }
    };

    const handleReject = async (id) => {
        try {
            await apiClient.post(`/reject-request/${id}`);
            fetchRequests(); // Refresh the list
        } catch (err) {
            setError('Failed to reject request');
            console.error('Error rejecting request:', err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <LogoutButton />
            </div>
            <div className="grid gap-6">
                <AddCertificate />
                
                <div className="rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Your SSL Requests</h2>
                    <SSLRequestsTable 
                        requests={requests} 
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                </div>
            </div>
        </div>
    );
}