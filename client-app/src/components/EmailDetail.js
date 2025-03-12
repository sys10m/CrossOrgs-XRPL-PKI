const EmailDetail = (props) => {
    console.log(props);
    return (
        <div className="flex-1 p-4">
            {/* Email details section */}
            <div className="bg-[#154c79] rounded-lg shadow-md p-4">
                <h2 className="text-xl font-bold">{props.email.subject}</h2>
                <p className="text-gray-100">From: {props.email.from}</p>
                <p className="mt-2">{props.email.text}</p>
            </div>
        </div>
    );
}

export default EmailDetail;