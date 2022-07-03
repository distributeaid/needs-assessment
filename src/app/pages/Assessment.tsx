import {
	NextIcon,
	OkIcon,
	PrevIcon,
	WarningIcon,
} from 'components/FeatherIcons'
import { SectionComponent } from 'components/Form/Section'
import { FormFooter } from 'components/FormFooter'
import { FormNavigation } from 'components/FormNavigation'
import { useAppConfig } from 'hooks/useAppConfig'
import { useCorrection } from 'hooks/useCorrection'
import { isHidden, useResponse } from 'hooks/useResponse'
import { useStoredForm } from 'hooks/useStoredForm'
import { useValidation } from 'hooks/useValidation'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Section, StoredForm } from 'schema/types'
import { handleResponse } from 'utils/handleResponse'

export const Assessment = () => {
	const { form, fetchError: error } = useStoredForm()
	const { submission } = useCorrection()

	return (
		<main className="container mt-4">
			{submission !== undefined && (
				<header className="row">
					<section className="col-md-12 col-lg-10 offset-lg-1">
						<div className="alert alert-warning">
							<strong>Correction mode!</strong> You are in the process of
							providing a correction to the submission{' '}
							<code>{submission.$id.toString()}</code>!
						</div>
					</section>
				</header>
			)}
			<div className="row justify-content-center">
				{form !== undefined && <SectionizedForm form={form} />}
			</div>
			{error !== undefined && (
				<div className="row">
					<section className="col-md-8 col-lg-6 offset-lg-1">
						<div className="alert alert-danger">{error.message}</div>
					</section>
				</div>
			)}
		</main>
	)
}

const SectionizedForm = ({ form }: { form: StoredForm }) => {
	const [currentSection, setCurrentSection] = useState<string>()
	const { response } = useResponse()
	const { sectionValidation } = useValidation({ form, response })
	const { storageUrl } = useAppConfig()
	const [savedAssessmentUrl, setSavedAssessmentUrl] = useState<URL>()
	const navigate = useNavigate()
	const [error, setError] = useState<Error>()
	const { issues } = useAppConfig()
	const { submission } = useCorrection()

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
			<section className="col-md-8 col-lg-6">
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
										if (prevSection !== undefined) {
											window.scrollTo({
												top: 0,
												behavior: 'smooth',
											})
											setCurrentSection(prevSection.id)
										}
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
										if (nextSection !== undefined) {
											window.scrollTo({
												top: 0,
												behavior: 'smooth',
											})
											setCurrentSection(nextSection.id)
										}
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
								<FormFooter
									form={form}
									onSubmit={() => {
										setError(undefined)

										let fetchPromise: ReturnType<typeof fetch>

										if (submission !== undefined) {
											// Correction
											fetchPromise = fetch(
												new URL('./correction', storageUrl).toString(),
												{
													method: 'POST',
													mode: 'cors',
													credentials: 'include',
													headers: {
														'content-type': 'application/json',
														'if-match': `${submission.version}`,
													},
													body: JSON.stringify({
														submission: submission?.$id.toString(),
														form: form.$id,
														response,
													}),
												},
											)
										} else {
											fetchPromise = fetch(
												new URL('./assessment', storageUrl).toString(),
												{
													method: 'POST',
													mode: 'cors',
													headers: {
														'content-type': 'application/json',
													},
													body: JSON.stringify({
														form: form.$id,
														response,
													}),
												},
											)
										}
										fetchPromise
											.then(
												handleResponse((res) => {
													try {
														setSavedAssessmentUrl(
															new URL(res.headers.get('Location') as string),
														)
														navigate('/assessment/done', {
															state: {
																savedAssessmentUrl: res.headers.get(
																	'Location',
																) as string,
															},
														})
													} catch (error) {
														setError(error as Error)
													}
												}, setError),
											)
											.catch(setError)
									}}
								/>
								{error && (
									<div className="alert alert-danger mt-4">
										{error.message}
										<br />
										An unexpected technical error has occured. This is a bug,
										please consider{' '}
										<a
											href={issues.toString()}
											target="_blank"
											rel="noreferrer"
										>
											opening an issue
										</a>{' '}
										in the GitHub repository for this project.
									</div>
								)}
								{savedAssessmentUrl && (
									<>
										<div className="alert alert-success mt-4">
											Assessment stored!
											<br />
											<code>{savedAssessmentUrl.toString()}</code>
										</div>
									</>
								)}
							</>
						)}
					</footer>
				</form>
			</section>
			<aside className="col-md-4">
				<FormNavigation
					form={form}
					navigate={(id) => {
						setCurrentSection(id)
					}}
				/>
				<hr />
				<dl>
					{submission !== undefined && (
						<>
							<dt>Submission</dt>
							<dd>
								<code>{submission.$id.toString()}</code>
							</dd>
						</>
					)}
					<dt>Form</dt>
					<dd>
						<code>{form.$id}</code>
					</dd>
				</dl>
			</aside>
		</>
	)
}
