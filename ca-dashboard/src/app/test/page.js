'use client';

import { useState } from 'react';
import apiClient from '@/libs/api';

export default function TestPage() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTestClick = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await apiClient.get('/test');
            setResult(response);
            
            console.log('Test API Response:', response);
        } catch (err) {
            console.error('Test API Error:', err);
            setError(err.message || 'Failed to call test API');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="card bg-base-200">
                <div className="card-body">
                    <h2 className="card-title">Test CSR Upload</h2>
                    
                    <div className="card-actions justify-end mt-4">
                        <button 
                            className={`btn btn-primary ${loading ? 'loading' : ''}`}
                            onClick={handleTestClick}
                            disabled={loading}
                        >
                            {loading ? 'Uploading...' : 'Upload Test CSR'}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                </div>
            )}

            {result && (
                <div className="card bg-base-200">
                    <div className="card-body">
                        <h3 className="card-title text-success">Success!</h3>
                        <pre className="bg-base-300 p-4 rounded-lg overflow-x-auto">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}