import { Collapsable } from 'components/Collapsable'

type Section = {
	id: string
	title: string
}
export type Definition = {
	sections: Section[]
}

export const Form = ({ definition }: { definition: Definition }) => {
	return (
		<form className="form">
			{definition.sections.map((section) => (
				<Collapsable title={section.title} id={section.id}>
					<fieldset key={section.id}></fieldset>
				</Collapsable>
			))}
		</form>
	)
}
