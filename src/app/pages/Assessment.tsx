import type { ErrorObject } from 'ajv'
import {
	NextIcon,
	OkIcon,
	PrevIcon,
	WarningIcon,
} from 'components/FeatherIcons'
import { FormFooter, SectionComponent } from 'components/Form'
import { useForm } from 'hooks/useForm'
import { isHidden, useResponse } from 'hooks/useResponse'
import { useValidation } from 'hooks/useValidation'
import { useEffect, useState } from 'react'
import formExample from 'schema/form.example.json'
import type { Form as FormDefinition, Section } from 'schema/types'
import { ajv, schemaUrl } from 'utils/validateSchema'
import { withLocalStorage } from 'utils/withLocalStorage'

const storedFormDefinition = withLocalStorage<string>({
	key: 'formDefinition',
	defaultValue: JSON.stringify(formExample, null, 2),
})

const validate = ajv.getSchema(schemaUrl)

export const Assessment = () => {
	const [formDefinition, setFormDefinition] = useState<string>(
		storedFormDefinition.get(),
	)
	const [, setFormErrors] = useState<(ErrorObject | Error)[]>([])
	const [, setFormValid] = useState<boolean>(false)
	const { form: parsedFormDefinition, setForm: setParsedFormDefinition } =
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
					{parsedFormDefinition !== undefined && (
						<SectionizedForm form={parsedFormDefinition} />
					)}
				</section>
			</div>
		</main>
	)
}

const SectionizedForm = ({ form }: { form: FormDefinition }) => {
	const [currentSection, setCurrentSection] = useState<string>()
	const { response } = useResponse()
	const { sectionValidation } = useValidation({ form, response })

	useEffect(() => {
		if (form === undefined) return
		setCurrentSection(form.sections[0].id)
	}, [form])

	const section =
		form.sections.find(({ id }) => id === currentSection) ?? form.sections[0]

	// Find next section
	let nextSection: Section | undefined = undefined
	let nextSectionCandidate: Section | undefined = undefined
	let nextSectionIndex = form.sections.indexOf(section)
	do {
		nextSectionCandidate = form.sections[++nextSectionIndex]
		if (nextSectionCandidate === undefined) break
		if (!isHidden(nextSectionCandidate, response))
			nextSection = nextSectionCandidate
	} while (nextSectionCandidate !== undefined && nextSection === undefined)

	// Find previous section
	let prevSection: Section | undefined = undefined
	let prevSectionCandidate: Section | undefined = undefined
	let prevSectionIndex = form.sections.indexOf(section)
	do {
		prevSectionCandidate = form.sections[--prevSectionIndex]
		if (prevSectionCandidate === undefined) break
		if (!isHidden(prevSectionCandidate, response))
			prevSection = prevSectionCandidate
	} while (prevSectionCandidate !== undefined && prevSection === undefined)

	return (
		<form
			className="form"
			onSubmit={(event) => {
				event.preventDefault()
			}}
		>
			<h2 className="d-flex justify-content-end justify-content-between">
				{section.title}
				{sectionValidation[section.id] ? (
					<abbr title="Section is valid.">
						<OkIcon />
					</abbr>
				) : (
					<abbr title="Section is invalid.">
						<WarningIcon />
					</abbr>
				)}
			</h2>
			<SectionComponent form={form} section={section} />
			<footer className="mb-4">
				<div className="d-flex justify-content-between mt-4 mb-4">
					{prevSection !== undefined && (
						<button
							type="button"
							className="btn btn-outline-secondary d-flex align-items-center"
							onClick={() => {
								if (prevSection !== undefined) setCurrentSection(prevSection.id)
							}}
						>
							<PrevIcon />
							<span>{prevSection.title}</span>
						</button>
					)}
					{prevSection === undefined && <span></span>}
					{nextSection !== undefined && (
						<button
							type="button"
							className="btn btn-primary  d-flex align-items-center"
							disabled={!sectionValidation[section.id]}
							onClick={() => {
								if (nextSection !== undefined) setCurrentSection(nextSection.id)
							}}
						>
							<span>{nextSection.title}</span>
							<NextIcon />
						</button>
					)}
				</div>
				{nextSection === undefined && (
					<>
						<hr />
						<FormFooter form={form} />
					</>
				)}
			</footer>
		</form>
	)
}
