export function LoadingIndicator() {
    return <div className="spinner-container my-2">
        <div className="spinner-border custom-spinner" role="status">
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