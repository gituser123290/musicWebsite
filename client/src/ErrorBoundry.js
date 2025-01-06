import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  // This method is called when a child component throws an error
  static getDerivedStateFromError(error) {
    // Update state to display the fallback UI
    return { hasError: true, errorMessage: error.message };
  }

  // This method is called after an error is thrown
  componentDidCatch(error, info) {
    // Log the error and info to an error reporting service
    console.error('Error caught by ErrorBoundary: ', error, info);
  }

  render() {
    // If there is an error, show the fallback UI
    if (this.state.hasError) {
      return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='text-center p-8 bg-white shadow-lg rounded-lg border border-gray-300'>
                <h1 className='text-4xl font-bold text-red-600 mb-4'>Something went wrong.</h1>
                <p className='text-xl text-red-700 mb-6'>{this.state.errorMessage}</p>
                <button
                onClick={() => window.location.reload()}
                className='px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none'>
                Try Again
                </button>
            </div>
        </div>
      );
    }

    // Otherwise, render the children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
