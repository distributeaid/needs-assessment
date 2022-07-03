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

export const AuthContext = createContext<{
	user?: AuthInfo
	register: (args: { email: string }) => Promise<void>
	login: (args: { email: string; token: string }) => Promise<void>
	logout: () => Promise<void>
	isLoggedIn: boolean
}>({
	register: async () => Promise.reject(new Error(`not ready!`)),
	login: async () => Promise.reject(new Error(`not ready!`)),
	logout: async () => Promise.reject(new Error(`not ready!`)),
	isLoggedIn: false,
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: FunctionComponent<{ children: ReactNode }> = ({
	children,
}) => {
	const { storageUrl } = useAppConfig()
	const [user, setUser] = useState<AuthInfo>()

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
						async () => setUser(await res.json()),
						(err) => {
							throw err
						},
					)(res)
				},
				user,
				isLoggedIn: user !== undefined,
				logout: async () => {
					setUser(undefined)
				},
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
