import React from 'react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-blue-50 rounded-full mb-6">
            <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. Please check the URL or return to the homepage.
          </p>
        </div>

        {/* Button */}
        <a
          href="/"
          className="inline-block w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          Back to Homepage
        </a>

        {/* Footer link */}
        <div className="mt-6">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.history.back(); }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            ← Go back to previous page
          </a>
        </div>
      </div>
    </div>
  )
}

export default NotFound