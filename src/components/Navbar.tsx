import { useAppConfig } from 'hooks/useAppConfig'
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
								<Link className="nav-link" to="/export" onClick={close}>
									Export
								</Link>
							</li>

							<li className="nav-item">
								<a
									className="nav-link"
									href={homepage.toString()}
									target={'_blank'}
									onClick={close}
								>
									GitHub
								</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</header>
	)
}
