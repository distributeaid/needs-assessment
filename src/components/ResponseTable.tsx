import { useForm } from 'hooks/useForm'
import { isHidden, useResponse } from 'hooks/useResponse'
import type { MultiSelectQuestionFormat } from 'schema/types'

export const ResponseTable = () => {
	const { response } = useResponse()
	const { form } = useForm()
	return (
		<table className="table">
			<thead>
				<tr>
					<th>ID</th>
					<th>Answer</th>
				</tr>
			</thead>
			<tbody>
				{form?.sections.map((section) => {
					if (isHidden(section, response)) return null
					return (
						<>
							<tr>
								<th colSpan={2}>
									<abbr title={section.title}>
										<code>{section.id}</code>
									</abbr>
								</th>
							</tr>
							{section.questions.map((question) => {
								if (isHidden(question, response)) return null
								const v = response[section.id]?.[question.id]

								return (
									<tr>
										<td>
											<abbr title={question.title}>
												<code>
													{section.id}.{question.id}
												</code>
											</abbr>
										</td>
										{(() => {
											switch (question.format.type) {
												case 'text':
												case 'email':
													return <td>{v}</td>
												case 'positive-integer':
												case 'non-negative-integer':
													return (
														<td>
															<code>{v?.[0]}</code>{' '}
															<abbr
																title={
																	question.format.units.find(
																		({ id }) => id === v,
																	)?.title ?? ''
																}
															>
																<code>{v?.[1]}</code>
															</abbr>
														</td>
													)
												case 'single-select':
													return (
														<td>
															<abbr
																title={
																	question.format.options.find(
																		({ id }) => id === v,
																	)?.title ?? ''
																}
															>
																<code>{v}</code>
															</abbr>
														</td>
													)
												case 'multi-select':
													return (
														<td>
															<ul>
																{((v ?? []) as string[]).map((selected) => (
																	<li key={selected}>
																		<abbr
																			title={
																				(
																					question.format as MultiSelectQuestionFormat
																				).options.find(
																					({ id }) => id === selected,
																				)?.title ?? ''
																			}
																		>
																			<code>{selected}</code>
																		</abbr>
																	</li>
																))}
															</ul>
														</td>
													)
												default:
													return <td>{JSON.stringify(v)}</td>
											}
										})()}
									</tr>
								)
							})}
						</>
					)
				})}
			</tbody>
		</table>
	)
}
