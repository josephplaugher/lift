export function LoadingIndicator() {
    return <div className="my-2 spinner-container">
        <div className="spinner-border custom-spinner" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
}

export function LoadingIndicatorFullScreen() {
    return <div className="spinner-overlay">
        <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
}

type ErrorMesage = {
    error: string;
}
export function ErrorIndicator(error: ErrorMesage) {
    return <div className="bg-warning" role="status">
        <span className="text-danger m-3">{error.error}</span>
    </div>
}