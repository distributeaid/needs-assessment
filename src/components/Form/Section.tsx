import { QuestionComponent } from 'components/Form/Question'
import { isHidden, useResponse } from 'hooks/useResponse'
import type { Form as FormDefinition, Section } from 'schema/types'

export const SectionComponent = ({
	section,
	form,
}: {
	form: FormDefinition
	section: Section
}) => {
	const { response } = useResponse()

	return (
		<fieldset>
			{section.description !== undefined && (
				<legend className="fs-6">{section.description}</legend>
			)}
			{section.questions.map((question) => {
				if (isHidden(question, response)) return null
				return (
					<QuestionComponent
						form={form}
						section={section}
						question={question}
						key={question.id}
					/>
				)
			})}
		</fieldset>
	)
}
