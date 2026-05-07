<script>
  import { violenceRadiusScale, categoryColor } from '../lib/simulation.js';
  import TooltipCallout from './TooltipCallout.svelte';

  export let violenceNodes;
  export let showViolenceSplit;
  export let currentScale;
  export let WIDTH;
  export let HEIGHT;

  /** @type {any} */
  let hoveredNode = null;
</script>

<text
  x={WIDTH * 0.65 + 80}
  y={30}
  text-anchor="middle"
  font-family="Inter, sans-serif"
  font-size="30"
  font-weight="600"
  fill="#333"
>Prediction Market Events Tied to Violence, Coercion, and Crisis, 2025</text>

{#each violenceNodes as node, i}
  <circle
    cx={showViolenceSplit ? node.splitX : node.x + 80}
    cy={showViolenceSplit ? node.splitY : node.y + 60}
    r={violenceRadiusScale(node.volume)}
    fill={categoryColor[node.final_pred]}
    opacity={1}
    class="violence-bubble"
    style="animation-delay: {i * 0.001}s"
    role="img"
    aria-label={node.title}
    on:mouseenter={() => hoveredNode = node}
    on:mouseleave={() => hoveredNode = null}
  />
{/each}

{#if showViolenceSplit}
  <text x={WIDTH * 0.6} y={HEIGHT * 0.05 + 20} text-anchor="middle" font-family="Inter, sans-serif" font-size="20" font-weight="400" fill="#333">Polymarket</text>
  <text x={WIDTH * 0.93} y={HEIGHT * 0.53} text-anchor="middle" font-family="Inter, sans-serif" font-size="20" font-weight="400" fill="#333">Kalshi</text>
{/if}

{#if hoveredNode}
  <TooltipCallout
    bubbleX={showViolenceSplit ? hoveredNode.splitX : hoveredNode.x + 80}
    bubbleY={showViolenceSplit ? hoveredNode.splitY : hoveredNode.y + 60}
    bubbleR={violenceRadiusScale(hoveredNode.volume)}
    data={hoveredNode}
    scale={currentScale}
    svgWidth={WIDTH}
    resolutionDesc={hoveredNode.resolution_description}
  />
{/if}

<style>
  .violence-bubble {
    animation: fade-in 0.4s ease forwards;
    opacity: 0;
    transition: cx 1.2s ease, cy 1.2s ease;
  }

  @keyframes fade-in {
    to { opacity: 0.8; }
  }
</style>
