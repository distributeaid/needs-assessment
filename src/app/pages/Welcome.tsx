import { FormSelector } from 'components/FormSelector'
import { TechFeedback } from 'components/TechFeedback'
import { useAppConfig } from 'hooks/useAppConfig'
import { useStoredForm } from 'hooks/useStoredForm'
import { useNavigate } from 'react-router-dom'

export const Welcome = () => {
	const { contact } = useAppConfig()
	const { fetchError, formError, form, formUrl } = useStoredForm()
	const navigate = useNavigate()
	return (
		<main className="container mt-4">
			<div className="row justify-content-center">
				<section className="col-md-10 col-lg-6">
					<h1>Welcome</h1>
					<p>
						Thank you for filling out our regional needs assessment survey! The
						results from this survey will allow{' '}
						<a href="https://distributeaid.org/">Distribute Aid</a> to
						understand your region’s and organisation’s needs over the next
						three months so that we can advise collection groups on what to
						collect, figure out which targeted campaigns to run, and decide who
						to reach out to for in-kind donations. In short, this assessment
						helps make sure the aid you receive is better suited to your needs.
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
						If you have any questions, please contact {contact.name} at{' '}
						<a href={`mailto:${contact.email}`}>{contact.email}</a>. Thank you
						for your participation!
					</p>
					<TechFeedback />
					<p className="d-flex justify-content-end">
						<button
							type="button"
							className="btn btn-primary"
							onClick={() => {
								navigate('/instructions')
							}}
							disabled={fetchError !== undefined || formError !== undefined}
						>
							Start needs assessment
						</button>
					</p>
				</section>
			</div>
			<footer>
				<section className="row justify-content-center">
					<div className="col-md-10 col-lg-6">
						<hr />
						<FormSelector />
					</div>
				</section>
				{fetchError !== undefined && (
					<div className="row justify-content-center mt-2">
						<section className="col-md-10 col-lg-6">
							<div className="alert alert-danger">{fetchError.message}</div>
						</section>
					</div>
				)}
				{formError !== undefined && (
					<div className="row justify-content-center mt-2">
						<section className="col-md-10 col-lg-6">
							<div className="alert alert-danger">
								<p>{formError.message}</p>
								{formError.reason === 'idMismatch' && (
									<>
										<p>
											You will not be able to submit this form, because the $id
											of the fetched form <code>{form?.$id ?? ''}</code> does
											not match the ID it was loaded from{' '}
											<code>{formUrl.toString()}</code>.
										</p>
										<p>
											This can happen if you are using a wrong or outdate link
											to this application.
										</p>
										<p className="mb-0">
											Please contact {contact.name} at{' '}
											<a href={`mailto:${contact.email}`}>{contact.email}</a> to
											request an up-to-date link.
										</p>
									</>
								)}
							</div>
						</section>
					</div>
				)}
			</footer>
		</main>
	)
}
