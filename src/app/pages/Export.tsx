import { Download } from 'components/Download'
import { Login } from 'components/Login'
import { useState } from 'react'

export const Export = () => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
	const [userInfo, setUserInfo] = useState<{
		isAdmin: boolean
		email: string
	}>()

	if (isLoggedIn)
		return (
			<main className="container mt-4">
				<div className="row justify-content-center">
					<section className="col-md-10 col-lg-6">
						<div className="alert alert-success d-flex justify-content-between align-items-center">
							<span>
								Successfully logged in as <code>{userInfo?.email}</code>.
							</span>
							<button
								type="button"
								className="btn btn-outline-secondary"
								onClick={() => {
									setIsLoggedIn(false)
									setUserInfo(undefined)
								}}
							>
								Log out
							</button>
						</div>
						<Download isAdmin={userInfo?.isAdmin} />
					</section>
				</div>
			</main>
		)

	return (
		<main className="container mt-4">
			<div className="row justify-content-center">
				<section className="col-md-10 col-lg-6">
					<Login
						onLoggedIn={(userInfo) => {
							setIsLoggedIn(true)
							setUserInfo(userInfo)
						}}
					/>
				</section>
			</div>
		</main>
	)
}
