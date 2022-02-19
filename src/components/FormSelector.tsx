import { useStoredForm } from 'hooks/useStoredForm'
import { useState } from 'react'

const ulidExclusiveRegEx = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/

export const FormSelector = () => {
	const { formId, setFormId } = useStoredForm()
	const [newFormId, setNewFormId] = useState<string>('')

	return (
		<form
			className="form"
			onSubmit={(event) => {
				event.preventDefault()
			}}
		>
			<div className="input-group mb-3">
				<span className="input-group-text" id="form-id-addon">
					Form ID
				</span>
				<input
					type="text"
					className="form-control"
					placeholder="The form ID to use"
					aria-describedby="form-id-addon"
					value={newFormId}
					onChange={({ target: { value } }) => setNewFormId(value)}
				/>
				<button
					type="button"
					className="btn btn-outline-secondary"
					disabled={newFormId !== formId && !ulidExclusiveRegEx.test(newFormId)}
					onClick={() => {
						setFormId(newFormId)
					}}
				>
					change
				</button>
			</div>
		</form>
	)
}
