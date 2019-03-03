import React, { useState, useEffect } from 'react'
import { axisBottom, axisLeft, scaleLinear, select, line, max } from 'd3'
import styled from 'styled-components'
import { timeFormat } from './shared-chart'

const AWS_COST = 3 / 60

const VIEWBOX_DIMENSIONS = [300, 200]

export default ({ currentTime }) => {
  const [vWidth, vHeight] = VIEWBOX_DIMENSIONS
  // These should be props or something
  const [count, setCount] = useState(0)
  const data = [[0, 0], [currentTime, (currentTime * AWS_COST) / 1000]]
  const maxDomain = Math.max(30000, data[data.length - 1][0])
  const xScale = scaleLinear()
    .domain([0, maxDomain])
    .range([0, vWidth])

  const maxRange = Math.max(2, data[data.length - 1][1])
  const yScale = scaleLinear()
    .domain([maxRange, 0])
    .range([0, vHeight])

  const xAxis = axisBottom(xScale)
    .ticks(4)
    .tickFormat(timeFormat)
  const yAxis = axisLeft(yScale)
    .ticks(2)
    .tickFormat(cents => {
      const d = Math.floor(cents / 100)
      let c = `${Math.floor(cents - d * 100)}`
      while (c.length < 2) {
        c = '0' + c
      }
      return `$${d}.${c}`
    })
  const livepeerLine = line(data)
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]))

  const axisBottomRef = ref => {
    select(ref).call(xAxis)
  }
  const axisLeftRef = ref => {
    select(ref).call(yAxis)
  }
  const livepeerLineRef = ref => {
    select(ref)
      .datum(data)
      .attr('d', livepeerLine)
  }

  const padding = 50
  const innerScale = (vWidth - padding * 2) / vWidth
  return (
    <ChartSVG viewBox={`0 0 ${vWidth} ${vHeight}`}>
      {/* "Padding" container */}
      {/* <rect width={vWidth} height={vHeight} /> */}
      <g transform={`scale(${innerScale}), translate(${padding}, ${padding})`}>
        <g ref={axisLeftRef} />
        <g ref={axisBottomRef} transform={`translate(0, ${vHeight})`} />
        <LinePath innerRef={livepeerLineRef} />
      </g>
    </ChartSVG>
  )
}

const ChartSVG = styled.svg`
  user-select: none;
`

const LinePath = styled.path`
  stroke: #005689;
  stroke-width: 2px;
  fill: none;
`
