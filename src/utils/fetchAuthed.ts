export function fetchAuthed<
  TPayload extends object | undefined = undefined,
  TResult extends object | undefined = undefined
>(path: string, token: string, body?: TPayload, init?: RequestInit) {
  return fetch(`${process.env.NEXT_PUBLIC_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
      ContentType: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then((res) => res.json() as Promise<TResult>);
}
