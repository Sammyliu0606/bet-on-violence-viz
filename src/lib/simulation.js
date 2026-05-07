// @ts-nocheck
// Prepare nodes with deterministic starting position and size (x, y, and r)

import * as d3 from 'd3'

export const radiusScale = d3.scaleSqrt()
    .domain([0, 750_000_000])
    .range([1, 50]);

export const categoryColor = {
    Violence: '#f11665',
    Coercion: '#ff7e2f',
    Crisis: '#feb531',
    Neutral: '#cccccc'
};

export function settleSimulation(events, width, height){
    const xScale = d3.scaleTime()
        .domain(d3.extent(events, d => new Date(d.open_time))) //Get [datemin, datemax]
        .range([10, width-10]);

    const nodes = events.map((d, i) => ({
        ...d,
        x: xScale(new Date(d.open_time)) + (i % 7 - 3) * 3, // lots of events share the same open_time, so add a small random jitter based on index to spread them out horizontally
        y: d.platform === 'kalshi'
            ? height * 0.35 //Kalshi events above the middle line
            : height * 0.65, //Polymarket events below the middle line
        r: radiusScale(d.volume)
    }));

    const sim = d3.forceSimulation(nodes)
        .force('x', d3.forceX(d => xScale(new Date(d.open_time))).strength(0.9)) // strongly pull towards the x position based on open_time
        .force('y', d3.forceY(d => d.platform === 'Kalshi'
        ? height * 0.35
        : height * 0.65).strength(0.3)) // weakly pull towards the respective platform line to keep Kalshi and Polymarket events separated
        .force('collide', d3.forceCollide(d => d.r + 1).strength(1)) // each bubble maintains its radius + 1.5px gap from neighbors
        .stop();
    
    for (let i = 0; i < 700; i++) sim.tick();

    return {nodes, xScale};
}

export const avgRadiusScale = d3.scaleSqrt()
  .domain([0, 2_000_000])  // max avg is ~1.5M (Crisis)
  .range([10, 200]);


export const violenceRadiusScale = d3.scaleSqrt()
  .domain([0, 70_000_000])
  .range([5, 100]);

export function settleViolenceSimulation(events, width, height) {
  const cx = width * 0.65;
  const cy = height * 0.6;

  const nodes = events.map(d => ({
    ...d,
    x: cx + (Math.random() - 0.5) * 100,
    y: cy + (Math.random() - 0.5) * 100,
    r: violenceRadiusScale(d.volume)
  }));

  const sim = d3.forceSimulation(nodes)
    .force('x', d3.forceX(cx).strength(0.12))
    .force('y', d3.forceY(cy).strength(0.12))
    .force('collide', d3.forceCollide(d => d.r + 2).strength(1))
    .stop();

  for (let i = 0; i < 600; i++) sim.tick();

  return { nodes };
}

export function settleViolenceSplitSimulation(events, width, height) {
  const cxPoly   = width * 0.6;
  const cxKalshi = width * 0.93;
  const cy = height * 0.63;

  // Run one combined simulation so collision forces prevent cross-cluster overlap
  const nodes = events.map((d, i) => ({
    ...d,
    _i: i,
    x: (d.platform === 'kalshi' ? cxKalshi : cxPoly) + (Math.random() - 0.5) * 100,
    y: cy + (Math.random() - 0.5) * 100,
    r: violenceRadiusScale(d.volume)
  }));

  const sim = d3.forceSimulation(nodes)
    .force('x', d3.forceX(d => d.platform === 'kalshi' ? cxKalshi : cxPoly).strength(0.15))
    .force('y', d3.forceY(cy).strength(0.15))
    .force('collide', d3.forceCollide(d => d.r + 2).strength(1))
    .stop();

  for (let i = 0; i < 700; i++) sim.tick();

  const result = new Array(events.length);
  for (const n of nodes) {
    result[n._i] = { splitX: n.x, splitY: n.y };
  }
  return result;
}