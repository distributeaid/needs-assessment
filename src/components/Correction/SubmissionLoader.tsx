import { useCorrection } from 'hooks/useCorrection'
import { useStoredForm } from 'hooks/useStoredForm'
import { useState } from 'react'
import { isValidUrl } from 'utils/isValidUrl'

export const SubmissionLoader = () => {
	const [submissionUrl, setSubmissionUrl] = useState<string>('')
	const [error, setError] = useState<Error>()
	const { load, submission } = useCorrection()
	const { formUrl } = useStoredForm()

	return (
		<>
			<form
				className="form"
				onSubmit={(event) => {
					event.preventDefault()
				}}
			>
				<div className="input-group">
					<span className="input-group-text" id="submission-url-addon">
						Submission ID
					</span>
					<input
						type="url"
						className="form-control"
						placeholder="The submission to load"
						aria-describedby="submission-url-addon"
						value={submissionUrl}
						onChange={({ target: { value } }) => setSubmissionUrl(value)}
					/>
					<button
						type="button"
						className="btn btn-outline-secondary"
						disabled={!isValidUrl(submissionUrl)}
						onClick={() => {
							setError(undefined)
							load(new URL(submissionUrl)).catch(setError)
						}}
					>
						load
					</button>
				</div>
			</form>
			{error && <div className="alert alert-danger">{error.message}</div>}
			{submission !== undefined && (
				<section className="mt-4">
					<h2>Submission</h2>
					<dl>
						<dt>ID</dt>
						<dd>
							<code>{submission.$id.toString()}</code>
						</dd>
						<dt>Version</dt>
						<dd>{submission.version}</dd>
						<dt>Form</dt>
						<dd>
							<code>{submission.form.toString()}</code>
						</dd>
					</dl>
					<h2>Form</h2>
					<dl>
						<dt>Form</dt>
						<dd>
							<code>{formUrl.toString()}</code>
						</dd>
					</dl>
				</section>
			)}
		</>
	)
}
