import type { Response } from 'hooks/useResponse'
import { isHidden } from 'hooks/useResponse'
import type { Form, MultiSelectQuestionFormat } from 'schema/types'

export const responseToTSV = (response: Response, form: Form): string => {
	const tsv: string[][] = []
	tsv.push(['ID', 'Question', 'Answer', 'Answer Text', 'Unit', 'Unit Text'])
	form.sections.forEach((section) => {
		if (isHidden(section, response)) return
		section.questions.forEach((question) => {
			if (isHidden(question, response)) return
			const id = `${section.id}.${question.id}`
			const questionText = question.title
			const v = response[section.id]?.[question.id]
			switch (question.format.type) {
				case 'text':
				case 'email':
					tsv.push([id, questionText, v])
					return
				case 'single-select':
					tsv.push([
						id,
						questionText,
						v,
						question.format.options.find(({ id }) => id === v)?.title ?? '',
					])
					return
				case 'positive-integer':
					tsv.push([
						id,
						questionText,
						v?.[0],
						'',
						v?.[1],
						question.format.units.find(({ id }) => id === v?.[1])?.title ?? '',
					])
					return
				case 'multi-select':
					tsv.push([
						id,
						questionText,
						v?.join(', '),
						((v ?? []) as string[])
							.map(
								(answer) =>
									(question.format as MultiSelectQuestionFormat).options.find(
										({ id }) => id === answer,
									)?.title ?? '',
							)
							.join(', '),
					])
					return
				default:
					tsv.push([id, questionText, JSON.stringify(v)])
					return
			}
		})
	})

	return tsv.map((line) => line.join('\t')).join('\n')
}
