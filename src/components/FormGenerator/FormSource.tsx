import type { ErrorObject } from 'ajv'
import { useAppConfig } from 'hooks/useAppConfig'
import { useForm } from 'hooks/useForm'
import { useFormValidator } from 'hooks/useFormValidator'
import { useEffect, useState } from 'react'
import type { Form as FormDefinition } from 'schema/types'
import { parseJSON } from 'utils/parseJSON'
import { withLocalStorage } from 'utils/withLocalStorage'

const storedFormDefinition = withLocalStorage<string>({
	key: 'formDefinition',
})

export const FormSource = () => {
	const [formDefinition, setFormDefinition] = useState<string>(
		storedFormDefinition.get() ?? '{}',
	)
	const [formErrors, setFormErrors] = useState<(ErrorObject | Error)[]>([])
	const [formValid, setFormValid] = useState<boolean>(false)
	const { form, setForm: setParsedFormDefinition } = useForm()
	const { schemaUrl } = useAppConfig()
	const validateFn = useFormValidator()

	useEffect(() => {
		if (validateFn === undefined) return
		try {
			const valid = validateFn(parseJSON(formDefinition))
			setFormErrors(validateFn.errors ?? [])
			setFormValid(valid as boolean)
			if (valid === true) {
				setParsedFormDefinition(parseJSON(formDefinition) as FormDefinition)
			}
		} catch (err) {
			console.error(err)
			setFormErrors([err as Error])
		}
	}, [formDefinition, setParsedFormDefinition, validateFn])

	useEffect(() => {
		if (form === undefined) return
		setFormDefinition(JSON.stringify(form, null, 2))
	}, [form])

	return (
		<>
			<label htmlFor="form-definition">
				Provide the form definition below.
			</label>
			<textarea
				className="form-control"
				id="form-definition"
				value={formDefinition}
				onChange={({ target: { value } }) => {
					setFormValid(false)
					setFormDefinition(value)
					storedFormDefinition.set(value)
				}}
				onBlur={() => {
					try {
						setFormDefinition((d) => JSON.stringify(parseJSON(d), null, 2))
					} catch {
						// Pass
					}
				}}
			/>
			<p>
				The definition needs to follow the{' '}
				<a
					href={schemaUrl.toString()}
					target={'_blank'}
					rel="nofollow noreferrer"
				>
					schema
				</a>
				.
			</p>
			{formErrors.length > 0 && (
				<ul>
					{formErrors.map((error, i) => (
						<li key={i}>
							<strong>{error.message}</strong>
							<br />
							{JSON.stringify(error)}
						</li>
					))}
				</ul>
			)}
			{formValid && <p>Form definition is valid.</p>}
		</>
	)
}
