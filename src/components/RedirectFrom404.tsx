import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const redirect = new URLSearchParams(window.location.search).get('redirect')

/**
 * Navigate to the desired page in case it was requested by the user, but GitHub pages served a 404 page (because it does not know about our apps routes).
 */
export const RedirectFrom404 = () => {
	const navigate = useNavigate()
	useEffect(() => {
		if (redirect === null) return
		navigate(redirect)
	}, [navigate])

	return null
}
