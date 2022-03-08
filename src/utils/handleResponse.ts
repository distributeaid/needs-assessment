export const handleResponse =
	(onSuccess: (res: Response) => void, onError: (error: Error) => void) =>
	async (res: Response): Promise<void> => {
		if (res.ok) {
			return onSuccess(res)
		}
		if (
			res.headers.get('content-type')?.includes('application/problem+json') ??
			false
		) {
			const text = await res.text()
			const problem = JSON.parse(text)
			onError(new Error(`${problem.title} (${problem.status ?? res.status})`))
		} else {
			onError(new Error(`Request failed: ${res.status}`))
		}
	}
