import type { FunctionComponent, PropsWithChildren } from 'react'
import type { Question, Section } from 'schema/types'

export const QuestionInfo: FunctionComponent<
	PropsWithChildren<{ section: Section; question: Question; required: boolean }>
> = ({ section, question, children, required }) => (
	<div className="mb-3">
		<label htmlFor={`${section.id}.${question.id}`} className="form-label">
			{question.title}{' '}
			{!required && (
				<small>
					<em>(optional)</em>
				</small>
			)}
		</label>
		{children}
	</div>
)
