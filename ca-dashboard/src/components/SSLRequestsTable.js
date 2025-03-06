'use client';

export default function SSLRequestsTable({ requests, onApprove, onReject }) {
  if (!requests?.length) {
    return (
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>No SSL requests found</span>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  };

  return (
    <div className="overflow-x-auto bg-base-100 rounded-lg">
      <table className="table table-zebra">
        {/* head */}
        <thead className="bg-base-200 text-base-content">
          <tr>
            <th>Common Name</th>
            <th>Organization</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => {
            // Parse the csrDetails if it's a string
            const details = typeof request.csrDetails === 'string' 
              ? JSON.parse(request.csrDetails) 
              : request.csrDetails;

            return (
              <tr key={request.id} className="hover">
                <td>
                  <div className="space-y-1">
                    <p className="font-medium">{details?.CN || 'N/A'}</p>
                    <p className="text-sm opacity-70">{details?.emailAddress || 'No email'}</p>
                  </div>
                </td>
                <td>
                  <div className="space-y-1">
                    <p>{details?.O || 'N/A'}</p>
                    <p className="text-sm opacity-70">{details?.OU || ''}</p>
                  </div>
                </td>
                <td>
                  <div className="space-y-1 text-sm">
                    <p>{details?.L || 'N/A'}</p>
                    <p>{details?.ST}, {details?.C}</p>
                  </div>
                </td>
                <td>
                  <div className={`badge ${getStatusBadgeClass(request.status)}`}>
                    {request.status}
                  </div>
                </td>
                <td>
                  {request.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => onApprove(request.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Approve
                      </button>
                      <button 
                        className="btn btn-error btn-sm"
                        onClick={() => onReject(request.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-base-content/70">No actions available</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}