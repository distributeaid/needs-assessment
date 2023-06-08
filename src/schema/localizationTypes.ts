export enum LanguageCode {
	enUS = 'en-us',
	es = 'es',
	uk = 'uk',
}

export type LanguageCodeKeys = keyof typeof LanguageCode

export type AppStringValues = {
	instructions_title: string
	instructions_1: string
	instructions_2: string
	instructions_3: string
	instructions_4: string
	instructions_5: string
	instructions_button: string
}

type AppStringEntry = {
	language: string
	appStringValues: AppStringValues
}

export const appStrings = new Map<LanguageCodeKeys, AppStringEntry>()
appStrings.set('enUS', {
	language: 'English',
	appStringValues: {
		instructions_title: 'Instructions',
		instructions_1:
			'Please fill out each question to the best of your ability, and submit the survey before the beginning of the quarter you are reporting your needs for.',
		instructions_2:
			"Please only consider your organisation's total needs for the quarter in question that you don't already have covered.",
		instructions_3:
			'It is okay to use estimates, and we understand that conditions & needs change! We are only looking for a rough understanding of your needs.',
		instructions_4:
			'If your organisation operates in multiple regions, please fill out the survey multiple times. Please submit it once per region that you operate in, so we can keep the needs data separate.',
		instructions_5:
			'If you want to submit an assessment for a different quarter, please create a separate submission.',
		instructions_button: 'Continue',
	},
})
