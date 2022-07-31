import { QuestionInfo } from 'components/Form/QuestionInfo'
import { SelectInput } from 'components/Form/SelectInput'
import { useResponse } from 'hooks/useResponse'
import { useValidation } from 'hooks/useValidation'
import { countries } from 'schema/countries'
import type {
	Form as FormDefinition,
	Question,
	RegionQuestionFormat,
	Section,
} from 'schema/types'

export const RegionInput = ({
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
			<SelectInput
				value={value}
				setValue={setValue}
				isValid={isValid}
				isInvalid={isInvalid}
				required={required}
				options={(question.format as RegionQuestionFormat).regions.map(
					({ id, locality, countryCode }) => {
						if (countryCode === '00')
							return {
								id,
								title: locality,
							}
						return {
							id,
							title: `${locality} (${countries[countryCode].shortName})`,
						}
					},
				)}
			/>
		</QuestionInfo>
	)
}
