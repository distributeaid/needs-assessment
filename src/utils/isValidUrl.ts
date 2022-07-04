export const isValidUrl = (url?: string): boolean => {
	if (url === undefined) return false
	try {
		new URL(url)
		return true
	} catch {
		return false
	}
}
