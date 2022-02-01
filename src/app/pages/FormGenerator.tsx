import type { ErrorObject } from 'ajv'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import addKeywords from 'ajv-keywords'
import type { Definition } from 'components/Form'
import { Form } from 'components/Form'
import { useEffect, useState } from 'react'
import formExample from 'schema/form.example.json'
import formSchema from 'schema/form.schema.json'
import questionSchema from 'schema/question.schema.json'
import sectionSchema from 'schema/section.schema.json'
import { withLocalStorage } from 'utils/withLocalStorage'

const ajv = new Ajv({
	schemas: [formSchema, sectionSchema, questionSchema],
})
addFormats(ajv)
addKeywords(ajv)

const storedFormDefinition = withLocalStorage<string>({
	key: 'formDefinition',
	defaultValue: JSON.stringify(formExample, null, 2),
})

export const FormGenerator = () => {
	const [formDefinition, setFormDefinition] = useState<string>(
		storedFormDefinition.get(),
	)
	const [formErrors, setFormErrors] = useState<(ErrorObject | Error)[]>([])
	const [formValid, setFormValid] = useState<boolean>(false)

	useEffect(() => {
		try {
			const validate = ajv.getSchema(
				`https://distributeaid.github.io/needs-assessment/form.schema.json`,
			)
			if (validate !== undefined) {
				const valid = validate(JSON.parse(formDefinition))
				setFormErrors(validate.errors ?? [])
				setFormValid(valid as boolean)
			}
		} catch (err) {
			console.error(err)
			setFormErrors([err as Error])
		}
	}, [formDefinition])

	return (
		<main className="container mt-4">
			<div className="row justify-content-center">
				<section className="col-6">
					<label htmlFor="form-definition">
						Provide the form definition below:
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
					></textarea>
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
					{formValid && (
						<button
							type="button"
							onClick={() => {
								setFormDefinition((d) => JSON.stringify(JSON.parse(d), null, 2))
							}}
						>
							format
						</button>
					)}
				</section>
				<section className="col-6">
					<p>Form will appear here:</p>
					{formValid && (
						<Form definition={JSON.parse(formDefinition) as Definition} />
					)}
				</section>
			</div>
		</main>
	)
}
