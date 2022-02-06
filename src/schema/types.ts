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

export type PositiveIntegerQuestionFormat = {
	type: 'positive-integer'
	units: Option[]
	min?: number
	max?: number
}

export type Question = {
	id: string
	title: string
	required?: boolean | JSONatatExpression // default: true
	hidden?: boolean | JSONatatExpression // default: true
	example?: string
	format:
		| TextQuestionFormat
		| {
				type: 'email'
		  }
		| PositiveIntegerQuestionFormat
		| SingleSelectQuestionFormat
		| MultiSelectQuestionFormat
}

export type Section = {
	id: string
	title: string
	description: string
	questions: Question[]
	hidden?: boolean | JSONatatExpression // default: true
}
export type Form = {
	sections: Section[]
}
