import cx from 'classnames'
import { QuestionInfo } from 'components/Form/QuestionInfo'
import { useResponse } from 'hooks/useResponse'
import { useValidation } from 'hooks/useValidation'
import type { FocusEvent } from 'react'
import type {
	Form as FormDefinition,
	Option,
	Question,
	Section,
} from 'schema/types'

export const IntegerInput = ({
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
					onWheel={(e) => {
						;(e as unknown as FocusEvent<HTMLInputElement>).target.blur()
					}}
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
