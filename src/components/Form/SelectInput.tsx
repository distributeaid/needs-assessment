import cx from 'classnames'
import type { Option } from 'schema/types'

export const SelectInput = ({
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
