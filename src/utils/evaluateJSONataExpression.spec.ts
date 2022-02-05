import { evaluateJSONataExpression } from 'utils/evaluateJSONataExpression'

describe('evaluateJSONataExpression', () => {
	it('should evaluate a expression', () =>
		expect(
			evaluateJSONataExpression({
				expression: `$not('food items' in whomYouServe.aidTypes)`,
				response: {
					whomYouServe: {
						aidTypes: ['food items'],
					},
				},
			}),
		).toEqual(false))
})
