import { Link } from 'react-router-dom'

export const Instructions = () => (
	<main className="container mt-4">
		<div className="row justify-content-center">
			<section className="col-md-10 col-lg-6">
				<h1>Instructions</h1>
				<ol>
					<li>
						Please fill out each question to the best of your ability, and
						submit the survey before the beginning of the quarter you are
						reporting your needs for.
					</li>
					<li>
						Please only consider your organisation's total needs for the quarter
						in question that you don't already have covered.
					</li>
					<li>
						It is okay to use estimates, and we understand that conditions &amp;
						needs change! We are only looking for a rough understanding of your
						needs.
					</li>
					<li>
						If your organisation operates in multiple regions, please fill out
						the survey multiple times. Please submit it once per region that you
						operate in, so we can keep the needs data separate.
					</li>
					<li>
						If you want to submit an assessment for a different quarter, please
						create a separate submission.
					</li>
				</ol>

				<p className="d-flex justify-content-end">
					<Link className="btn btn-primary" to="/assessment">
						Continue
					</Link>
				</p>
			</section>
		</div>
	</main>
)
