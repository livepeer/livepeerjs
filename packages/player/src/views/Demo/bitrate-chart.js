import React, { useState, useEffect } from 'react'
import { axisBottom, axisLeft, scaleLinear, select, line, max } from 'd3'
import styled from 'styled-components'
import { timeFormat } from './shared-chart'

const AWS_COST = 3 / 60

const VIEWBOX_DIMENSIONS = [300, 200]

export default ({ bitrates, currentTime }) => {
  const [vWidth, vHeight] = VIEWBOX_DIMENSIONS
  // These should be props or something
  const [count, setCount] = useState(0)

  let totalDuration = 0
  let maxSize = 0
  const data = !bitrates[0]
    ? [[0, 0]]
    : bitrates[0].segments
        .map((segment, i) => {
          const myStart = totalDuration
          totalDuration += segment.duration * 1000
          maxSize = Math.max(maxSize, segment.size)
          return [
            myStart,
            ...bitrates.map(
              bitrate => bitrate.segments[i] && bitrate.segments[i].size,
            ),
          ]
        })
        .filter(column => column.every(val => val !== undefined))

  let maxDomain = Math.max(30, data[data.length - 1][0])
  if (maxDomain > currentTime) {
    maxDomain = currentTime
  }
  const xScale = scaleLinear()
    .domain([0, maxDomain])
    .range([0, vWidth])

  const maxRange = Math.max(2, maxSize)
  const yScale = scaleLinear()
    .domain([maxRange, 0])
    .range([0, vHeight])

  const xAxis = axisBottom(xScale)
    .ticks(4)
    .tickFormat(timeFormat)
  const yAxis = axisLeft(yScale)
    .ticks(2)
    .tickFormat(rate => `${Math.round(rate / 1024 / 1024)}mbps`)

  const lines = data[0].slice(1).map((_, i) =>
    line(data)
      .x(d => xScale(d[0]))
      .y(d => yScale(d[i + 1])),
  )
  // const livepeerLine = line(data)
  // .x(d => xScale(d[0]))
  // .y(d => yScale(d[1]))

  const axisBottomRef = ref => {
    select(ref).call(xAxis)
  }
  const axisLeftRef = ref => {
    select(ref).call(yAxis)
  }
  // const livepeerLineRef = (ref, line) => {
  //   select(ref)
  //     .datum(data)
  //     .attr('d', livepeerLine)
  // }

  const padding = 50
  const clipPath = `polygon(0 0, 101% 0, 101% 100%, 0 100%)`
  const innerScale = (vWidth - padding * 2) / vWidth
  return (
    <ChartSVG viewBox={`0 0 ${vWidth} ${vHeight}`}>
      {/* "Padding" container */}
      {/* <rect width={vWidth} height={vHeight} /> */}
      <g
        transform={`scale(${innerScale}), translate(${padding}, ${padding})`}
        style={{ clipPath }}
      >
        <g ref={axisLeftRef} />
        <g ref={axisBottomRef} transform={`translate(0, ${vHeight})`} />
        {lines.map((line, i) => (
          <LinePath
            key={i}
            innerRef={ref =>
              select(ref)
                .datum(data)
                .attr('d', line)
            }
          />
        ))}
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
