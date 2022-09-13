import { TechFeedback } from 'components/TechFeedback'
import { useLocation } from 'react-router-dom'

export const AssessmentDone = () => {
	const { state } = useLocation()
	return (
		<main className="container mt-4">
			<div className="row justify-content-center">
				<section className="col-md-10 col-lg-6">
					<h1>Thank you!</h1>
					<p>Your assessment has been recorded.</p>
				</section>
			</div>
			<div className="row justify-content-center">
				<footer className="col-md-10 col-lg-6">
					<hr />
					<p>
						<small>
							Submission ID:
							<br />
							<code>{state.savedAssessmentUrl}</code>
						</small>
					</p>
					<div className="alert alert-warning">
						<strong>Note:</strong> The URL above does not work. It is the unique
						submission URL of your assessment, but only accessible for
						Distribute Aid Needs Assessment administrators. You may use it to
						reference your submission.
					</div>
					<TechFeedback />
				</footer>
			</div>
		</main>
	)
}
