import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <h1 className="text-center mt-10">Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;