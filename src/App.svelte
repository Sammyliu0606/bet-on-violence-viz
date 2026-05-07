<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { settleSimulation, settleViolenceSimulation, settleViolenceSplitSimulation, radiusScale, categoryColor, avgRadiusScale } from './lib/simulation.js';
  import { generateMonthTicks } from './lib/ticks.js';
  import Scrolly from './components/Scrolly.svelte';
  import MarketGrid from './components/MarketGrid.svelte';
  import { scrollSteps } from './data/scrollSteps.js';
  import TooltipCallout from './components/TooltipCallout.svelte';
  import ViolenceBubbles from './components/ViolenceBubbles.svelte';


  // reactive variables
  let events = [];
  let nodes = [];
  let xScale;
  let monthTicks = [];
  let ready = false; // whether simulation (node positions) has settled and is ready to render

  let currentStep = 0; // for scrolly
  let pastHero = false; // hide bubble chart until after hero section
  let categorySummary = {};
  let violenceNodes = [];

  // canvas size
  const WIDTH = 2000;   // full timeline canvas width
  const HEIGHT = 1000;


  onMount(async () => {
    try {
      const url = '/data/events.json';
      const res = await fetch(url);
      const json = await res.json();
      events = json.events;

      const statsRes = await fetch('/data/category_stats.json');
      const statsJson = await statsRes.json();
      categorySummary = statsJson;

      // Only opening bubbles first (>3M, all categories)
      const opening = events.filter(e => e.over_3million);
      const result = settleSimulation(opening, WIDTH, HEIGHT);
      nodes = result.nodes;
      xScale = result.xScale;
      monthTicks = generateMonthTicks(xScale);

      const violenceRes = await fetch('/data/violent_coercion_crisis_eventsforviz.json');
      const violenceJson = await violenceRes.json();
      const violenceResult = settleViolenceSimulation(violenceJson.events, WIDTH, HEIGHT);
      const splitPositions = settleViolenceSplitSimulation(violenceJson.events, WIDTH, HEIGHT);
      // @ts-ignore
      violenceNodes = violenceResult.nodes.map((n, i) => ({
        ...n,
        splitX: splitPositions[i].splitX,
        splitY: splitPositions[i].splitY,
      }));

      ready = true;

      window.addEventListener('scroll', () => {
        pastHero = window.scrollY > window.innerHeight * 0.8;
      });

      const observer = new IntersectionObserver(
        ([entry]) => { methodologyVisible = entry.isIntersecting; },
        { threshold: 0.1 }
      );
      if (methodologyEl) observer.observe(methodologyEl);

    } catch (err) {
      console.error('onMount failed:', err);
    }
    
  });
  
  let gEl;
  /** @type {HTMLDivElement | null} */ let methodologyEl = null;
  let methodologyVisible = false;
  const VIEWPORT_WIDTH = window.innerWidth;

// React whenever currentStep changes
  $: if (gEl && xScale && nodes.length) {
    panToStep(currentStep);
  }
  function calcProgress(step) {
    const target = scrollSteps[step];
    if (!target || !target.date) return 100;
    const start = new Date('2025-01-01').getTime();
    const end = new Date('2025-12-31').getTime();
    const current = new Date(target.date).getTime();
    return ((current - start) / (end - start)) * 100;
  }
  $: progressPercent = calcProgress(currentStep);

  $: accumulatedIds = (currentStep >= 1 && currentStep <= 4)
    ? scrollSteps.slice(1, currentStep + 1).flatMap(s => s.highlightIds ?? [])
    : [];
  $: highlightedNodes = accumulatedIds.length
    ? nodes.filter(n => accumulatedIds.includes(String(n.id)))
    : [];

  $: currentScale = scrollSteps[currentStep]?.scale ?? 1;
  $: showColors = currentStep >= 6;
  $: showCollapse = currentStep === 12;
  $: categoryLookup = Object.fromEntries(
    (categorySummary.categories ?? []).map(c => [c.category, c])
  );
  $: collapseNodes = showCollapse ? [
  {
    label: 'Neutral',
    avg: categoryLookup['Neutral']?.average_volume ?? 0,
    color: '#cccccc',
    x: WIDTH * 0.2,
    y: HEIGHT * 0.5,
  },
  {
    label: 'Crisis',
    avg: categoryLookup['Crisis']?.average_volume ?? 0,
    color: '#feb531',
    x: WIDTH * 0.4,
    y: HEIGHT * 0.5,
  },
  {
    label: 'Coercion',
    avg: categoryLookup['Coercion']?.average_volume ?? 0,
    color: '#ff7e2f',
    x: WIDTH * 0.6,
    y: HEIGHT * 0.5,
  },
  {
    label: 'Violence',
    avg: categoryLookup['Violence']?.average_volume ?? 0,
    color: '#f11665',
    x: WIDTH * 0.8,
    y: HEIGHT * 0.5,
  },
] : [];
$: showChartUI = currentStep < 12;
$: showViolenceAll = currentStep >= 13;
$: showViolenceSplit = currentStep >= 15 && currentStep <= 16;

function panToStep(step) {
    const target = scrollSteps[step];
    if (!target) return;

    let translateX, translateY, scale;

    if (target.date === null) {
      // Zoom out — fit whole timeline in viewport
      scale = 0.65;
      translateX = 0;
      translateY = 100;
    } else {
      scale = target.scale;
      // Center the target date in the viewport
      const targetX = xScale(new Date(target.date));
      translateX = VIEWPORT_WIDTH / 2 - targetX * scale;
      translateY = -800;

      console.log('translateX:', translateX, 'translateY:', translateY, 'scale:', scale);
    }

    d3.select(gEl)
      .interrupt()
      .transition()
      .duration(1200)
      .ease(d3.easeQuadInOut)
      .attr('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);
  }

</script>

<MarketGrid />

<div class="layout">
  <!-- Viz takes full width -->
  <div class="viz-container" style="opacity: {pastHero && !methodologyVisible ? 1 : 0}; transition: opacity 0.8s ease;">
      <svg width={WIDTH} height={HEIGHT} style="overflow:visible">
        <g bind:this={gEl}>
          <!-- Monthly gridlines -->
          {#if showChartUI}
            <g class="gridlines">
              {#each monthTicks as tick, i}
                <line
                  x1={tick.x}
                  y1={190}
                  x2={tick.x}
                  y2={HEIGHT}
                  stroke="#e0e0e0"
                  stroke-width="1"
                />
                <text
                  x={tick.x}
                  y={HEIGHT +30}
                  text-anchor="middle"
                  font-family="Inter, sans-serif"
                  font-size="18"
                  fill="#aaa"
                >{tick.label}</text>
                {#if i === 0}
                  <text
                    x={tick.x - 30}
                    y={HEIGHT + 30}
                    text-anchor="end"
                    font-family="Inter, sans-serif"
                    font-size="18"
                    fill="#666"
                  >market open at</text>
                {/if}
              {/each}
            </g>
          {/if}
          <!-- circles on top -->
          {#each nodes as node}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={showColors ? (categoryColor[node.final_pred] ?? '#d1d1d1') : '#d1d1d1'}
              opacity={showCollapse || showViolenceAll ? 0 : 1}
              style="transition: opacity 0.8s ease"
            />
          {/each}
          <!-- Collapse bubbles — only visible on step 12+ -->
          {#if showCollapse}
            {#each collapseNodes as cn}
              <circle
                cx={cn.x}
                cy={cn.y+90}
                r={avgRadiusScale(cn.avg)}
                fill={cn.color}
                opacity={1}
                class="collapse-bubble"
              />
              <text
                x={cn.x}
                y={cn.y - avgRadiusScale(cn.avg)+65}
                text-anchor="middle"
                font-family="Inter, sans-serif"
                font-size="30"
                font-weight="600"
                fill="#333"
              >{cn.label}</text>
              <text
                x={cn.x}
                y={cn.y + avgRadiusScale(cn.avg) + 130}
                text-anchor="middle"
                font-family="Inter, sans-serif"
                font-size="30"
                fill="#666"
              >${(cn.avg / 1000).toFixed(0)}K avg</text>
            {/each}
          {/if}

          <!-- All violence/coercion/crisis — step 13+ -->
          {#if showViolenceAll}
            <ViolenceBubbles
              {violenceNodes}
              {showViolenceSplit}
              currentScale={currentScale}
              {WIDTH}
              {HEIGHT}
            />
          {/if}

          <!-- Highlight Tooltips -->
          {#each highlightedNodes as node}
            <TooltipCallout
              bubbleX={node.x}
              bubbleY={node.y}
              bubbleR={node.r}
              data={node}
              scale={currentScale}
              svgWidth={WIDTH}
            />
          {/each}
        </g>
      </svg>

      {#if showChartUI}
        <div class="fixed-labels">
          <div class="chart-title">Prediction market events, 2025</div>
          <div class="chart-subtitle">Showing events over $3M only.</div>
          <svg width="185" height="95" style="display:block; margin-top:8px; overflow:visible;">
            <text x="0" y="12" font-family="Inter, sans-serif" font-size="12" fill="#999" text-anchor="start">Total volume traded</text>
            <!-- bottom-align all circles at y=75 -->
            <circle cx="20"  cy={75 - radiusScale(10_000_000)}   r={radiusScale(10_000_000)}   fill="none" stroke="#ccc" stroke-width="1"/>
            <text   x="20"  y="88" font-family="Inter, sans-serif" font-size="12" fill="#aaa" text-anchor="middle">$10M</text>
            <circle cx="75"  cy={75 - radiusScale(50_000_000)}  r={radiusScale(50_000_000)}  fill="none" stroke="#ccc" stroke-width="1"/>
            <text   x="75"  y="88" font-family="Inter, sans-serif" font-size="12" fill="#aaa" text-anchor="middle">$50M</text>
            <circle cx="150" cy={75 - radiusScale(250_000_000)} r={radiusScale(250_000_000)} fill="none" stroke="#ccc" stroke-width="1"/>
            <text   x="150" y="88" font-family="Inter, sans-serif" font-size="12" fill="#aaa" text-anchor="middle">$250M</text>
          </svg>
        </div>
      {/if}


      {#if ready && currentStep < 5}
      <div class="timeline-indicator">
        <span class="timeline-start">Jan 2025</span>
        <div class="timeline-track">
          <div class="timeline-thumb" style="left: {progressPercent}%"></div>
        </div>
        <span class="timeline-end">Dec 2025</span>
      </div>
    {/if}
  </div>

  <!-- Steps overlay on top of viz -->
  <div class="steps-container">
  <Scrolly bind:currentStep>
    {#each scrollSteps as step}
      <div class="step">
        {#if step.text}
          <div class="step-content">{@html step.text}</div>
        {/if}
      </div>
    {/each}
  </Scrolly>
  <div class="methodology" bind:this={methodologyEl}>
    <p><strong>Methodology</strong></p>
    <p>I acquired 591,736 market-level records from Polymarket and 17,798,458 from Kalshi through their public APIs. These were then aggregated to approximately 4.6 million events for analysis. Markets under the same event, for example, "Will the US confirm that aliens exist by May 31?", "Will the US confirm that aliens exist by June 30?" and "Will the US confirm that aliens exist by September 30?", are grouped into one "Will the US confirm that aliens exist by…?" event. Both platforms were initially collected from January 1, 2025 through March 20, 2026. However, due to API restrictions, Kalshi data was only available through December 31, 2025. All analysis was conducted on 2025 data only, with 2026 records used solely for model training. Monthly trading volume data for Polymarket was sourced separately from Dune.com, a public blockchain analytics platform.</p>
    <p>To classify prediction market data, I trained two AI classifiers: DistilBERT and SetFit and fine-tuned both models to learn the four-category schema I developed through manually reviewing over one thousand events and observing patterns in how markets were designed to resolve based on human suffering. Since every market resolves as yes or no, markets with opposite framing were treated as the same category. For example, "will someone be freed before 2027" and "will someone be in prison before 2027" both belong to "coercion required" category.</p>
    <div class="schema-list">
    <p>Classification schema</p>
    <p><strong>Violence Required:</strong> Resolution requires a specific violent act to occur or specific target to be harmed, such as a military strike, coup attempt and war declaration. We exclude policies that plausibly enable violence and demonstrations of military capability.</p>
    <p><strong>Coercion Required:</strong> Resolution requires state coercion, such as arrest, imprisonment, deportation, detention or forcible removal against a specific target. We excluded policies that could plausibly lead to coercion and legal determinations of guilt.</p>
    <p><strong>Market relates to ongoing crisis:</strong> 1. Resolution could plausibly include violence or coercion, though peaceful paths also exist such as the removal of an authoritarian leader from power or territorial change. We exclude the removal of power when there is a democratic and stable succession mechanism. 2. Resolution directly measures or could affect an ongoing crisis outcome such as disaster scale, conflict endpoint, humanitarian aid, foreign intervention.</p>
    <p><strong>Neutral:</strong> No direct relationship to human suffering—policy announcements, capability demonstrations, legal proceedings, standard politics, economics, entertainment.</p>
    </div>
    <p>Trained on 1,119 manually labeled samples, DistilBERT and SetFit both achieved 96% accuracy on the test dataset. The crisis category proved most difficult to classify, with both models achieving around 70 to 73% accuracy — the best attainable given the category's inherently ambiguous boundaries. To improve performance, I iteratively refined the classification schema using a validation set before final test set evaluation. When the two classifiers contradicted each other, I manually reviewed each case and made the final determination. This manual review process captured a significant number of crisis-category events that the models alone would have missed. All other categories were classified with at least 92% and at most 100% accuracy.</p>
    <p>Polymarket markets are traded in USDC (USD coin), a stablecoin pegged to the US dollar, while Kalshi markets are traded in USD. All volume figures are reported in aggregate, treating USDC and USD as equivalent given their 1:1 ped to the US dollar.</p>
  </div>
</div>
</div>

<!-- Debug: confirm currentStep is updating -->
<div class="debug-step">Current step: {currentStep}</div>

<style>
.methodology {
  min-height: 100vh;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.78rem;
  line-height: 1.7;
  color: #999;
  pointer-events: all;
}

.methodology p {
  margin-bottom: 1.5rem;
}

.methodology .schema-list {
  margin-bottom: 0.8rem;
}

.methodology .schema-list p {
  margin-bottom: 0.4rem;
}

.header {
  max-width: 680px;
  margin: 0 auto;
  padding: 4rem 2rem 3rem;
  text-align: center;
}

h1 {
  font-family: 'Inter', sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1.15;
  color: #111;
  margin: 0 0 1rem;
}

.byline {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 2rem;
}



.layout {
  position: relative;  /* so steps-container can position against it */
  width: 100%;
}

.viz-container {
  position: fixed;
  top: 0;
  width: 100%;        /* full width now */
  height: 100vh;
  overflow: visible;
  display: flex;
  align-items: center;
  z-index: 0;
  transform: translateX(-4rem);
}

.steps-container {
  position: absolute;  /* sits on top of viz */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;        /* above the viz */
  pointer-events: none; /* clicks pass through to viz */
  padding-top: 100vh; /* so first step starts after one full viewport height, adjust as needed */
}

.step {
  height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 3rem 0 0;
}

.step-content {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: left;
  max-width: 300px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #333;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  pointer-events: all; /* text box itself is still clickable */
}

.step-content :global(p + p) {
  margin-top: 0.75rem;
}

.debug-step {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  font-family: monospace;
  font-size: 12px;
  color: #999;
  background: white;
  padding: 4px 8px;
  border: 1px solid #eee;
  z-index: 100;
}

.fixed-labels {
  position: absolute;
  text-align: left;
  top: 1.5rem;
  left: 1.5rem;
  pointer-events: none;
  z-index: 5;
}

.chart-title {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.chart-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #999;
}

.timeline-indicator {
  position: absolute;
  bottom: 2rem;
  left: calc(50% + 3rem);
  transform: translateX(-80%);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 20;
}

.timeline-start,
.timeline-end {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #999;
  white-space: nowrap;
}

.timeline-track {
  width: 200px;
  height: 2px;
  background: #e0e0e0;
  border-radius: 2px;
  position: relative;
}

.timeline-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: #333;
  border-radius: 50%;
  transition: left 0.8s ease;  /* matches pan transition duration */
}

:global(.tag) {
  display: inline;
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: 500;
}

:global(.tag.violence) {
  background: rgba(192, 57, 43, 0.12);
  color: #f11665;
}

:global(.tag.coercion) {
  background: rgba(224, 123, 57, 0.12);
  color: #ff7e2f;
}

:global(.tag.crisis) {
  background: rgba(212, 168, 67, 0.12);
  color: #feb531;
}

.collapse-bubble {
  animation: collapse-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  transform-box: fill-box;
  transform-origin: center;
}

@keyframes collapse-in {
  0% {
    transform: scale(4);
    opacity: 0;
  }
  60% {
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 0.85;
  }
}

</style>