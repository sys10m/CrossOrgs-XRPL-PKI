"use client";

import { useState } from 'react';

const Dashboard = () => {
    const [organization, setOrganization] = useState('');
    const [commonName, setCommonName] = useState('');
    const organizations = ['Organization A', 'Organization B', 'Organization C']; // Replace with your actual organization list

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the form submission logic here
        console.log('Selected Organization:', organization);
        console.log('Common Name:', commonName);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#085c98]">
            <h1 className="text-2xl font-bold mb-4">Request Certificate</h1>
            <form onSubmit={handleSubmit} className="bg-[#063970] p-6 rounded shadow-md w-full max-w-md">
                <div className="mb-4">
                    <label htmlFor="organization" className="block text-sm font-medium text-white">
                        Select Organization
                    </label>
                    <select
                        id="organization"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Choose an organization</option>
                        {organizations.map((org) => (
                            <option key={org} value={org}>
                                {org}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="commonName" className="block text-sm font-medium text-white">
                        Common Name
                    </label>
                    <input
                        type="text"
                        id="commonName"
                        value={commonName}
                        onChange={(e) => setCommonName(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Request Certificate
                </button>
            </form>
        </div>
    );
};

export default Dashboard;