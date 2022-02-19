import cx from 'classnames'
import { Collapsable } from 'components/Collapsable'
import { OkIcon, WarningIcon } from 'components/FeatherIcons'
import { isHidden, isRequired, useResponse } from 'hooks/useResponse'
import { useValidation } from 'hooks/useValidation'
import { FunctionComponent, PropsWithChildren, useState } from 'react'
import { Link } from 'react-router-dom'
import type {
	Form as FormDefinition,
	MultiSelectQuestionFormat,
	Option,
	Question,
	Section,
	SingleSelectQuestionFormat,
	TextQuestionFormat,
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

	const hasInput = value.length > 0
	const isValid = hasInput && (validation[section.id]?.[question.id] ?? true)
	const isInvalid = hasInput ? !isValid : required

	return (
		<QuestionInfo section={section} question={question} required={required}>
			{(question.format as TextQuestionFormat).multiLine ?? false ? (
				<textarea
					maxLength={maxLength}
					required={required}
					className={cx('form-control', {
						'is-valid': isValid,
						'is-invalid': isInvalid,
					})}
					id={`${section.id}.${question.id}`}
					placeholder={
						question.example !== undefined
							? `e.g. "${question.example}"`
							: undefined
					}
					onChange={({ target: { value } }) => setValue(value)}
					onBlur={() => {
						setValue(value.trim())
					}}
					value={value ?? ''}
				/>
			) : (
				<input
					type={type}
					maxLength={maxLength}
					required={required}
					className={cx('form-control', {
						'is-valid': isValid,
						'is-invalid': isInvalid,
					})}
					id={`${section.id}.${question.id}`}
					placeholder={
						question.example !== undefined
							? `e.g. "${question.example}"`
							: undefined
					}
					value={value ?? ''}
					onChange={({ target: { value } }) => setValue(value)}
					onBlur={() => {
						setValue(value.trim())
					}}
				/>
			)}

			{maxLength !== undefined && (
				<small>{maxLength - value.length} character(s) remaining</small>
			)}
		</QuestionInfo>
	)
}

const IntegerInput = ({
	section,
	question,
	min,
	max,
	required,
	form,
	units,
	lowerBound,
}: {
	section: Section
	question: Question
	lowerBound?: number
	min?: number
	max?: number
	required: boolean
	form: FormDefinition
	units: Option[]
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

	const hasInput = value !== undefined && unit !== undefined
	const isValid = hasInput && (validation[section.id]?.[question.id] ?? true)
	const isInvalid = hasInput ? !isValid : required

	return (
		<QuestionInfo section={section} question={question} required={required}>
			<div className="input-group">
				<input
					required={required}
					type="number"
					min={Math.max(
						lowerBound ?? Number.MIN_SAFE_INTEGER,
						Math.abs(min ?? lowerBound ?? Number.MIN_SAFE_INTEGER),
					)}
					max={Math.min(
						Number.MAX_SAFE_INTEGER,
						Math.abs(max ?? Number.MAX_SAFE_INTEGER),
					)}
					step={1}
					className={cx('form-control', {
						'is-valid': isValid,
						'is-invalid': isInvalid,
					})}
					id={`${section.id}.${question.id}`}
					placeholder={
						question.example !== undefined
							? `e.g. "${question.example}"`
							: undefined
					}
					value={value ?? ''}
					onChange={({ target: { value } }) =>
						setValue({ value, unit: unit ?? units[0].id })
					}
				/>
				{units.length === 1 && (
					<span className="input-group-text">{units[0].title}</span>
				)}
				{units.length > 1 && (
					<select
						className="form-select"
						value={unit ?? units[0].id}
						onChange={({ target: { value: unit } }) => {
							setValue({ value, unit })
						}}
					>
						{units.map((unit) => (
							<option value={unit.id} key={unit.id}>
								{unit.title}
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

const SingleSelectInput = ({
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

const SelectInput = ({
	value,
	setValue,
	isValid,
	required,
	options,
	isInvalid,
}: {
	value: string
	setValue: (value: string) => void
	isValid: boolean
	isInvalid: boolean
	required: boolean
	options: Option[]
}) => (
	<select
		value={value}
		className={cx('form-control', {
			'is-valid': isValid,
			'is-invalid': isInvalid,
		})}
		required={required}
		onChange={({ target: { value } }) => setValue(value)}
	>
		<option value={-1}>Please select</option>
		{options.map((option) => (
			<option key={option.id} value={option.id}>
				{option.title}
			</option>
		))}
	</select>
)

const RadioInput = ({
	value,
	setValue,
	isValid,
	required,
	options,
	id,
	isInvalid,
}: {
	value: string
	setValue: (value: string) => void
	isValid: boolean
	isInvalid: boolean
	required: boolean
	options: Option[]
	id: string
}) => (
	<>
		{options.map((option) => (
			<div className="form-check" key={option.id}>
				<input
					className={cx('form-check-input', {
						'is-valid': isValid,
						'is-invalid': isInvalid,
					})}
					type="radio"
					name={id}
					id={`${id}.${option.id}`}
					checked={value === option.id}
					onChange={({ target: { checked } }) => {
						if (checked) setValue(option.id)
					}}
					value={option.id}
					required={required}
				/>
				<label className="form-check-label" htmlFor={`${id}.${option.id}`}>
					{option.title}
				</label>
			</div>
		))}
	</>
)

const MultiSelectInput = ({
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

	const hasInput = selected.length > 0
	const isValid = hasInput && (validation[section.id]?.[question.id] ?? true)
	const isInvalid = hasInput ? !isValid : required

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
							className={cx('form-check-input', {
								'is-valid': isValid,
								'is-invalid': isInvalid,
							})}
							type="checkbox"
							value={option.id}
							id={`${section.id}-${question.id}-${i}`}
							checked={selected.includes(option.id)}
							onChange={({ target: { checked } }) => {
								if (checked) {
									setSelected([...selected, option.id])
								} else {
									setSelected([...selected.filter((v) => v !== option.id)])
								}
							}}
						/>
						<label
							className="form-check-label"
							htmlFor={`${section.id}-${question.id}-${i}`}
						>
							{option.title}
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
			{section.description && (
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

export const FormFooter = ({
	form,
	onSubmit,
}: {
	form: FormDefinition
	onSubmit: () => void
}) => {
	const { response, update } = useResponse()
	const { valid } = useValidation({ response, form })
	const [consent, setDataUsageConsent] = useState<boolean>(false)

	return (
		<>
			<div>
				<div className="form-check">
					<input
						className="form-check-input"
						type="checkbox"
						value="yes"
						id="data-usage-consent"
						onChange={({ target: { checked } }) => {
							setDataUsageConsent(checked)
						}}
						checked={consent}
					/>
					<label className="form-check-label" htmlFor="data-usage-consent">
						By continuing with this form and submitting it, you agree that you
						understand and consent to how{' '}
						<Link to="/privacy" target="_blank">
							we will use your data
						</Link>{' '}
						and who we will share it with.
					</label>
				</div>
			</div>
			<div className="d-flex justify-content-end justify-content-between mt-4">
				<button
					type="button"
					className="btn btn-outline-danger"
					onClick={() => {
						if (window.confirm(`Really clear the form?`)) update({})
					}}
				>
					clear form
				</button>
				<button
					type="button"
					className="btn btn-primary"
					disabled={!valid || !consent}
					onClick={() => {
						onSubmit()
					}}
				>
					submit
				</button>
			</div>
		</>
	)
}
