import { formatDistanceToNow } from 'date-fns'
import { useAuth } from 'hooks/useAuth'
import { useEffect, useState } from 'react'

const formatExpires = (expires: Date): string =>
	formatDistanceToNow(expires, { includeSeconds: true })

export const ExpiresCountdown = () => {
	const { expires, refresh } = useAuth()

	const [distance, setDistance] = useState<string>(formatExpires(expires))
	const expired = expires.getTime() < Date.now()
	const showWarning = expires.getTime() - Date.now() < 60 * 1000

	useEffect(() => {
		const i = setInterval(() => {
			setDistance(formatExpires(expires))
		}, 1000)
		return () => {
			clearInterval(i)
		}
	}, [expires])

	if (!showWarning) return null

	if (expired)
		return <span className="btn btn-link nav-link">Cookie expired</span>

	return (
		<button
			className="btn btn-link nav-link"
			type="button"
			onClick={refresh}
			title="Click here to refresh your credentials."
		>
			<small>
				Auto-logout in <time dateTime={expires.toISOString()}>{distance}</time>
			</small>
		</button>
	)
}
