import { useAuth } from 'hooks/useAuth'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const AutoLogout = () => {
	const { expires, logout, isLoggedIn, refresh, cookieLifetimeMs } = useAuth()
	const navigate = useNavigate()

	// Auto-logout in case cookie expires
	useEffect(() => {
		if (!isLoggedIn) return
		const i = setInterval(() => {
			const expired = expires.getTime() < Date.now()
			if (expired) {
				console.warn(`[auto-logout]`, `Cookie expired, logging out.`)
				logout(false).catch(console.error)
				navigate('/login', { state: { autoLogout: true } })
			}
		}, 1000)

		return () => {
			clearInterval(i)
		}
	}, [expires, isLoggedIn, logout, navigate])

	// Refresh cookie if user clicks
	useEffect(() => {
		if (!isLoggedIn) return

		const onClick = () => {
			if (expires.getTime() - Date.now() < cookieLifetimeMs * 0.05) {
				console.log(`[auto-logout]`, `Refreshing cookie`)
				refresh().catch(console.error)
			}
		}
		console.log(`[auto-logout]`, `Registering click listener`)
		document.documentElement.addEventListener('click', onClick)

		return () => {
			console.log(`[auto-logout]`, `Un-registering click listener`)
			document.documentElement.removeEventListener('click', onClick)
		}
	}, [refresh, isLoggedIn, expires, cookieLifetimeMs])

	return null
}
