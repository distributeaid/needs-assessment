import { Collapsable } from 'components/Collapsable'
import { useResponse } from 'hooks/useResponse'
import type { FunctionComponent, PropsWithChildren } from 'react'

type JSONatatExpression = string

type SingleSelectQuestionFormat = {
	type: 'single-select'
	options: string[]
}

type MultiSelectQuestionFormat = {
	type: 'multi-select'
	options: string[]
}

type Question = {
	id: string
	title: string
	required?: boolean | JSONatatExpression // default: true
	example?: string
	format:
		| {
				type: 'text'
				maxLength?: number
		  }
		| {
				type: 'email'
		  }
		| {
				type: 'positive-integer'
				min?: number
				max?: number
		  }
		| SingleSelectQuestionFormat
		| MultiSelectQuestionFormat
}

type Section = {
	id: string
	title: string
	questions: Question[]
}
export type Definition = {
	sections: Section[]
}

const QuestionInfo: FunctionComponent<
	PropsWithChildren<{ section: Section; question: Question; required: boolean }>
> = ({ section, question, children, required }) => (
	<div className="mb-3">
		<label htmlFor={`${section.id}.${question.id}`} className="form-label">
			{!required && (
				<>
					<em>Optional:</em>{' '}
				</>
			)}
			{question.title}
		</label>
		{children}
	</div>
)

const TextInput = ({
	section,
	question,
	type,
	maxLength,
	required,
}: {
	section: Section
	question: Question
	type: 'text' | 'email'
	maxLength?: number
	required: boolean
}) => {
	const { response, update } = useResponse()
	const value = response?.[section.id]?.[question.id] ?? ''
	const setValue = (value: string) => {
		const v = value.trim()
		return update({
			...response,
			[section.id]: {
				...response?.[section.id],
				[question.id]: v.length > 0 ? v : undefined,
			},
		})
	}
	return (
		<QuestionInfo section={section} question={question} required={required}>
			<input
				type={type}
				maxLength={maxLength}
				required={required}
				className="form-control"
				id={`${section.id}.${question.id}`}
				placeholder={
					question.example !== undefined
						? `e.g. "${question.example}"`
						: undefined
				}
				value={value}
				onChange={({ target: { value } }) => setValue(value)}
			/>
			{maxLength !== undefined && (
				<small>{maxLength - value.length} character(s) remaining</small>
			)}
		</QuestionInfo>
	)
}

const PositiveIntegerInput = ({
	section,
	question,
	min,
	max,
	required,
}: {
	section: Section
	question: Question
	min?: number
	max?: number
	required: boolean
}) => {
	const { response, update } = useResponse()
	const value = response?.[section.id]?.[question.id] ?? ''
	const setValue = (value: string) => {
		const v = parseInt(value, 10)
		update({
			...response,
			[section.id]: {
				...response?.[section.id],
				[question.id]: isNaN(v) ? undefined : v,
			},
		})
	}
	return (
		<QuestionInfo section={section} question={question} required={required}>
			<input
				required={required}
				type="number"
				min={Math.max(1, Math.abs(min ?? 1))}
				max={Math.min(
					Number.MAX_SAFE_INTEGER,
					Math.abs(max ?? Number.MAX_SAFE_INTEGER),
				)}
				step={1}
				className="form-control"
				id={`${section.id}.${question.id}`}
				placeholder={
					question.example !== undefined
						? `e.g. "${question.example}"`
						: undefined
				}
				value={value}
				onChange={({ target: { value } }) => setValue(value)}
			/>
			{min !== undefined && max !== undefined && (
				<small>
					at least {min} and at most {max}
				</small>
			)}
			{min !== undefined && max === undefined && <small>{min} or more</small>}
			{min === undefined && max !== undefined && <small>less than {max}</small>}
		</QuestionInfo>
	)
}

const TextQuestion = ({
	maxLength,
	...rest
}: {
	section: Section
	question: Question
	maxLength?: number
	required: boolean
}) => <TextInput {...rest} type={'text'} />

const EmailQuestion = (args: {
	section: Section
	question: Question
	required: boolean
}) => <TextInput {...args} type={'email'} />

const PositiveIntegerQuestion = (args: {
	section: Section
	question: Question
	min?: number
	max?: number
	required: boolean
}) => <PositiveIntegerInput {...args} />

const SingleSelectQuestion = ({
	question,
	section,
	required,
}: {
	section: Section
	question: Question
	required: boolean
}) => {
	const { response, update } = useResponse()
	const value = response?.[section.id]?.[question.id] ?? ''
	const setValue = (value: string) =>
		update({
			...response,
			[section.id]: {
				...response?.[section.id],
				[question.id]: value === '-1' ? undefined : value,
			},
		})
	return (
		<QuestionInfo section={section} question={question} required={required}>
			<select
				value={value}
				className="form-control"
				required={required}
				onChange={({ target: { value } }) => setValue(value)}
			>
				<option value={-1}>Please select</option>
				{(question.format as SingleSelectQuestionFormat).options.map(
					(option, i) => (
						<option key={i}>{option}</option>
					),
				)}
			</select>
		</QuestionInfo>
	)
}

const MultiSelectQuestion = ({
	section,
	question,
	required,
}: {
	section: Section
	question: Question
	required: boolean
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
	return (
		<div className="mb-3">
			<p className="form-label">
				{!required && (
					<>
						<em>Optional:</em>{' '}
					</>
				)}
				{question.title}
			</p>
			{(question.format as MultiSelectQuestionFormat).options.map(
				(option, i) => (
					<div className="form-check" key={i}>
						<input
							className="form-check-input"
							type="checkbox"
							value={option}
							id={`${section.id}-${question.id}-${i}`}
							checked={selected.includes(option)}
							onChange={({ target: { checked } }) => {
								if (checked) {
									setSelected([...selected, option])
								} else {
									setSelected([...selected.filter((v) => v !== option)])
								}
							}}
						/>
						<label
							className="form-check-label"
							htmlFor={`${section.id}-${question.id}-${i}`}
						>
							{option}
						</label>
					</div>
				),
			)}
		</div>
	)
}

const QuestionComponent = ({
	section,
	question,
}: {
	section: Section
	question: Question
}) => {
	// FIXME: implement JSONata expression
	const isRequired = question.required !== false
	switch (question.format.type) {
		case 'text':
			return (
				<TextQuestion
					section={section}
					question={question}
					maxLength={question.format.maxLength}
					required={isRequired}
				/>
			)
		case 'email':
			return (
				<EmailQuestion
					section={section}
					question={question}
					required={isRequired}
				/>
			)
		case 'positive-integer':
			return (
				<PositiveIntegerQuestion
					section={section}
					question={question}
					min={question.format.min}
					max={question.format.max}
					required={isRequired}
				/>
			)
		case 'single-select':
			return (
				<SingleSelectQuestion
					section={section}
					question={question}
					required={isRequired}
				/>
			)
		case 'multi-select':
			return (
				<MultiSelectQuestion
					section={section}
					question={question}
					required={isRequired}
				/>
			)
		default:
			return <p>Unknown question type: {(question.format as any).type}</p>
	}
}

const SectionComponent = ({ section }: { section: Section }) => (
	<fieldset>
		{section.questions.map((question) => (
			<QuestionComponent
				section={section}
				question={question}
				key={question.id}
			/>
		))}
	</fieldset>
)

export const Form = ({ definition }: { definition: Definition }) => {
	return (
		<form className="form">
			{definition.sections.map((section) => (
				<Collapsable title={section.title} id={section.id} key={section.id}>
					<SectionComponent section={section} />
				</Collapsable>
			))}
			<footer></footer>
		</form>
	)
}
