import { useResponse } from 'hooks/useResponse'
import { useValidation } from 'hooks/useValidation'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Form as FormDefinition } from 'schema/types'

export const FormFooter = ({
	form,
	onSubmit,
}: {
	form: FormDefinition
	onSubmit: () => void
}) => {
	const { response, update } = useResponse()
	const { valid } = useValidation({ response, form })
	const [consent, setDataUsageConsent] = useState<boolean>(false)

	return (
		<>
			<div>
				<div className="form-check">
					<input
						className="form-check-input"
						type="checkbox"
						value="yes"
						id="data-usage-consent"
						onChange={({ target: { checked } }) => {
							setDataUsageConsent(checked)
						}}
						checked={consent}
					/>
					<label className="form-check-label" htmlFor="data-usage-consent">
						By continuing with this form and submitting it, you agree that you
						understand and consent to how{' '}
						<Link to="/privacy" target={'_blank'} rel="noreferrer">
							we will use your data
						</Link>{' '}
						and who we will share it with.
					</label>
				</div>
			</div>
			<div className="d-flex justify-content-end justify-content-between mt-4">
				<button
					type="button"
					className="btn btn-outline-danger"
					onClick={() => {
						if (window.confirm(`Really clear the form?`)) update({})
					}}
				>
					clear form
				</button>
				<button
					type="button"
					className="btn btn-primary"
					disabled={!valid || !consent}
					onClick={() => {
						onSubmit()
					}}
				>
					submit
				</button>
			</div>
		</>
	)
}
