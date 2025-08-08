export function LoadingIndicator() {
    return <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
    </div>
}

type ErrorMesage = {
    error: string;
}
export function ErrorIndicator(error: ErrorMesage) {
    return <div className="bg-info" role="status">
        <span className="text-danger">{error.error}</span>
    </div>
}