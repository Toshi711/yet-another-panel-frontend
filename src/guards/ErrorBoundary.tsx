import React, { Component, ErrorInfo, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  is403Error: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    is403Error: false,
  };

  public static getDerivedStateFromError(error: any): State {
    // Check if the error is a Response object with status 403
    if (error && error.status === 403) {
      return { hasError: true, is403Error: true };
    }
    return { hasError: true, is403Error: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.is403Error) {
      return <Navigate to="/unauthorized" replace />;
    }

    if (this.state.hasError) {
      return <h1>Sorry.. there was an error</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;