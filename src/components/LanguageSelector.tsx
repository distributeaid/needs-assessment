import { useLocalizationContext } from 'hooks/useLocalization'
import { FunctionComponent } from 'react'
import { appStrings, LanguageCodeKeys } from 'schema/localizationTypes'

type LangValuesForDropdown = {
	code: LanguageCodeKeys
	displayName: string
}

export const LanguageSelector: FunctionComponent = () => {
	const { languageCode, setLanguageCode } = useLocalizationContext()
	const languageValues: LangValuesForDropdown[] = Array.from(
		appStrings.entries(),
	).map(([langKey, appStringEntry]) => ({
		code: langKey,
		displayName: appStringEntry.language,
	}))

	return (
		<select
			value={languageCode}
			className="form-control"
			onChange={({ target: { value } }) =>
				setLanguageCode(value as LanguageCodeKeys)
			}
		>
			{languageValues.map(({ code, displayName }) => (
				<option key={code} value={code}>
					{displayName}
				</option>
			))}
		</select>
	)
}
