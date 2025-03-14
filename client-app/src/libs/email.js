const nodemailer = require("nodemailer");
const Imap = require("node-imap");
const { simpleParser } = require("mailparser");

const imapConfig = {
    user: "testencfyp@gmail.com",
    password: process.env.EMAIL_APP_PASSWORD,
    host: "imap.gmail.com",
    port: 993,
    tls: true
};

const sendEmail = async (to, subject, text) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: to,
        subject: subject,
        text: `This is an encrypted email: ${text}`
    };
    try {
        await transporter.sendMail(mailOptions);
        return true;
    }
    catch (err) {
        console.log(`Error sending email: ${err}`);
        return false;
    }
};

const fetchEmails = async () => {
    return new Promise((resolve, reject) => {
        const imap = new Imap(imapConfig);

        imap.once("ready", () => {
            imap.openBox("INBOX", false, (err, box) => {
                if (err) {
                    console.error("Error opening inbox:", err);
                    imap.end();
                    return reject(err);
                }

                imap.search(["ALL"], (err, results) => {
                    if (err) {
                        console.error("Search error:", err);
                        imap.end();
                        return reject(err);
                    }

                    if (!results.length) {
                        console.log("No emails found.");
                        imap.end();
                        return resolve([]);
                    }

                    // 🔹 Fetch last 100 emails (change as needed)
                    const latestEmails = results.slice(-100);
                    const fetchedEmails = [];

                    const fetch = imap.fetch(latestEmails, { bodies: "", struct: true });

                    let processedEmails = 0;

                    fetch.on("message", (msg, seqno) => {
                        let emailBody = "";
                        let emailUid = null;

                        msg.on("attributes", (attrs) => {
                            emailUid = attrs.uid; // ✅ Extract UID
                        });

                        msg.on("body", (stream) => {
                            stream.on("data", (chunk) => {
                                emailBody += chunk.toString();
                            });
                        });

                        msg.once("end", async () => {
                            try {
                                const parsed = await simpleParser(emailBody);
                                fetchedEmails.push({
                                    uid: emailUid,  // ✅ Include UID
                                    from: parsed.from?.value?.[0]?.address || "Unknown",
                                    to: parsed.to?.value?.[0]?.address || "Unknown",
                                    subject: parsed.subject || "No Subject",
                                    date: parsed.date || "No Date",
                                    body: parsed.text || "No Body",
                                    html: parsed.html || "",
                                    attachments: parsed.attachments.map(att => ({
                                        filename: att.filename,
                                        contentType: att.contentType,
                                        size: att.size
                                    }))
                                });
                            } catch (parseErr) {
                                console.error("Parsing error:", parseErr);
                            }

                            processedEmails++;

                            // 🔹 Only resolve when all emails are processed
                            if (processedEmails === latestEmails.length) {
                                imap.end();
                                resolve(fetchedEmails);
                            }
                        });
                    });

                    fetch.once("end", () => {
                        console.log("Fetch completed.");
                    });
                });
            });
        });

        imap.once("error", (err) => {
            console.error("IMAP Connection Error:", err);
            reject(err);
        });

        imap.once("end", () => {
            console.log("IMAP Connection ended.");
        });

        imap.connect();
    });
};


/*
const fetchEmails = async () => {
    return new Promise((resolve, reject) => {
        const imap = new Imap(imapConfig);

        imap.once("ready", () => {
            imap.openBox("INBOX", false, (err, box) => {
                if (err) {
                    console.error("Error opening inbox:", err);
                    imap.end();
                    return reject(err);
                }

                imap.search(["ALL"], (err, results) => {
                    if (err) {
                        console.error("Search error:", err);
                        imap.end();
                        return reject(err);
                    }

                    if (!results.length) {
                        console.log("No new emails.");
                        imap.end();
                        return resolve([]);
                    }

                    const filteredResults = results.slice(-50);

                    const fetchedEmails = [];

                    const fetch = imap.fetch(filteredResults, { bodies: "", struct: true });

                    fetch.on("message", (msg) => {
                        let emailBody = "";
                        let uid = null;
                        msg.on("attributes", (attrs) => {
                            uid = attrs.uid;
                        });
                        msg.on("body", (stream) => {
                            stream.on("data", (chunk) => {
                                emailBody += chunk.toString();
                            });
                        });

                        msg.once("end", async () => {
                            try {
                                const parsed = await simpleParser(emailBody);
                                fetchedEmails.push({
                                    uid: uid,
                                    from: parsed.from.value[0].address,
                                    to: parsed.to.value[0].address,
                                    subject: parsed.subject,
                                    date: parsed.date
                                });
                            } catch (parseErr) {
                                console.error("Parsing error:", parseErr);
                            }
                        });
                    });

                    fetch.once("end", () => {
                        imap.end();
                        console.log(fetchedEmails);
                        resolve(fetchedEmails);
                    });
                });
            });
        });

        imap.once("error", (err) => {
            console.error("IMAP Connection Error:", err);
            reject(err);
        });

        imap.once("end", () => {
            console.log("IMAP Connection ended.");
        });

        imap.connect();
    });
};
*/
const getEmailContent = async (uid) => {
    return new Promise((resolve, reject) => {
        const imap = new Imap(imapConfig);

        imap.once("ready", () => {
            imap.openBox("INBOX", false, (err, box) => {
                if (err) {
                    console.error("Error opening inbox:", err);
                    imap.end();
                    return reject(err);
                }

                const fetch = imap.fetch([uid], { bodies: "" });

                fetch.on("message", (msg) => {
                    let emailBody = "";

                    msg.on("body", (stream) => {
                        stream.on("data", (chunk) => {
                            emailBody += chunk.toString();
                        });
                    });

                    msg.once("end", async () => {
                        try {
                            const parsed = await simpleParser(emailBody);
                            resolve({
                                from: parsed.from.value[0].address,
                                to: parsed.to.value[0].address,
                                subject: parsed.subject,
                                date: parsed.date,
                                body: parsed.text,
                                html: parsed.html,
                                attachments: parsed.attachments.map(att => ({
                                    filename: att.filename,
                                    contentType: att.contentType,
                                    size: att.size
                                }))
                            });
                        } catch (parseErr) {
                            console.error("Parsing error:", parseErr);
                            reject(parseErr);
                        }
                    });
                });

                fetch.once("error", (err) => {
                    console.error("Fetch error:", err);
                    reject(err);
                });

                fetch.once("end", () => {
                    imap.end();
                });
            });
        });

        imap.once("error", (err) => {
            console.error("IMAP Connection Error:", err);
            reject(err);
        });

        imap.once("end", () => {
            console.log("IMAP Connection ended.");
        });

        imap.connect();
    });
};

export { sendEmail, fetchEmails, getEmailContent };