import { QuestionInfo } from 'components/Form/QuestionInfo'
import { RadioInput } from 'components/Form/RadioInput'
import { SelectInput } from 'components/Form/SelectInput'
import { useResponse } from 'hooks/useResponse'
import { useValidation } from 'hooks/useValidation'
import type {
	Form as FormDefinition,
	Question,
	Section,
	SingleSelectQuestionFormat,
} from 'schema/types'

export const SingleSelectInput = ({
	question,
	section,
	required,
	form,
}: {
	section: Section
	question: Question
	required: boolean
	form: FormDefinition
}) => {
	const { response, update } = useResponse()
	const value = response?.[section.id]?.[question.id] ?? ''
	const { validation } = useValidation({ response, form })
	const setValue = (value: string) =>
		update({
			...response,
			[section.id]: {
				...response?.[section.id],
				[question.id]: value === '-1' ? undefined : value,
			},
		})

	const hasInput = value.length > 0
	const isValid = hasInput && (validation[section.id]?.[question.id] ?? true)
	const isInvalid = hasInput ? !isValid : required

	return (
		<QuestionInfo section={section} question={question} required={required}>
			{(question.format as SingleSelectQuestionFormat)?.style === 'radio' ? (
				<RadioInput
					value={value}
					setValue={setValue}
					isValid={isValid}
					isInvalid={isInvalid}
					required={required}
					options={(question.format as SingleSelectQuestionFormat).options}
					id={`${section.id}.${question.id}`}
				/>
			) : (
				<SelectInput
					value={value}
					setValue={setValue}
					isValid={isValid}
					isInvalid={isInvalid}
					required={required}
					options={(question.format as SingleSelectQuestionFormat).options}
				/>
			)}
		</QuestionInfo>
	)
}
