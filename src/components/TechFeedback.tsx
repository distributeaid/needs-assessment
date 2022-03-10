import { useAppConfig } from 'hooks/useAppConfig'

export const TechFeedback = () => {
	const { issues } = useAppConfig()
	return (
		<p>
			For technical feedback or ideas for improvements, please consider{' '}
			<a href={issues.toString()} target="_blank" rel="noreferrer">
				opening an issue
			</a>{' '}
			in the GitHub repository for this project.
		</p>
	)
}
