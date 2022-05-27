import cx from 'classnames'
import type { Option } from 'schema/types'

export const RadioInput = ({
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
