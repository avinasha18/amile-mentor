import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Company from "../models/company.model.js";
import { generateUniqueToken } from '../services/uniqueTokenGeneration.js';
import { sendEmail } from '../services/mailServices.js';
import { HtmlTemplates } from '../services/htmlTemplates.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Create JWT token
const createToken = (company) => {
  return jwt.sign({ id: company._id }, JWT_SECRET, { expiresIn: '7d' });
};

// Signup a new company
export const signupCompany = async (req, res) => {
  try {
    const verificationToken = generateUniqueToken();
    const companyData = {
      ...req.body,
      verificationToken
    };

    const subject = "AMILE ACCOUNT SIGNUP";

    const company = await Company.signup(companyData);
    await sendEmail(company.email, subject, HtmlTemplates.CompanyAccountVerification(verificationToken));
    res.status(201).json({ success: true, message: 'Company registered. Please check your email to verify your account.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const company = await Company.findOne({ verificationToken: token });
    if (!company) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    company.status = 'active';
    company.verificationToken = undefined;  // clear the token after verification
    await company.save();
    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login an existing company
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;
  try {
    const company = await Company.login(email, password);
    const token = createToken(company);
    res.status(200).json({ success: true, token, company });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const resetToken = generateUniqueToken();
    company.resetPasswordToken = resetToken;
    company.resetPasswordExpires = Date.now() + 900000; // Token expires in 15mins

    await company.save();

    const subject = "AMILE Account Password Reset";
    await sendEmail(company.email, subject, HtmlTemplates.CompanyResetPasswordLink(resetToken));

    res.status(200).json({ success: true, message: 'Password reset link has been sent to your email.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;
  try {
    const company = await Company.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // Ensure token has not expired
    });

    if (!company) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    company.password = newPassword;
    company.resetPasswordToken = undefined;
    company.resetPasswordExpires = undefined;

    await company.save();
    res.status(200).json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Find companies by name
export const findCompaniesByName = async (req, res) => {
  const { name } = req.query;
  try {
    const companies = await Company.findByName(name);
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update company details
export const updateCompanyDetails = async (req, res) => {
  const { companyId } = req;

  try {
    const updatedCompany = await Company.findByIdAndUpdate(companyId, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedCompany });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get the authenticated company details
export const getCompanyDetails = async (req, res) => {
  try {
    const company = await Company.findById(req.companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
