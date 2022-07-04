import { useAppConfig } from 'hooks/useAppConfig'
import { useCorrection } from 'hooks/useCorrection'
import { useStoredForm } from 'hooks/useStoredForm'
import { useState } from 'react'

export const SubmissionLoader = () => {
	const { load, submission } = useCorrection()
	const [submissionId, setSubmissionId] = useState<string>('')
	const [error, setError] = useState<Error>()
	const { formUrl } = useStoredForm()
	const { storageUrl } = useAppConfig()

	let submissionUrl: URL | undefined
	try {
		submissionUrl = new URL(
			submissionId,
			`${storageUrl.toString().replace(/\$/, '')}assessment/`,
		)
	} catch (err) {
		// Invalid URL
	}

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
						value={submissionId}
						onChange={({ target: { value } }) => setSubmissionId(value)}
					/>
					<button
						type="button"
						className="btn btn-outline-secondary"
						disabled={submissionUrl === undefined}
						onClick={() => {
							if (submissionUrl !== undefined) {
								setError(undefined)
								load(submissionUrl).catch(setError)
							}
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
