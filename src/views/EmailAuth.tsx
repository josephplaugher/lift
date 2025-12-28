import { useAuth0 } from "@auth0/auth0-react";

export default function EmailAuth() {
    const { loginWithPopup } = useAuth0();
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const email = formData.get("email");
        const password = formData.get("password");

        fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
    }

    return (
        <div className="card mt-5">
            <div className="card-body">
                <div className="card-title d-flex justify-content-center">Sign In</div>
                <button
                    onClick={() => loginWithPopup()}
                    className="button login"
                >
                    Log In
                </button>
                {/* <form onSubmit={handleSubmit} >
                    <div className="form-floating mb-3">
                        <input className="form-control form-control-sm" id="email" name="email" type="text" placeholder="Email" />
                        <label htmlFor="email">Email</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input className="form-control form-control-sm" id="password" name="password" type="password" placeholder="Password" />
                        <label htmlFor="password">Password</label>
                    </div>

                    <button className="btn btn-primary w-100 mt-5" type="submit">Sign In</button>
                </form> */}
            </div>
        </div>
    );
}