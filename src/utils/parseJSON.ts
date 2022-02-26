export const parseJSON = (input: string): Record<string, any> => {
	try {
		return JSON.parse(input)
	} catch {
		console.debug(`[parseJSON]`, `failed to parse`, input)
		return {}
	}
}
