const nodemailer = require('nodemailer');

// Email service and credentials from .env
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Notify the requester about the meeting details
const sendMeetingEmail = async (toEmail, details) => {
    const { requesterName, postTitle, meetingDate, meetingTime, meetingLink } = details;

    const mailOptions = {
        from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `Swap Accepted: ${postTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; padding: 30px; color: #333;">
                <h2 style="color: #4f46e5; font-size: 26px; font-weight: 900; font-style: italic;">Meeting Scheduled.</h2>
                <p style="font-weight: bold; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; color: #64748b;">Knowledge Exchange Details</p>
                
                <p>Hi <b>${requesterName}</b>,</p>
                <p>Your swap request for <b>${postTitle}</b> has been accepted. Grab your coffee and get ready!</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 15px; margin: 25px 0; border: 1px solid #f1f5f9;">
                    <p style="margin: 8px 0;">📅 <b>Date:</b> ${meetingDate}</p>
                    <p style="margin: 8px 0;">⏰ <b>Time:</b> ${meetingTime}</p>
                    <p style="margin: 8px 0;">🔗 <b>Link:</b> <a href="${meetingLink}" style="color: #4f46e5; font-weight: 900;">Join Meeting</a></p>
                </div>

                <p style="font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase;">Sent via SkillSwap.</p>
            </div>
        `
    };

    // Send the email and handle errors
    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Email sending failed:", error);
        return { success: false, error };
    }
};

module.exports = { sendMeetingEmail };