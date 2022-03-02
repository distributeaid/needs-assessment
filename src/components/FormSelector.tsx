import { useStoredForm } from 'hooks/useStoredForm'
import { useState } from 'react'

const isValidUrl = (url: string): boolean => {
	try {
		new URL(url)
		return true
	} catch {
		return false
	}
}

export const FormSelector = () => {
	const { formUrl, setFormUrl } = useStoredForm()
	const [newFormUrl, setNewFormUrl] = useState<string>(formUrl.toString())

	return (
		<form
			className="form"
			onSubmit={(event) => {
				event.preventDefault()
			}}
		>
			<div className="input-group">
				<span className="input-group-text" id="form-url-addon">
					Form ID
				</span>
				<input
					type="url"
					className="form-control"
					placeholder="The form URL to use"
					aria-describedby="form-url-addon"
					value={newFormUrl}
					onChange={({ target: { value } }) => setNewFormUrl(value)}
				/>
				<button
					type="button"
					className="btn btn-outline-secondary"
					disabled={
						newFormUrl !== formUrl.toString() && !isValidUrl(newFormUrl)
					}
					onClick={() => {
						setFormUrl(new URL(newFormUrl))
					}}
				>
					change
				</button>
			</div>
		</form>
	)
}
