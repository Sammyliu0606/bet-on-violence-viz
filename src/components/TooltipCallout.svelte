<script>
  export let bubbleX;
  export let bubbleY;
  export let bubbleR;
  export let data;
  export let scale = 1;
  export let svgWidth = 2000;
  export let resolutionDesc = null;

  const BOX_WIDTH = 240;
  const OFFSET = 20;
  const MAX_H = 300;  // max foreignObject height in visual px

  $: scaledWidth = BOX_WIDTH / scale;
  $: scaledOffset = OFFSET / scale;
  $: scaledMaxH = MAX_H / scale;

  // Flip below the bubble if there isn't room above
  $: placeBelow = (bubbleY - bubbleR - scaledOffset - scaledMaxH) < 0;

  // foreignObject: bottom edge = arrowY1 when above; top edge = arrowY1 when below
  $: arrowY1 = placeBelow
    ? bubbleY + bubbleR + scaledOffset
    : bubbleY - bubbleR - scaledOffset;

  $: foY = placeBelow ? arrowY1 : arrowY1 - scaledMaxH;
  $: boxX = Math.max(10, Math.min(bubbleX - scaledWidth / 2, svgWidth - scaledWidth - 10));
  $: arrowY2 = placeBelow ? bubbleY + bubbleR : bubbleY - bubbleR;

  $: fs = (/** @type {number} */ px) => `${px / scale}px`;
</script>

<g class="tooltip-callout">
  <!-- Highlight ring around bubble -->
  <circle
    cx={bubbleX}
    cy={bubbleY}
    r={bubbleR + 3}
    fill="none"
    stroke="#333"
    stroke-width={1.5 / scale}
  />

  <!--
    foreignObject spans MAX_H px above (or below) the arrow endpoint.
    The inner flex wrapper pushes the tooltip box to the edge that touches the arrow.
  -->
  <foreignObject x={boxX} y={foY} width={scaledWidth} height={scaledMaxH}>
    <div class="fo-wrap" style="height: {scaledMaxH}px; display: flex; flex-direction: column; justify-content: {placeBelow ? 'flex-start' : 'flex-end'};">
      <div class="tooltip-box" style="font-size: {fs(15)}; padding: {12/scale}px">
        <p class="tooltip-title">{data.title}</p>
        <div class="tooltip-meta">
          <div class="tooltip-meta-left">
            <span class="tooltip-date">Open at {data.open_time}</span>
            <span class="tooltip-volume">$ {data.volume.toLocaleString()} Vol.</span>
          </div>
          <span class="tooltip-platform">{data.platform}</span>
        </div>
        {#if resolutionDesc}
          <p class="tooltip-desc">{resolutionDesc}</p>
        {/if}
      </div>
    </div>
  </foreignObject>

  <!-- Line rendered last so it draws on top of the tooltip box -->
  <line
    x1={bubbleX}
    y1={arrowY1}
    x2={bubbleX}
    y2={arrowY2}
    stroke="#999"
    stroke-width={2 / scale}
  />
</g>

<style>
  .fo-wrap {
    box-sizing: border-box;
  }

  .tooltip-box {
    background: white;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.12);
    border: 1px solid #eee;
    font-family: 'Inter', sans-serif;
    box-sizing: border-box;
  }

  .tooltip-title {
    font-size: 1em;
    font-weight: 700;
    text-align: left;
    color: #111;
    margin: 0 0 4px;
    line-height: 1.5;
  }

  .tooltip-date {
    font-size: 0.8em;
    color: #999;
    margin: 0;
    padding: 1.5px 0;
    display: block;
  }

  .tooltip-volume {
    font-size: 0.8em;
    text-align: left;
    color: #999;
    margin: 0;
    padding: 1.5px 0;
    display: block;
  }

  .tooltip-meta {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 4px;
  }

  .tooltip-meta-left {
    display: flex;
    flex-direction: column;
    gap: 0;
    line-height: 1;
  }

  .tooltip-platform {
    font-size: 0.9em;
    font-weight: 600;
    color: #111;
    text-transform: capitalize;
  }

  .tooltip-desc {
    font-size: 0.85em;
    text-align: left;
    color: #555;
    line-height: 1.5;
    margin: 4px 0 0;
  }
</style>
