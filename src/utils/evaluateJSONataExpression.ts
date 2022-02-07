import jsonata from 'jsonata'

export const evaluateJSONataExpression = ({
	expression,
	response,
	debug,
	error,
}: {
	expression: string
	response: Record<string, any>
	debug?: typeof console.debug
	error?: typeof console.error
}): boolean => {
	let result: boolean
	try {
		const compileExpression = jsonata(expression)
		result = compileExpression.evaluate(response)
	} catch (err) {
		error?.(`[jsonata]`, `failed to evaluate expression`, err)
		return false
	}
	debug?.(
		`[jsonata]`,
		'evaluating expression',
		JSON.stringify(expression),
		'against',
		response,
		'->',
		result,
	)
	if (result !== undefined && typeof result !== 'boolean') {
		error?.(
			`[jsonata]`,
			`expression ${expression} did not validate to a boolean value`,
			result,
		)
		return false
	}
	return result ?? false
}
