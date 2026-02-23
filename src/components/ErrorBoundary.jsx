import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state with the next error
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div
            className="p-8 rounded-xl text-center max-w-md"
            style={{
              background: 'rgba(239,68,68,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(239,68,68,0.2)'
            }}
          >
            <div className="text-red-500 text-lg mb-4"></div>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#1f2937' }}>
              Something went wrong
            </h2>
            <p className="mb-4" style={{ color: '#6b7280' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-700 mb-4">
                  Error Details
                </summary>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
            
            <button
              onClick={this.handleRetry}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              style={{
                background: '#3b82f6',
                color: 'white'
              }}
              onMouseOver={(e) => e.target.style.background = '#2563eb'}
              onMouseOut={(e) => e.target.style.background = '#3b82f6'}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
