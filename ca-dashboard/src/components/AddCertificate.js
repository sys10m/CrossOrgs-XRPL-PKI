"use client";
import apiClient from "@/libs/api";
const AddCertificate = () => {
    const handleAddCertificate = async () => {
        console.log("clicked");
        try {
            await apiClient.get("/my-request");
        }
        catch (e) {
            console.error(e?.message);
        }
    }

    const handleTest = async () => {
        try {
            await apiClient.post("/my-request");
        }
        catch (e) {
            console.error(e?.message);
        }
    }
    return (
        <>
            <div>
                <p>form</p>
                <button className="btn btn-active btn-neutral" onClick={handleAddCertificate}>Sign Certificate</button>
                <button className="btn btn-active btn-neutral" onClick={handleTest}>TEST POST</button>
            </div>
        </>
    );
};

export default AddCertificate;