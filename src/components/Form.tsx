import { Collapsable } from 'components/Collapsable'
import { OkIcon, WarningIcon } from 'components/FeatherIcons'
import { SectionComponent } from 'components/Form/Section'
import { FormFooter } from 'components/FormFooter'
import { isHidden, useResponse } from 'hooks/useResponse'
import { useValidation } from 'hooks/useValidation'
import type { Form as FormDefinition } from 'schema/types'

export const Form = ({
	form,
	onSubmit,
}: {
	form: FormDefinition
	onSubmit: () => void
}) => {
	const { response } = useResponse()
	const { sectionValidation } = useValidation({ response, form })

	return (
		<form className="form">
			{form.sections.map((section) => {
				if (isHidden(section, response)) return null
				return (
					<Collapsable
						title={
							<>
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
							</>
						}
						id={section.id}
						key={section.id}
					>
						<SectionComponent form={form} section={section} />
					</Collapsable>
				)
			})}
			<hr />
			<footer>
				<FormFooter form={form} onSubmit={onSubmit} />
			</footer>
		</form>
	)
}
