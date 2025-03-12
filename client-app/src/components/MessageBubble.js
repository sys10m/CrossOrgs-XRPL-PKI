const MessageBubble = ({ message, sender }) => {
    return (
        <div className={`flex justify-${sender == 'userA' ? 'end' : 'start'} mb-2`}> 
            <div className={`p-1 rounded-lg shadow-sm ${sender === 'userA' ? 'bg-blue-500 text-white text-sm' : 'bg-gray-500 text-white text-lg'}`}> 
                {message}
            </div>
        </div>
    );
};

export default MessageBubble;