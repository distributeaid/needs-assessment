import { Download } from 'components/Download'
import { Login } from 'components/Login'
import { useState } from 'react'

export const Export = () => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

	if (isLoggedIn)
		return (
			<main className="container mt-4">
				<div className="row justify-content-center">
					<section className="col-md-8 col-lg-6">
						<div className="alert alert-success d-flex justify-content-between align-items-center">
							Successfully logged in.
							<button
								type="button"
								className="btn btn-outline-secondary"
								onClick={() => {
									setIsLoggedIn(false)
								}}
							>
								Log out
							</button>
						</div>
						<Download />
					</section>
				</div>
			</main>
		)

	return (
		<main className="container mt-4">
			<div className="row justify-content-center">
				<section className="col-md-8 col-lg-6">
					<Login
						onLoggedIn={() => {
							setIsLoggedIn(true)
						}}
					/>
				</section>
			</div>
		</main>
	)
}
