import { useAppConfig } from 'hooks/useAppConfig'
import { FocusEvent, useState } from 'react'
import { handleResponse } from 'utils/handleResponse'

export const Login = ({
	onLoggedIn,
}: {
	onLoggedIn: (userInfo: { isAdmin: boolean; email: string }) => void
}) => {
	const { storageUrl } = useAppConfig()
	const [email, setEmail] = useState<string>('')
	const [token, setToken] = useState<string>('')
	const [tokenRequested, setTokenRequested] = useState<boolean>(false)
	const [error, setError] = useState<Error>()

	const emailIsValid = /.+@.+\..+/.test(email)
	const tokenIsValid = /^[0-9]{6}$/.test(token)

	return (
		<>
			<h1>Login</h1>
			<form
				className="form"
				onSubmit={(event) => {
					event.preventDefault()
				}}
			>
				<div className="mb-3">
					<label htmlFor="email" className="form-label">
						Please provide your email address
					</label>
					<input
						type="email"
						className="form-control"
						id="email"
						placeholder="alex@example.com"
						autoComplete="email"
						value={email}
						onChange={({ target: { value } }) => setEmail(value)}
					/>
				</div>
				<div className="mb-3 d-flex justify-content-start flex-row-reverse">
					<button
						type="button"
						className="btn btn-primary"
						disabled={!emailIsValid}
						onClick={() => {
							setError(undefined)
							fetch(new URL('/register', storageUrl).toString(), {
								method: 'POST',
								body: JSON.stringify({ email }),
								mode: 'cors',
								headers: {
									'content-type': 'application/json',
								},
							})
								.then((res) => {
									if (res.ok) {
										return setTokenRequested(true)
									}
									setError(new Error(`Token request failed: ${res.status}`))
								})
								.catch(setError)
						}}
					>
						request token
					</button>
					<button
						type="button"
						className="btn btn-outline-secondary me-2"
						disabled={!emailIsValid}
						onClick={() => setTokenRequested(true)}
					>
						I have a token
					</button>
				</div>
				{tokenRequested && (
					<>
						<div className="mb-3">
							<label htmlFor="token" className="form-label">
								Enter the token we sent to your email
							</label>
							<input
								type="number"
								className="form-control"
								id="token"
								placeholder="123456"
								pattern="^[0-9]{6}$"
								value={token}
								onChange={({ target: { value } }) => setToken(value)}
								onWheel={(e) => {
									;(e as unknown as FocusEvent<HTMLInputElement>).target.blur()
								}}
							/>
						</div>
						<div className="mb-3 d-flex justify-content-end">
							<button
								type="button"
								className="btn btn-primary"
								disabled={!emailIsValid || !tokenIsValid}
								onClick={() => {
									setError(undefined)
									fetch(new URL('/login', storageUrl).toString(), {
										method: 'POST',
										body: JSON.stringify({ email, token }),
										mode: 'cors',
										credentials: 'include',
										headers: {
											'content-type': 'application/json',
										},
									})
										.then(
											handleResponse(
												async (res) => onLoggedIn(await res.json()),
												setError,
											),
										)
										.catch(setError)
								}}
							>
								log in
							</button>
						</div>
					</>
				)}
			</form>
			{error && <div className="alert alert-danger">{error.message}</div>}
		</>
	)
}
