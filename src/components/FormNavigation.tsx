import { OkIcon, WarningIcon } from 'components/FeatherIcons'
import { isHidden, useResponse } from 'hooks/useResponse'
import { useValidation } from 'hooks/useValidation'
import type { Form as FormDefinition } from 'schema/types'

export const FormNavigation = ({
	form,
	navigate,
}: {
	form: FormDefinition
	navigate: (id: string) => void
}) => {
	const { response } = useResponse()
	const { sectionValidation } = useValidation({ response, form })

	return (
		<nav className="d-flex flex-column align-items-start">
			{form.sections.map((section) => {
				if (isHidden(section, response)) return null
				return (
					<div key={section.id}>
						{sectionValidation[section.id] ? (
							<abbr title="Section is valid.">
								<OkIcon />
							</abbr>
						) : (
							<abbr title="Section is invalid.">
								<WarningIcon />
							</abbr>
						)}{' '}
						<button
							className="btn btn-link"
							onClick={() => navigate(section.id)}
						>
							{section.title}
						</button>
					</div>
				)
			})}
		</nav>
	)
}
