import { AMChart } from 'components/AMChart'
import { FormSelector } from 'components/FormSelector'
import { useStoredForm } from 'hooks/useStoredForm'
import { useEffect, useState } from 'react'

export const Summary = () => {
	const { formUrl } = useStoredForm()

	const [summary, setSummary] = useState<{
		stats: {
			count: number
		}
		summary: Record<string, Record<string, Record<string, number>>>
	}>()

	useEffect(() => {
		fetch(`${formUrl.toString()}/summary?ts=${Date.now()}`, {
			cache: 'no-store',
		})
			.then(async (res) => res.json())
			.then(({ stats, summary }) => {
				setSummary({ stats, summary })
			})
			.catch(console.error)
	}, [formUrl])

	const sectionSummary = Object.entries(summary?.summary?.shelter ?? {}).map(
		([category, { items }]) => ({ value: items, category }),
	)

	return (
		<main className="container mt-4">
			<div className="row justify-content-center">
				<section className="col-md-12">
					<AMChart data={sectionSummary} />
				</section>
			</div>
			<div className="row justify-content-center">
				<aside className="col-md-12">
					<hr />
					<FormSelector />
					<dl className="mt-4">
						<dt>Form</dt>
						<dd>
							<code>{formUrl.toString()}</code>
						</dd>
						{summary?.stats !== undefined && (
							<>
								<dt>Responses</dt>
								<dd>{summary.stats.count}</dd>
							</>
						)}
					</dl>
				</aside>
			</div>
		</main>
	)
}
