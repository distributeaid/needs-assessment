import { useLocation } from 'react-router-dom'

export const AssessmentDone = () => {
	const { state } = useLocation()
	return (
		<main className="container mt-4">
			<div className="row justify-content-center">
				<section className="col-md-8 col-lg-6">
					<h1>Thank you!</h1>
					<p>Your assessment has been recorded.</p>
				</section>
			</div>
			<div className="row justify-content-center">
				<footer className="col-md-8 col-lg-6">
					<hr />
					<p>
						<small>
							Submission ID:
							<br />
							<code>{(state as any).savedAssessmentUrl}</code>
						</small>
					</p>
				</footer>
			</div>
		</main>
	)
}
