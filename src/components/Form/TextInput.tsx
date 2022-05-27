import cx from 'classnames'
import { QuestionInfo } from 'components/Form/QuestionInfo'
import { useResponse } from 'hooks/useResponse'
import { useValidation } from 'hooks/useValidation'
import type {
	Form as FormDefinition,
	Question,
	Section,
	TextQuestionFormat,
} from 'schema/types'

export const TextInput = ({
	form,
	section,
	question,
	type,
	maxLength,
	required,
}: {
	form: FormDefinition
	section: Section
	question: Question
	type: 'text' | 'email'
	maxLength?: number
	required: boolean
}) => {
	const { response, update } = useResponse()
	const { validation } = useValidation({ response, form })
	const value = response?.[section.id]?.[question.id] ?? ''
	const setValue = (value: string) => {
		return update({
			...response,
			[section.id]: {
				...response?.[section.id],
				[question.id]: value.length > 0 ? value : undefined,
			},
		})
	}

	const hasInput = value.length > 0
	const isValid = hasInput && (validation[section.id]?.[question.id] ?? true)
	const isInvalid = hasInput ? !isValid : required

	return (
		<QuestionInfo section={section} question={question} required={required}>
			{(question.format as TextQuestionFormat).multiLine ?? false ? (
				<textarea
					maxLength={maxLength}
					required={required}
					className={cx('form-control', {
						'is-valid': isValid,
						'is-invalid': isInvalid,
					})}
					id={`${section.id}.${question.id}`}
					placeholder={
						question.example !== undefined
							? `e.g. "${question.example}"`
							: undefined
					}
					onChange={({ target: { value } }) => setValue(value)}
					onBlur={() => {
						setValue(value.trim())
					}}
					value={value ?? ''}
				/>
			) : (
				<input
					type={type}
					maxLength={maxLength}
					required={required}
					className={cx('form-control', {
						'is-valid': isValid,
						'is-invalid': isInvalid,
					})}
					id={`${section.id}.${question.id}`}
					placeholder={
						question.example !== undefined
							? `e.g. "${question.example}"`
							: undefined
					}
					value={value ?? ''}
					onChange={({ target: { value } }) => setValue(value)}
					onBlur={() => {
						setValue(value.trim())
					}}
				/>
			)}

			{maxLength !== undefined && (
				<small>{maxLength - value.length} character(s) remaining</small>
			)}
		</QuestionInfo>
	)
}
