import cx from 'classnames'
import { useResponse } from 'hooks/useResponse'
import { useValidation } from 'hooks/useValidation'
import type {
	Form as FormDefinition,
	MultiSelectQuestionFormat,
	Question,
	Section,
} from 'schema/types'

export const MultiSelectInput = ({
	section,
	question,
	required,
	form,
}: {
	section: Section
	question: Question
	required: boolean
	form: FormDefinition
}) => {
	const { response, update } = useResponse()
	const selected: string[] = response?.[section.id]?.[question.id] ?? []
	const setSelected = (value: string[]) =>
		update({
			...response,
			[section.id]: {
				...response?.[section.id],
				[question.id]: value.length === 0 ? undefined : value,
			},
		})
	const { validation } = useValidation({ response, form })

	const hasInput = selected.length > 0
	const isValid = hasInput && (validation[section.id]?.[question.id] ?? true)
	const isInvalid = hasInput ? !isValid : required

	return (
		<div className="mb-3">
			<p className="form-label">
				{question.title}{' '}
				{!required && (
					<small>
						<em>(optional)</em>
					</small>
				)}
			</p>
			{(question.format as MultiSelectQuestionFormat).options.map(
				(option, i) => (
					<div className="form-check" key={i}>
						<input
							className={cx('form-check-input', {
								'is-valid': isValid,
								'is-invalid': isInvalid,
							})}
							type="checkbox"
							value={option.id}
							id={`${section.id}-${question.id}-${i}`}
							checked={selected.includes(option.id)}
							onChange={({ target: { checked } }) => {
								if (checked) {
									setSelected([...selected, option.id])
								} else {
									setSelected([...selected.filter((v) => v !== option.id)])
								}
							}}
						/>
						<label
							className="form-check-label"
							htmlFor={`${section.id}-${question.id}-${i}`}
						>
							{option.title}
						</label>
					</div>
				),
			)}
		</div>
	)
}
