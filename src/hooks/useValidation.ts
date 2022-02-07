import type { Response } from 'hooks/useResponse'
import { isHidden, isRequired } from 'hooks/useResponse'
import type { Form, MultiSelectQuestionFormat, Question } from 'schema/types'

const validateResponse = (
	answer: any,
	question: Question,
	response: Response,
): boolean => {
	const required = isRequired(question, response)
	const isBlank = answer === undefined || answer.length === 0
	if (isBlank && !required) return true
	switch (question.format.type) {
		case 'email':
			return /.+@.+\..+/.test(answer)
		case 'text':
			return (
				(answer ?? '').length >= 1 &&
				(answer ?? '').length <=
					(question.format.maxLength ?? Number.MAX_SAFE_INTEGER)
			)
		case 'single-select':
			return question.format.options.map(({ id }) => id).includes(answer)
		case 'multi-select':
			return (
				((answer ?? []) as string[]).length > 0 &&
				((answer ?? []) as string[]).reduce((validSelection, a) => {
					if (validSelection === false) return false
					return (question.format as MultiSelectQuestionFormat).options
						.map(({ id }) => id)
						.includes(a)
				}, true as boolean)
			)
		case 'positive-integer':
			return !isNaN(parseInt(answer, 10)) && parseInt(answer, 10) > 0
		case 'non-negative-integer':
			return !isNaN(parseInt(answer, 10)) && parseInt(answer, 10) >= 0
		default:
			return false
	}
}

export const useValidation = ({
	response,
	form,
}: {
	response: Response
	form: Form
}): {
	valid: boolean
	validation: Record<string, Record<string, boolean>>
	sectionValidation: Record<string, boolean>
} => {
	let valid = true
	const sectionValidation: Record<string, boolean> = {}
	const validation: Record<string, Record<string, boolean>> = {}

	for (const section of form.sections) {
		if (isHidden(section, response)) continue
		if (validation[section.id] === undefined) {
			validation[section.id] = {}
			sectionValidation[section.id] = true
		}
		for (const question of section.questions) {
			if (isHidden(question, response)) continue
			const questionResponse = response[section.id]?.[question.id]
			validation[section.id][question.id] = validateResponse(
				questionResponse,
				question,
				response,
			)
			if (validation[section.id][question.id] === false) {
				sectionValidation[section.id] = false
				valid = false
			}
		}
	}

	return {
		valid,
		validation,
		sectionValidation,
	}
}
