import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
    children?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white p-8 font-sans">
                    <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-rose-500/20 p-10 rounded-[2.5rem] shadow-2xl text-center space-y-6">
                        <div className="w-20 h-20 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto ring-4 ring-rose-500/10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase">System Error</h2>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                A critical rendering error occurred. The grand game show had a temporary technical glitch.
                            </p>
                        </div>

                        <div className="p-4 bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                            <p className="text-[10px] font-mono text-rose-400/80 break-all line-clamp-2">
                                {this.state.error?.message}
                            </p>
                        </div>

                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all active:scale-95 shadow-2xl"
                        >
                            Reset Session
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
