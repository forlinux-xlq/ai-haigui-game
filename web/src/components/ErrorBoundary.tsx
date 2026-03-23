import React from 'react';

interface IErrorBoundaryProps {
  children: React.ReactNode;
}

interface IErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
}

class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  public state: IErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(error: unknown): IErrorBoundaryState {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { hasError: true, errorMessage: message };
  }

  public componentDidCatch(): void {
    // Placeholder: in a real app we'd report to monitoring.
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6">
            <h1 className="text-2xl font-semibold mb-2">页面出错了</h1>
            <p className="text-slate-300 mb-4">
              {this.state.errorMessage ?? '请刷新后重试'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

