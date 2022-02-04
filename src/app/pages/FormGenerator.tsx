import type { ErrorObject } from 'ajv'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import addKeywords from 'ajv-keywords'
import { Form } from 'components/Form'
import { useResponse } from 'hooks/useResponse'
import { useValidation } from 'hooks/useValidation'
import { useEffect, useState } from 'react'
import formExample from 'schema/form.example.json'
import formSchema from 'schema/form.schema.json'
import questionSchema from 'schema/question.schema.json'
import sectionSchema from 'schema/section.schema.json'
import type { Form as FormDefinition } from 'schema/types'
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

const schemaUrl = `https://distributeaid.github.io/needs-assessment/form.schema.json`

export const FormGenerator = () => {
	const [formDefinition, setFormDefinition] = useState<string>(
		storedFormDefinition.get(),
	)
	const [formErrors, setFormErrors] = useState<(ErrorObject | Error)[]>([])
	const [formValid, setFormValid] = useState<boolean>(false)
	const [parseFormDefinition, setParsedFormDefinition] =
		useState<FormDefinition>()

	useEffect(() => {
		try {
			const validate = ajv.getSchema(schemaUrl)
			if (validate !== undefined) {
				const valid = validate(JSON.parse(formDefinition))
				setFormErrors(validate.errors ?? [])
				setFormValid(valid as boolean)
				if (valid === true) {
					try {
						setParsedFormDefinition(
							JSON.parse(formDefinition) as FormDefinition,
						)
					} catch {
						console.error(`form definition is not valid JSON`)
					}
				}
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
					<h2>Define the form here:</h2>
					<label htmlFor="form-definition">
						Provide the form definition below.
						<br />
						The definition needs to follow the{' '}
						<a href={schemaUrl} target={'_blank'} rel="nofollow noreferrer">
							schema
						</a>
						.
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
					{parseFormDefinition !== undefined && (
						<>
							<hr />
							<Response form={parseFormDefinition} />
						</>
					)}
				</section>
				<section className="col-6">
					<h2>Form will appear here:</h2>
					{parseFormDefinition !== undefined && (
						<Form form={parseFormDefinition} />
					)}
				</section>
			</div>
		</main>
	)
}

const Response = ({ form }: { form: FormDefinition }) => {
	const { response } = useResponse()
	const { valid, validation, sectionValidation } = useValidation({
		form,
		response,
	})
	return (
		<>
			<h2>Response will appear here:</h2>
			<pre>{JSON.stringify(response, null, 2)}</pre>
			<h2>{valid ? 'Response is valid' : 'Response is NOT valid'}</h2>
			<pre>{JSON.stringify(validation, null, 2)}</pre>
			<h3>Sections valid:</h3>
			<pre>{JSON.stringify(sectionValidation, null, 2)}</pre>
		</>
	)
}
