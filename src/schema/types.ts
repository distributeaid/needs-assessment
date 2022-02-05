export type JSONatatExpression = string

export type SingleSelectQuestionFormat = {
	type: 'single-select'
	options: string[]
}

export type MultiSelectQuestionFormat = {
	type: 'multi-select'
	options: string[]
}

export type Question = {
	id: string
	title: string
	required?: boolean | JSONatatExpression // default: true
	hidden?: boolean | JSONatatExpression // default: true
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
				units: string[]
				min?: number
				max?: number
		  }
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