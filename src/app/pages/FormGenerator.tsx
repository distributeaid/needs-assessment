import type { ErrorObject } from 'ajv'
import { Collapsable } from 'components/Collapsable'
import { OkIcon, WarningIcon } from 'components/FeatherIcons'
import { Form } from 'components/Form'
import { ResponseTable } from 'components/ResponseTable'
import { useForm } from 'hooks/useForm'
import { useResponse } from 'hooks/useResponse'
import { useValidation } from 'hooks/useValidation'
import { useEffect, useState } from 'react'
import formExample from 'schema/form.example.json'
import type { Form as FormDefinition } from 'schema/types'
import { ajv, schemaUrl } from 'utils/validateSchema'
import { withLocalStorage } from 'utils/withLocalStorage'

const storedFormDefinition = withLocalStorage<string>({
	key: 'formDefinition',
	defaultValue: JSON.stringify(formExample, null, 2),
})

const validate = ajv.getSchema(schemaUrl)

export const FormGenerator = () => {
	const [formDefinition, setFormDefinition] = useState<string>(
		storedFormDefinition.get(),
	)
	const [formErrors, setFormErrors] = useState<(ErrorObject | Error)[]>([])
	const [formValid, setFormValid] = useState<boolean>(false)
	const { form: parseFormDefinition, setForm: setParsedFormDefinition } =
		useForm()

	useEffect(() => {
		try {
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
	}, [formDefinition, setParsedFormDefinition])

	return (
		<main className="container mt-4">
			<div className="row justify-content-center">
				<section className="col-md-6">
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
				<section className="col-md-6">
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
			<Collapsable title={<>Response JSON</>} id="response">
				<pre>{JSON.stringify(response, null, 2)}</pre>
			</Collapsable>
			<Collapsable
				title={
					<>
						Response validation
						{valid ? (
							<abbr title="Response is valid.">
								<OkIcon />
							</abbr>
						) : (
							<abbr title="Response is invalid.">
								<WarningIcon />
							</abbr>
						)}
					</>
				}
				id="validation"
			>
				<h3>Response validation:</h3>
				<pre>{JSON.stringify(validation, null, 2)}</pre>
				<h3>Sections validation:</h3>
				<pre>{JSON.stringify(sectionValidation, null, 2)}</pre>
			</Collapsable>
			<Collapsable title={<>Response table</>} id="response-table">
				<ResponseTable />
			</Collapsable>
		</>
	)
}
