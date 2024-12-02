import { useLocalizationContext } from 'hooks/useLocalization'
import { Link } from 'react-router-dom'

export const Instructions = () => {
	const { localizeAppString } = useLocalizationContext()
	return (
		<main className="container mt-4">
			<div className="row justify-content-center">
				<section className="col-md-10 col-lg-6">
					<h1>{localizeAppString('instructions_title')}</h1>
					<ol>
						<li>{localizeAppString('instructions_1')}</li>
						<li>{localizeAppString('instructions_2')}</li>
						<li>{localizeAppString('instructions_3')}</li>
						<li>{localizeAppString('instructions_4')}</li>
						<li>{localizeAppString('instructions_5')}</li>
					</ol>

					<p className="d-flex justify-content-end">
						<Link className="btn btn-primary" to="/assessment">
							{localizeAppString('instructions_button')}
						</Link>
					</p>
				</section>
			</div>
		</main>
	)
}
