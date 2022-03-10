import { Collapsable } from 'components/Collapsable'
import { OkIcon, WarningIcon } from 'components/FeatherIcons'
import { Form } from 'components/Form'
import { FormEditor } from 'components/FormGenerator/FormEditor'
import { FormSource } from 'components/FormGenerator/FormSource'
import { ResponseTable } from 'components/ResponseTable'
import { useAppConfig } from 'hooks/useAppConfig'
import { useForm } from 'hooks/useForm'
import { useFormValidator } from 'hooks/useFormValidator'
import { useResponse } from 'hooks/useResponse'
import { useValidation } from 'hooks/useValidation'
import { useEffect, useState } from 'react'
import type { Form as FormDefinition } from 'schema/types'
import { parseJSON } from 'utils/parseJSON'
import { withLocalStorage } from 'utils/withLocalStorage'

const storedFormDefinition = withLocalStorage<string>({
	key: 'formDefinition',
})

export const FormGenerator = () => {
	const [formDefinition] = useState<string>(storedFormDefinition.get() ?? '{}')
	const [formValid, setFormValid] = useState<boolean>(false)
	const { form: parseFormDefinition, setForm: setParsedFormDefinition } =
		useForm()
	const { storageUrl } = useAppConfig()
	const validateFn = useFormValidator()
	const [savedFormUrl, setSavedFormUrl] = useState<URL>()

	useEffect(() => {
		if (validateFn === undefined) return
		try {
			const valid = validateFn(parseJSON(formDefinition))
			setFormValid(valid as boolean)
			if (valid === true) {
				setParsedFormDefinition(parseJSON(formDefinition) as FormDefinition)
			}
		} catch (err) {
			console.error(err)
		}
	}, [formDefinition, setParsedFormDefinition, validateFn])

	return (
		<main className="container mt-4">
			<div className="row justify-content-center">
				<section className="col-md-10 col-lg-6">
					<header className="d-flex justify-content-between">
						<h2>Define the form here:</h2>
						<button
							type="button"
							className="btn btn-outline-primary"
							disabled={!formValid}
							onClick={() => {
								fetch(new URL('/form', storageUrl).toString(), {
									method: 'POST',
									mode: 'cors',
									headers: {
										'content-type': 'application/json',
									},
									body: JSON.stringify(parseFormDefinition),
								})
									.then((res) => {
										setSavedFormUrl(
											new URL(res.headers.get('Location') as string),
										)
									})
									.catch(console.error)
							}}
						>
							save
						</button>
					</header>
					{savedFormUrl && (
						<div className="alert alert-success mt-2">
							Form saved:
							<br />
							<a href={savedFormUrl.toString()}>{savedFormUrl.toString()}</a>
						</div>
					)}
					<hr />
					<Collapsable title={<>Editor (work in progress)</>} id="formeditor">
						<FormEditor />
					</Collapsable>
					<Collapsable title={<>JSON form definition</>} id="formsource">
						<FormSource />
					</Collapsable>
				</section>
				<section className="col-md-10 col-lg-6">
					<h2>Form will appear here:</h2>
					{parseFormDefinition !== undefined && (
						<Form
							form={parseFormDefinition}
							onSubmit={() => {
								// Pass.
							}}
						/>
					)}
					<hr />
					<h2>Response:</h2>
					{parseFormDefinition !== undefined && (
						<>
							<hr />
							<Response form={parseFormDefinition} />
						</>
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
