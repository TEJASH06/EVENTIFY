const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const dispatchBookingConfirmation = async (recipientEmail, recipientName, eventTitle) => {
    try {
        const messageSettings = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: `Reservation Confirmed - ${eventTitle}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 30px; text-align: center; color: #ffffff;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 700; tracking-wide">Reservation Confirmed!</h1>
                    </div>
                    <div style="padding: 30px; background-color: #ffffff; color: #334155;">
                        <p style="font-size: 16px; margin-top: 0;">Hello <strong>${recipientName}</strong>,</p>
                        <p style="font-size: 15px; line-height: 1.6;">Your ticket reservation for the upcoming experience, <strong>${eventTitle}</strong>, is successfully verified and locked in.</p>
                        <p style="font-size: 15px; line-height: 1.6;">You can view and manage this reservation directly from your dashboard.</p>
                        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 25px 0;" />
                        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 0;">Thanks for choosing Eventify.</p>
                    </div>
                </div>
            `
        };
        await mailTransporter.sendMail(messageSettings);
        console.log(`Booking confirmation email sent to: ${recipientEmail}`);
    } catch (err) {
        console.error(`Error sending reservation confirmation email: ${err.message}`);
    }
};

const dispatchOTPMail = async (recipientEmail, code, actionType) => {
    try {
        const isRegistration = actionType === 'account_verification';
        const mailSubject = isRegistration ? 'Verify Eventify Profile' : 'Confirm Eventify Reservation';
        const mailHeader = isRegistration ? 'Activate Your Account' : 'Confirm Reservation Action';
        const mailDescription = isRegistration
            ? 'Use the secure code below to activate your account and access the platform.'
            : 'Enter the verification code below to authorize your ticket reservation.';

        const messageSettings = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: mailSubject,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                    <div style="background-color: #0f172a; padding: 25px; text-align: center; color: #ffffff;">
                        <h2 style="margin: 0; font-weight: 600; font-size: 20px;">${mailHeader}</h2>
                    </div>
                    <div style="padding: 30px; text-align: center; background-color: #ffffff; color: #334155;">
                        <p style="font-size: 15px; margin-top: 0; line-height: 1.5;">${mailDescription}</p>
                        <div style="display: inline-block; margin: 25px 0; padding: 12px 30px; font-size: 28px; font-weight: 800; background-color: #f8fafc; color: #0f172a; border-radius: 8px; letter-spacing: 6px; border: 1px dashed #cbd5e1;">
                            ${code}
                        </div>
                        <p style="font-size: 12px; color: #94a3b8; line-height: 1.4; margin-bottom: 0;">
                            This validation code is active for 5 minutes. If you did not initiate this request, you can safely disregard this email.
                        </p>
                    </div>
                </div>
            `
        };
        await mailTransporter.sendMail(messageSettings);
        console.log(`OTP mail sent successfully to: ${recipientEmail} [Action: ${actionType}]`);
    } catch (err) {
        console.error(`Error sending verification email: ${err.message}`);
    }
};

module.exports = { dispatchBookingConfirmation, dispatchOTPMail };
