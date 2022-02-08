import { Link } from 'react-router-dom'

export const Welcome = () => (
	<main className="container mt-4">
		<div className="row justify-content-center">
			<section className="col-md-6">
				<h1>Welcome</h1>
				<p>
					Thank you for filling out our regional needs assessment survey! The
					results from this survey will allow{' '}
					<a href="https://distributeaid.org/">Distribute Aid</a> to understand
					your region’s and organisation’s needs over the next three months so
					that we can advise collection groups on what to collect, figure out
					which targeted campaigns to run, and decide who to reach out to for
					in-kind donations. In short, this assessment helps make sure the aid
					you receive is better suited to your needs.
				</p>
				<p>
					We will release a public, interactive summary of the data like{' '}
					<a href="https://prezi.com/i/f4hqrn4oq6v8/q2-need-assessment-report-2021/">
						the one here
					</a>
					. The public version will show the needs for each region, but
					individual group responses will be anonymized to protect privacy.
				</p>
				<p>
					If you have any questions, please contact Nicole Tingle at{' '}
					<a href="mailto:needs@distributeaid.org">needs@distributeaid.org</a>.
					Thank you for your participation!
				</p>
				<p className="d-flex justify-content-end">
					<Link className="btn btn-primary" to="/instructions">
						Start needs assessment
					</Link>
				</p>
			</section>
		</div>
	</main>
)
