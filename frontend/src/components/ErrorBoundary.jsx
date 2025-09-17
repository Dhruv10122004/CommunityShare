import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null };

  // Catch errors in any child component
  static getDerivedStateFromError(error) {
    // Update state so the next render shows fallback UI
    return { hasError: true, error };
  }

  // Log error details (important for debugging)
  componentDidCatch(error, errorInfo) {
    console.error("🔥 Error caught by ErrorBoundary 🔥");
    console.error("Error message:", error.message);
    console.error("Stack trace:", error.stack);
    console.error("Component stack:", errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center mt-10">
          <h1 className="text-red-600 font-bold text-xl">Something went wrong.</h1>
          {this.state.error && (
            <p className="text-sm text-gray-700 mt-2">
              {this.state.error.message}
            </p>
          )}
          {this.state.errorInfo && (
            <pre className="text-xs text-left bg-gray-100 p-2 mt-2 overflow-x-auto">
              {this.state.errorInfo.componentStack}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
