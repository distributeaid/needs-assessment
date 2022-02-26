import { setEmptyFieldsToUndefined } from 'utils/setEmptyFieldsToUndefined'

test(`setEmptyFieldsToUndefined`, () => {
	expect(
		setEmptyFieldsToUndefined({
			a: '',
			b: null,
			c: undefined,
			d: 0,
			e: 'e',
		}),
	).toEqual({ d: 0, e: 'e' })
})
