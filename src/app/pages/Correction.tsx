import { SubmissionLoader } from 'components/Correction/SubmissionLoader'

export const Correction = () => {
	return (
		<main className="container mt-4">
			<div className="row justify-content-center">
				<section className="col-md-10 col-lg-6">
					<h1>Correction</h1>
					<p>
						Load the submission by it's URL, then use the regular form process
						to provide a correction.
					</p>
					<SubmissionLoader />
				</section>
			</div>
		</main>
	)
}
