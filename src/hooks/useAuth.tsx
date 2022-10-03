import { useAppConfig } from 'hooks/useAppConfig'
import {
	createContext,
	FunctionComponent,
	ReactNode,
	useContext,
	useState,
} from 'react'
import { handleResponse } from 'utils/handleResponse'

type AuthInfo = { isAdmin: boolean; email: string }

const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000)

export const AuthContext = createContext<{
	user?: AuthInfo
	register: (args: { email: string }) => Promise<void>
	login: (args: { email: string; token: string }) => Promise<void>
	logout: (deleteCookie?: boolean) => Promise<void>
	refresh: () => Promise<void>
	isLoggedIn: boolean
	expires: Date
	cookieLifetimeMs: number
}>({
	register: async () => Promise.reject(new Error(`not ready!`)),
	login: async () => Promise.reject(new Error(`not ready!`)),
	logout: async () => Promise.reject(new Error(`not ready!`)),
	refresh: async () => Promise.reject(new Error(`not ready!`)),
	isLoggedIn: false,
	expires: expiredDate,
	cookieLifetimeMs: 0,
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: FunctionComponent<{ children: ReactNode }> = ({
	children,
}) => {
	const { storageUrl } = useAppConfig()
	const [user, setUser] = useState<AuthInfo>()
	const [expires, setExpires] = useState<Date>(expiredDate)
	const [cookieLifetimeSeconds, setCookieLifetimeSeconds] = useState<number>(0)

	return (
		<AuthContext.Provider
			value={{
				register: async ({ email }: { email: string }) => {
					const res = await fetch(new URL('/register', storageUrl).toString(), {
						method: 'POST',
						body: JSON.stringify({ email }),
						mode: 'cors',
						headers: {
							'content-type': 'application/json',
						},
					})
					await handleResponse(
						() => undefined,
						(err) => {
							throw err
						},
					)(res)
				},
				login: async ({ email, token }: { email: string; token: string }) => {
					const res = await fetch(new URL('/login', storageUrl).toString(), {
						method: 'POST',
						body: JSON.stringify({ email, token }),
						mode: 'cors',
						credentials: 'include',
						headers: {
							'content-type': 'application/json',
						},
					})
					await handleResponse(
						async (res) => {
							const expires = new Date(
								res.headers.get('expires') ?? expiredDate,
							)
							setExpires(expires)
							setCookieLifetimeSeconds(expires.getTime() - Date.now())
							setUser(await res.json())
						},
						(err) => {
							throw err
						},
					)(res)
				},
				refresh: async () => {
					const res = await fetch(new URL('/cookie', storageUrl).toString(), {
						method: 'POST',
						mode: 'cors',
						credentials: 'include',
					})
					await handleResponse(
						async (res) => {
							setExpires(new Date(res.headers.get('expires') ?? expiredDate))
						},
						(err) => {
							throw err
						},
					)(res)
				},
				user,
				isLoggedIn: user !== undefined,
				logout: async (deleteCookie = true) => {
					setUser(undefined)
					if (deleteCookie)
						fetch(new URL('/cookie', storageUrl).toString(), {
							method: 'DELETE',
							mode: 'cors',
							credentials: 'include',
						}).catch(console.error)
				},
				expires,
				cookieLifetimeMs: cookieLifetimeSeconds,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
