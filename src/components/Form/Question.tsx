import { IntegerInput } from 'components/Form/IntegerInput'
import { MultiSelectInput } from 'components/Form/MultiSelectInput'
import { SingleSelectInput } from 'components/Form/SingleSelectInput'
import { TextInput } from 'components/Form/TextInput'
import { isRequired, useResponse } from 'hooks/useResponse'
import type { Form as FormDefinition, Question, Section } from 'schema/types'

export const QuestionComponent = ({
	form,
	section,
	question,
}: {
	form: FormDefinition
	section: Section
	question: Question
}) => {
	const { response } = useResponse()
	const required = isRequired(question, response)
	switch (question.format.type) {
		case 'text':
			return (
				<TextInput
					form={form}
					section={section}
					question={question}
					maxLength={question.format.maxLength}
					required={required}
					type={'text'}
				/>
			)
		case 'email':
			return (
				<TextInput
					form={form}
					section={section}
					question={question}
					required={required}
					type={'email'}
				/>
			)
		case 'positive-integer':
		case 'non-negative-integer':
			return (
				<IntegerInput
					form={form}
					section={section}
					question={question}
					min={question.format.min}
					max={question.format.max}
					units={question.format.units}
					required={required}
					lowerBound={question.format.type === 'positive-integer' ? 1 : 0}
				/>
			)

		case 'single-select':
			return (
				<SingleSelectInput
					form={form}
					section={section}
					question={question}
					required={required}
				/>
			)
		case 'multi-select':
			return (
				<MultiSelectInput
					form={form}
					section={section}
					question={question}
					required={required}
				/>
			)
		default:
			return <p>Unknown question type: {(question.format as any).type}</p>
	}
}
