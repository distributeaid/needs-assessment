import { useForm } from 'hooks/useForm'
import { useState } from 'react'
import type { Section } from 'schema/types'

export const FormEditor = () => {
	const { form } = useForm()
	return (
		<>
			{(form?.sections ?? []).map((section) => (
				<SectionEditor key={section.id} section={section} />
			))}
		</>
	)
}

const SectionEditor = ({ section }: { section: Section }) => {
	const [id, setId] = useState<string>(section.id)
	const [title, setTitle] = useState<string>(section.title)
	return (
		<div className="row mb-2">
			<div className="col-6">
				<div className="input-group">
					<span
						className="input-group-text"
						id={`section-${section.id}-id-addon`}
					>
						ID
					</span>
					<input
						type="text"
						className="form-control"
						aria-describedby={`section-${section.id}-id-addon`}
						value={id}
						onChange={({ target: { value } }) => setId(value)}
					/>
				</div>
			</div>
			<div className="col-6">
				<div className="input-group">
					<span
						className="input-group-text"
						id={`section-${section.id}-title-addon`}
					>
						Title
					</span>
					<input
						type="text"
						className="form-control"
						aria-describedby={`section-${section.id}-title-addon`}
						value={title}
						onChange={({ target: { value } }) => setTitle(value)}
					/>
				</div>
			</div>
		</div>
	)
}
