import { FormSelector } from 'components/FormSelector'
import { useAppConfig } from 'hooks/useAppConfig'
import { useStoredForm } from 'hooks/useStoredForm'

export const ulidRegEx = /[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}/

export const Download = () => {
	const { storageUrl } = useAppConfig()
	const { formUrl } = useStoredForm()

	return (
		<>
			<h1>Download submissions</h1>
			<p>
				To download all submission for the current form, click <em>export</em>.
			</p>
			<div className="d-flex d-flex">
				<FormSelector />
				<button
					type="button"
					className="btn btn-primary ms-3"
					onClick={() => {
						fetch(new URL('/assessment/export', storageUrl).toString(), {
							method: 'POST',
							body: JSON.stringify({ form: formUrl.toString() }),
							mode: 'cors',
							credentials: 'include',
							headers: {
								'content-type': 'application/json; charset=utf-8',
							},
						})
							.then(async (res) => res.text())
							.then((data) => {
								const file = new File(
									[data],
									`${
										ulidRegEx.exec(formUrl.toString())?.[0] ?? ''
									}-submissions-${new Date().toISOString().slice(0, 19)}.tsv`,
								)
								const link = document.createElement('a')
								link.style.display = 'none'
								link.href = URL.createObjectURL(file)
								link.download = file.name

								document.body.appendChild(link)
								link.click()

								setTimeout(() => {
									URL.revokeObjectURL(link.href)
									link.parentNode?.removeChild(link)
								}, 0)
							})
							.catch(console.error)
					}}
				>
					export
				</button>
			</div>
		</>
	)
}
