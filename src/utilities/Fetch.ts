import ApiUrl from "./ApiUrl";

export async function FetchGet(url: string, token: string) {
    const response = await fetch(`${ApiUrl()}/api/${url}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    })
    return response;
}

export async function FetchPost(url: string, body: {}, token: string) {
    const response = await fetch(`${ApiUrl()}/api/${url}`, {
        body: JSON.stringify(body),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        method: "POST"
    })
    return response;
}

export async function FetchPatch(url: string, body: {}, token: string) {
    const response = await fetch(`${ApiUrl()}/api/${url}`, {
        body: JSON.stringify(body),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        method: "PATCH"
    })
    return response;
}

export async function FetchDelete(url: string, body: {}, token: string) {
    const response = await fetch(`${ApiUrl()}/api/${url}`, {
        body: JSON.stringify(body),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        method: "DELETE"
    })
    return response;
}
