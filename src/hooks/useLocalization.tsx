import {
	createContext,
	FunctionComponent,
	ReactNode,
	useCallback,
	useContext,
	useState,
} from 'react'
import { AppStringValues, LanguageCodeKeys } from 'schema/localizationTypes'
import { getAppStringValue } from 'utils/getAppStringValue'

export const LocalizationContext = createContext<{
	languageCode?: LanguageCodeKeys
	setLanguageCode: (languageCode: LanguageCodeKeys) => void
	localizeAppString: (appStringKey: keyof AppStringValues) => string
}>({
	setLanguageCode: () => undefined,
	localizeAppString: (_appStringKey) => {
		throw new Error("localizeAppString called before it's implemented")
	},
})

export const useLocalizationContext = () => useContext(LocalizationContext)

export const LocalizationProvider: FunctionComponent<{
	children: ReactNode
}> = ({ children }) => {
	const [languageCode, setLanguageCode] = useState<LanguageCodeKeys>('enUS')
	const localizeAppString = useCallback(
		(appStringKey: keyof AppStringValues) => {
			return getAppStringValue(languageCode, appStringKey)
		},
		[languageCode],
	)

	return (
		<LocalizationContext.Provider
			value={{
				languageCode,
				setLanguageCode,
				localizeAppString,
			}}
		>
			{children}
		</LocalizationContext.Provider>
	)
}
