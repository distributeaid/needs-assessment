import { useAppConfig } from 'hooks/useAppConfig'
import { useForm } from 'hooks/useForm'
import { useEffect, useState } from 'react'
import type { Form, Section } from 'schema/types'
import { setEmptyFieldsToUndefined } from 'utils/setEmptyFieldsToUndefined'

export const FormEditor = () => {
	const { form, setForm } = useForm()
	const { schemaUrl } = useAppConfig()
	const minimalValidForm: Form = {
		$schema: schemaUrl.toString(),
		...form,
		sections: [...(form?.sections ?? [])],
	}
	return (
		<>
			{(form?.sections ?? []).map((section) => (
				<SectionEditor
					key={section.id}
					section={section}
					onUpdate={(updatedSection) => {
						setForm({
							...minimalValidForm,
							sections: [
								...minimalValidForm.sections.filter(
									({ id }) => id !== section.id,
								),
								{
									...setEmptyFieldsToUndefined(updatedSection),
									questions:
										minimalValidForm.sections.find(
											({ id }) => id === section.id,
										)?.questions ?? [],
								},
							],
						})
					}}
				/>
			))}
			<hr />
			<button
				type="button"
				className="btn btn-outline-secondary"
				onClick={() => {
					setForm({
						...minimalValidForm,
						sections: [
							...minimalValidForm.sections,
							{
								id: `section${minimalValidForm.sections.length + 1}`,
								title: `New section`,
								questions: [],
							},
						],
					})
				}}
			>
				add section
			</button>
		</>
	)
}

const SectionEditor = ({
	section,
	onUpdate,
}: {
	section: Section
	onUpdate: (
		section: Pick<Section, 'id' | 'title' | 'description' | 'hidden'>,
	) => void
}) => {
	const [id, setId] = useState<string>(section.id)
	const [title, setTitle] = useState<string>(section.title)
	const [description, setDescription] = useState<string>(
		section.description ?? '',
	)
	const [hiddenExpression, setHiddenExpression] = useState<string>('')
	const [hidden, setHidden] = useState<boolean>(
		section.hidden !== undefined && typeof section.hidden === 'boolean'
			? section.hidden
			: false,
	)

	useEffect(() => {
		if (!hidden) return
		setHiddenExpression('')
	}, [hidden])

	return (
		<form>
			<div className="mb-2 d-flex justify-content-between align-items-center">
				<span>
					<strong>#{section.id}:</strong> {section.title}
				</span>
				<button
					type="button"
					className="btn btn-outline-secondary"
					onClick={() => {
						onUpdate({
							id,
							title,
							description,
							hidden: hidden === true ? true : hiddenExpression,
						})
					}}
				>
					save
				</button>
			</div>
			<div className="row mb-2">
				<label
					className="col-2 col-form-label"
					htmlFor={`section-${section.id}-id`}
				>
					ID
				</label>
				<div className="col-10">
					<div className="input-group">
						<input
							type="text"
							className="form-control"
							aria-describedby={`section-${section.id}-id-addon`}
							value={id}
							onChange={({ target: { value } }) => setId(value)}
							required
							id={`section-${section.id}-id`}
						/>
					</div>
				</div>
			</div>
			<div className="row mb-2">
				<label
					className="col-2 col-form-label"
					htmlFor={`section-${section.id}-title`}
				>
					Title
				</label>
				<div className="col-10">
					<div className="input-group">
						<input
							type="text"
							className="form-control"
							aria-describedby={`section-${section.id}-title-addon`}
							value={title}
							onChange={({ target: { value } }) => setTitle(value)}
							required
							id={`section-${section.id}-title`}
						/>
					</div>
				</div>
			</div>
			<div className="row mb-2">
				<label
					className="col-2 col-form-label"
					htmlFor={`section-${section.id}-description`}
				>
					Description
				</label>
				<div className="col-10">
					<div className="input-group">
						<input
							type="text"
							className="form-control"
							aria-describedby={`section-${section.id}-description-addon`}
							value={description}
							onChange={({ target: { value } }) => setDescription(value)}
							id={`section-${section.id}-description`}
						/>
					</div>
				</div>
			</div>
			<div className="row mb-2">
				<label
					className="col-2 col-form-label"
					htmlFor={`section-${section.id}-hidden`}
				>
					Hidden
				</label>
				<div className="col-10">
					<div className="input-group">
						<input
							type="text"
							className="form-control"
							aria-describedby={`section-${section.id}-hidden-addon`}
							value={hiddenExpression}
							onChange={({ target: { value } }) => setHiddenExpression(value)}
							disabled={hidden}
						/>
						<label className="input-group-text">
							<input
								className="form-check-input mt-0"
								type="checkbox"
								checked={hidden}
								onClick={() => setHidden((hidden) => !hidden)}
							/>
							<code className="ms-2">Boolean</code>
						</label>
					</div>
				</div>
			</div>
		</form>
	)
}
