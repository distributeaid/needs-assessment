import { ExpiresCountdown } from 'components/ExpiresCountdown'
import { useAppConfig } from 'hooks/useAppConfig'
import { useAuth } from 'hooks/useAuth'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '/logo.svg'

export const Navbar = () => {
	const {
		manifest: { backgroundColor, shortName, name },
		homepage,
	} = useAppConfig()
	const [navbarOpen, setNavbarOpen] = useState<boolean>(false)

	const close = () => {
		setNavbarOpen(false)
	}

	const { isLoggedIn, logout } = useAuth()

	return (
		<header>
			<nav
				className="navbar navbar-expand-lg navbar-dark"
				style={{
					backgroundColor,
				}}
			>
				<div className="container-fluid">
					<Link className="navbar-brand" to="/">
						<img
							src={logo}
							alt={name}
							width="30"
							height="24"
							className="d-inline-block align-text-top me-1"
						/>
						<span>{shortName}</span>
					</Link>
					<button
						className="navbar-toggler"
						type="button"
						aria-controls="navbar"
						aria-expanded={navbarOpen}
						aria-label="Toggle navigation"
						onClick={() => {
							setNavbarOpen((open) => !open)
						}}
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div
						className={`navbar-collapse ${navbarOpen ? '' : 'collapse'}`}
						id="navbar"
					>
						<ul className="navbar-nav me-auto">
							<li className="nav-item">
								<Link className="nav-link" to="/" onClick={close}>
									Start
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/privacy" onClick={close}>
									Privacy
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/generator" onClick={close}>
									Form Generator
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/summary" onClick={close}>
									Summary Charts
								</Link>
							</li>
							{isLoggedIn && (
								<>
									<li className="nav-item">
										<Link className="nav-link" to="/correction" onClick={close}>
											Correction
										</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link" to="/export" onClick={close}>
											Export
										</Link>
									</li>
								</>
							)}
							<li className="nav-item">
								<a
									className="nav-link"
									href={homepage.toString()}
									target={'_blank'}
									onClick={close}
									rel="noreferrer"
								>
									GitHub
								</a>
							</li>
						</ul>
						<nav className="d-flex">
							<ul className="navbar-nav me-auto">
								{!isLoggedIn && (
									<li className="nav-item">
										<Link className="nav-link" to="/login" onClick={close}>
											Log in
										</Link>
									</li>
								)}
								{isLoggedIn && (
									<>
										<li className="nav-item">
											<ExpiresCountdown />
										</li>
										<li className="nav-item">
											<button
												className="btn btn-link nav-link"
												type="button"
												onClick={() => {
													close()
													logout().catch((err) =>
														console.error(`[Navbar] logout failed!`, err),
													)
												}}
											>
												Log out
											</button>
										</li>
									</>
								)}
							</ul>
						</nav>
					</div>
				</div>
			</nav>
		</header>
	)
}
