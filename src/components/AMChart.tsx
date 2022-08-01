import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import { nanoid } from 'nanoid'
import { useLayoutEffect, useRef } from 'react'

export const AMChart = ({
	data,
	className,
}: {
	data: { value: number; category: string }[]
	className?: string
}) => {
	const id = useRef<string>(nanoid())

	useLayoutEffect(() => {
		const root = am5.Root.new(id.current)
		const chart = root.container.children.push(am5xy.XYChart.new(root, {}))

		const labelAxis = chart.xAxes.push(
			am5xy.CategoryAxis.new(root, {
				categoryField: 'category',
				renderer: am5xy.AxisRendererX.new(root, {}),
			}),
		)

		const valueAxes = chart.yAxes.push(
			am5xy.ValueAxis.new(root, {
				renderer: am5xy.AxisRendererY.new(root, {}),
			}),
		)

		const series = chart.series.push(
			am5xy.ColumnSeries.new(root, {
				xAxis: labelAxis,
				yAxis: valueAxes,
				valueYField: 'value',
				tooltip: am5.Tooltip.new(root, {
					labelText: '{valueY}',
				}),
				categoryXField: 'category',
			}),
		)

		series.data.setAll(data)
		labelAxis.data.setAll(data)

		chart.set(
			'cursor',
			am5xy.XYCursor.new(root, {
				snapToSeries: [series],
				xAxis: labelAxis,
			}),
		)

		return () => {
			root.dispose()
		}
	}, [data, id])

	return (
		<div
			style={{ width: '100%', height: '400px' }}
			id={id.current}
			className={`chart ${className ?? ''}`}
		/>
	)
}
