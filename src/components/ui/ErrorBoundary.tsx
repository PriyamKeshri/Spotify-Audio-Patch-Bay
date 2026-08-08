import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackLabel?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In a real deployment this would report to an error-tracking service.
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div className="panel-brushed flex flex-col items-center justify-center gap-3 rounded-xl p-10 text-center">
          <AlertTriangle className="h-8 w-8 text-alert-500" />
          <p className="font-display text-lg text-console-100">
            {this.props.fallbackLabel ?? 'Something broke in the signal chain'}
          </p>
          <p className="max-w-md text-sm text-console-400">{this.state.error.message}</p>
          <Button variant="secondary" size="sm" onClick={this.reset}>
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
