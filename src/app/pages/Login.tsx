import { useAuth } from 'hooks/useAuth'
import { FocusEvent, useState } from 'react'

export const Login = () => {
	const [email, setEmail] = useState<string>('')
	const [token, setToken] = useState<string>('')
	const [tokenRequested, setTokenRequested] = useState<boolean>(false)
	const [error, setError] = useState<Error>()

	const emailIsValid = /.+@.+\..+/.test(email)
	const tokenIsValid = /^[0-9]{6}$/.test(token)

	const { isLoggedIn, login, register, user, logout } = useAuth()

	if (isLoggedIn)
		return (
			<main className="container mt-4">
				<div className="row justify-content-center">
					<section className="col-md-10 col-lg-6">
						<div className="alert alert-success d-flex justify-content-between align-items-center">
							<span>
								Successfully logged in as <code>{user?.email}</code>.
							</span>
							<button
								type="button"
								className="btn btn-outline-secondary"
								onClick={() => {
									setError(undefined)
									logout().catch(setError)
								}}
							>
								Log out
							</button>
						</div>
					</section>
				</div>
			</main>
		)

	return (
		<main className="container mt-4">
			<div className="row justify-content-center">
				<section className="col-md-10 col-lg-6">
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
									setTokenRequested(true)
									register({ email }).catch((err) => {
										setError(err)
										setTokenRequested(false)
									})
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
											;(
												e as unknown as FocusEvent<HTMLInputElement>
											).target.blur()
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
											login({ email, token }).catch(setError)
										}}
									>
										log in
									</button>
								</div>
							</>
						)}
					</form>
					{error && <div className="alert alert-danger">{error.message}</div>}
				</section>
			</div>
		</main>
	)
}
