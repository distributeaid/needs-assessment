import {
	appStrings,
	AppStringValues,
	LanguageCodeKeys,
} from 'schema/localizationTypes'

export const getAppStringValue = (
	languageCode: LanguageCodeKeys,
	appStringKey: keyof AppStringValues,
): string => {
	const appStringEntry = appStrings.get(languageCode)

	if (!appStringEntry) {
		throw new Error('Language code not supported')
	}

	const appStringValue =
		appStringEntry.appStringValues[appStringKey] ?? appStringEntry

	if (!appStringValue) {
		throw new Error('Invalid app string key provided')
	}

	return appStringValue
}
