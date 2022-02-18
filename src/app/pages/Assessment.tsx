import {
	NextIcon,
	OkIcon,
	PrevIcon,
	WarningIcon,
} from 'components/FeatherIcons'
import { FormFooter, SectionComponent } from 'components/Form'
import { useAppConfig } from 'hooks/useAppConfig'
import { isHidden, useResponse } from 'hooks/useResponse'
import { useStoredForm } from 'hooks/useStoredForm'
import { useValidation } from 'hooks/useValidation'
import { useEffect, useState } from 'react'
import type { Form as FormDefinition, Section } from 'schema/types'

export const Assessment = () => {
	const { formUrl } = useAppConfig()
	const form = useStoredForm({ formUrl })

	return (
		<main className="container mt-4">
			<div className="row justify-content-center">
				{form !== undefined && <SectionizedForm form={form} />}
			</div>
		</main>
	)
}

const FormNavigation = ({
	form,
	navigate,
}: {
	form: FormDefinition
	navigate: (id: string) => void
}) => {
	const { response } = useResponse()
	const { sectionValidation } = useValidation({ response, form })
	return (
		<nav className="d-flex flex-column align-items-start col-md-4 mb-4">
			{form.sections.map((section) => {
				if (isHidden(section, response)) return null
				return (
					<div>
						{sectionValidation[section.id] ? (
							<abbr title="Section is valid.">
								<OkIcon />
							</abbr>
						) : (
							<abbr title="Section is invalid.">
								<WarningIcon />
							</abbr>
						)}{' '}
						<button
							className="btn btn-link"
							onClick={() => navigate(section.id)}
						>
							{section.title}
						</button>
					</div>
				)
			})}
		</nav>
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
		<>
			<FormNavigation
				form={form}
				navigate={(id) => {
					setCurrentSection(id)
				}}
			/>
			<section className="col-md-6">
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
										if (prevSection !== undefined)
											setCurrentSection(prevSection.id)
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
										if (nextSection !== undefined)
											setCurrentSection(nextSection.id)
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
			</section>
		</>
	)
}
