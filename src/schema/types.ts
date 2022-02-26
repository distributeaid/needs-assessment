export type JSONatatExpression = string

export type Option = {
	id: string
	title: string
}

export type QuestionWithOptions = {
	options: Option[]
}

export type SingleSelectQuestionFormat = {
	type: 'single-select'
	style?: 'dropdown' | 'radio'
} & QuestionWithOptions

export type MultiSelectQuestionFormat = {
	type: 'multi-select'
} & QuestionWithOptions

export type TextQuestionFormat = {
	type: 'text'
	maxLength?: number
	multiLine?: boolean
}

export type IntegerQuestionFormat = {
	units: Option[]
	min?: number
	max?: number
}

export type PositiveIntegerQuestionFormat = {
	type: 'positive-integer'
} & IntegerQuestionFormat

export type NonNegativeIntegerQuestionFormat = {
	type: 'non-negative-integer'
} & IntegerQuestionFormat

export type Question = {
	id: string
	title: string
	required?: boolean | JSONatatExpression // default: false
	hidden?: boolean | JSONatatExpression // default: false
	example?: string
	format:
		| TextQuestionFormat
		| {
				type: 'email'
		  }
		| PositiveIntegerQuestionFormat
		| NonNegativeIntegerQuestionFormat
		| SingleSelectQuestionFormat
		| MultiSelectQuestionFormat
}

export type Section = {
	id: string
	title: string
	description?: string
	questions: Question[]
	hidden?: boolean | JSONatatExpression // default: false
}
export type Form = {
	$schema: string
	sections: Section[]
}

export type StoredForm = Form & {
	$id: string
}
