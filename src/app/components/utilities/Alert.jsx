"use client";

import { useEffect } from "react";

// Info Alert (static)
const InfoAlert = ({ title, message }) => {
  return (
    <div
      className="flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50"
      role="alert"
    >
      <svg
        className="flex-shrink-0 inline w-5 h-5 mr-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9 2a1 1 0 0 1 .993.883L10 3v14a1 1 0 0 1-1.993.117L8 17V3a1 1 0 0 1 1-1z" />
        <path d="M9 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      </svg>
      <span className="sr-only">Info</span>
      <div>
        <span className="font-medium">{title}</span> {message}
      </div>
    </div>
  );
};

// Floating Success Alert
const SuccessAlert = ({ title = "Success", message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      <div
        className="flex items-center p-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 shadow-md"
        role="alert"
      >
        <svg
          className="flex-shrink-0 inline w-5 h-5 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
        </svg>
        <div>
          <span className="font-medium">{title}:</span> {message}
        </div>
      </div>
    </div>
  );
};

// Floating Error Alert
const ErrorAlert = ({ title = "Error", message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      <div
        className="flex items-center p-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 shadow-md"
        role="alert"
      >
        <svg
          className="flex-shrink-0 inline w-5 h-5 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.764-1.36 2.722-1.36 3.486 0l6.516 11.614c.75 1.337-.213 3.037-1.742 3.037H3.483c-1.53 0-2.492-1.7-1.742-3.037L8.257 3.1zm1.743 10.4a1 1 0 100 2 1 1 0 000-2zm.25-7.75a.75.75 0 00-1.5 0v5.25a.75.75 0 001.5 0V5.75z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <span className="font-medium">{title}:</span> {message}
        </div>
      </div>
    </div>
  );
};

export default { InfoAlert, SuccessAlert, ErrorAlert };
