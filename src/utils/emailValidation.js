import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../backend/firebaseConfig';

const ABSTRACT_API_KEY = import.meta.env.VITE_ABSTRACT_API_KEY;

export const validateEmail = async (email) => {
  try {
    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${ABSTRACT_API_KEY}&email=${encodeURIComponent(email)}`
    );
    
    if (!response.ok) {
      throw new Error('Email validation service unavailable');
    }
    
    const data = await response.json();
    
    // Only check if email is deliverable
    if (!data.deliverability || data.deliverability === 'UNDELIVERABLE') {
      return { isValid: false, error: 'This email address cannot receive emails. Please check and try again.' };
    }
    
    return { isValid: true };
    
  } catch (error) {
    console.error('Email validation error:', error);
    return { isValid: true };
  }
};

// Check if email exists in user database using Firebase Auth
export const checkEmailExists = async (email) => {
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    return signInMethods.length > 0;
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false;
  }
};

export const validateEmailForReset = async (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!email || !emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  const domainPart = email.split('@')[1];
  if (domainPart && /^\d/.test(domainPart)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};
