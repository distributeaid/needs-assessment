import { Collapsable } from 'components/Collapsable'
import { WarningIcon } from 'components/FeatherIcons'
import { useResponse } from 'hooks/useResponse'
import { useValidation } from 'hooks/useValidation'
import type { FunctionComponent, PropsWithChildren } from 'react'
import type {
	Form as FormDefinition,
	MultiSelectQuestionFormat,
	Question,
	Section,
	SingleSelectQuestionFormat,
} from 'schema/types'

const QuestionInfo: FunctionComponent<
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

const TextInput = ({
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
	return (
		<QuestionInfo section={section} question={question} required={required}>
			<input
				type={type}
				maxLength={maxLength}
				required={required}
				className={`form-control ${
					validation[section.id][question.id] ? 'is-valid' : 'is-invalid'
				}`}
				id={`${section.id}.${question.id}`}
				placeholder={
					question.example !== undefined
						? `e.g. "${question.example}"`
						: undefined
				}
				value={value}
				onChange={({ target: { value } }) => setValue(value)}
				onBlur={() => {
					setValue(value.trim())
				}}
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
	form,
	units,
}: {
	section: Section
	question: Question
	min?: number
	max?: number
	required: boolean
	form: FormDefinition
	units: string[]
}) => {
	const { response, update } = useResponse()
	const [value, unit] = response?.[section.id]?.[question.id] ?? []
	const { validation } = useValidation({ response, form })
	const setValue = ({ value, unit }: { value: string; unit: string }) => {
		const v = parseInt(value, 10)
		update({
			...response,
			[section.id]: {
				...response?.[section.id],
				[question.id]: isNaN(v) ? undefined : [v, unit],
			},
		})
	}

	return (
		<QuestionInfo section={section} question={question} required={required}>
			<div className="input-group">
				<input
					required={required}
					type="number"
					min={Math.max(1, Math.abs(min ?? 1))}
					max={Math.min(
						Number.MAX_SAFE_INTEGER,
						Math.abs(max ?? Number.MAX_SAFE_INTEGER),
					)}
					step={1}
					className={`form-control ${
						validation[section.id][question.id] ? 'is-valid' : 'is-invalid'
					}`}
					id={`${section.id}.${question.id}`}
					placeholder={
						question.example !== undefined
							? `e.g. "${question.example}"`
							: undefined
					}
					value={value}
					onChange={({ target: { value } }) =>
						setValue({ value, unit: unit ?? units[0] })
					}
				/>
				{units.length === 1 && (
					<span className="input-group-text">{units[0]}</span>
				)}
				{units.length > 1 && (
					<select
						className="form-select"
						value={unit ?? units[0]}
						onChange={({ target: { value: unit } }) => {
							setValue({ value, unit })
						}}
					>
						{units.map((unit) => (
							<option value={unit} key={unit}>
								{unit}
							</option>
						))}
					</select>
				)}
			</div>
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
	form: FormDefinition
}) => <TextInput {...rest} type={'text'} />

const EmailQuestion = (args: {
	section: Section
	question: Question
	required: boolean
	form: FormDefinition
}) => <TextInput {...args} type={'email'} />

const PositiveIntegerQuestion = (args: {
	section: Section
	question: Question
	min?: number
	max?: number
	required: boolean
	form: FormDefinition
	units: string[]
}) => <PositiveIntegerInput {...args} />

const SingleSelectQuestion = ({
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
	return (
		<QuestionInfo section={section} question={question} required={required}>
			<select
				value={value}
				className={`form-control ${
					validation[section.id][question.id] ? 'is-valid' : 'is-invalid'
				}`}
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
	form,
}: {
	section: Section
	question: Question
	required: boolean
	form: FormDefinition
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
	const { validation } = useValidation({ response, form })
	return (
		<div className="mb-3">
			<p className="form-label">
				{question.title}{' '}
				{!required && (
					<small>
						<em>(optional)</em>
					</small>
				)}
			</p>
			{(question.format as MultiSelectQuestionFormat).options.map(
				(option, i) => (
					<div className="form-check" key={i}>
						<input
							className={`form-check-input ${
								validation[section.id][question.id] ? 'is-valid' : 'is-invalid'
							}`}
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
	form,
	section,
	question,
}: {
	form: FormDefinition
	section: Section
	question: Question
}) => {
	// FIXME: implement JSONata expression
	const isRequired = question.required !== false
	switch (question.format.type) {
		case 'text':
			return (
				<TextQuestion
					form={form}
					section={section}
					question={question}
					maxLength={question.format.maxLength}
					required={isRequired}
				/>
			)
		case 'email':
			return (
				<EmailQuestion
					form={form}
					section={section}
					question={question}
					required={isRequired}
				/>
			)
		case 'positive-integer':
			return (
				<PositiveIntegerQuestion
					form={form}
					section={section}
					question={question}
					min={question.format.min}
					max={question.format.max}
					units={question.format.units}
					required={isRequired}
				/>
			)
		case 'single-select':
			return (
				<SingleSelectQuestion
					form={form}
					section={section}
					question={question}
					required={isRequired}
				/>
			)
		case 'multi-select':
			return (
				<MultiSelectQuestion
					form={form}
					section={section}
					question={question}
					required={isRequired}
				/>
			)
		default:
			return <p>Unknown question type: {(question.format as any).type}</p>
	}
}

const SectionComponent = ({
	section,
	form,
}: {
	form: FormDefinition
	section: Section
}) => (
	<fieldset>
		{section.description && (
			<legend className="fs-6">{section.description}</legend>
		)}
		{section.questions.map((question) => (
			<QuestionComponent
				form={form}
				section={section}
				question={question}
				key={question.id}
			/>
		))}
	</fieldset>
)

export const Form = ({ form }: { form: FormDefinition }) => {
	const { response, update } = useResponse()
	const { valid, sectionValidation } = useValidation({ response, form })
	return (
		<form className="form">
			{form.sections.map((section) => (
				<Collapsable
					title={
						<>
							{section.title}
							{!sectionValidation[section.id] && (
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
			))}
			<hr />
			<footer className="d-flex justify-content-end justify-content-between">
				<button
					type="button"
					className="btn btn-outline-danger"
					onClick={() => {
						if (window.confirm(`Really clear the form?`)) update({})
					}}
				>
					clear form
				</button>
				<button type="button" className="btn btn-primary" disabled={!valid}>
					submit
				</button>
			</footer>
		</form>
	)
}
