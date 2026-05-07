<script>
  const row1 = [
    { title: "Xi Jinping out in 2025?", yes: 23, trend: "down" },
    { title: "US military action against Iran before July?", yes: 46, trend: "up" },
    { title: "How many people will Trump deport in 2025?", yes: 11, trend: "down" },
    { title: "Next US x Venezuela military engagement on...? ", yes: 16, trend: "up" },
    { title: "Fordow nuclear facility destroyed before July?", yes: 7, trend: "down" },
    { title: "1,000+ Measles cases in U.S. before May?", yes: 59, trend: "up" },
  ];

  const row2 = [
    { title: "Trump strikes another drug boat by Sep 30?", yes: 10, trend: "down" },
    { title: "Thailand strikes Cambodia by Friday?", yes: 34, trend: "up" },
    { title: "Will Russia capture Yablunivka before July?", yes: 18, trend: "up" },
    { title: "Will Trump jail Kamala Harris?", yes: 41, trend: "down" },
    { title: "Major cyberattack on Iran in June?", yes: 29, trend: "up" },
    { title: "Another Houthi strike on Israel in May?", yes: 8, trend: "down" },
  ];

  const row3 = [
    { title: "How many acres will Palisades wildfire burn in total?", yes: 4, trend: "down" },
    { title: "Pakistan military strike on India by Friday?", yes: 38, trend: "up" },
    { title: "Will Trump impose more sanctions on Russia by September 30?", yes: 12, trend: "down" },
    { title: "Nuclear weapon detonation before October?", yes: 44, trend: "down" },
    { title: "Will China invade Taiwan in 2025?", yes: 71, trend: "up" },
    { title: "Will Trump cut Ukraine off from Starlink?", yes: 62, trend: "up" },
  ];
</script>

<div class="hero">
  <!-- Three rows of tiles -->
  <div class="grid-wrapper">
    <div class="grid-row">
      <div class="grid-inner scroll-left">
        {#each [...row1, ...row1] as market}
          <div class="tile">
            <div class="tile-title">{market.title}</div>
            <div class="tile-bottom">
              <div class="tile-outcomes">
                <span class="yes">Yes</span>
                <span class="no">No</span>
              </div>
              <div class="tile-prob {market.trend}">
                {market.yes}%
                <span class="arrow">{market.trend === 'up' ? '▲' : '▼'}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="grid-row">
      <div class="grid-inner scroll-right">
        {#each [...row2, ...row2] as market}
          <div class="tile">
            <div class="tile-title">{market.title}</div>
            <div class="tile-bottom">
              <div class="tile-outcomes">
                <span class="yes">Yes</span>
                <span class="no">No</span>
              </div>
              <div class="tile-prob {market.trend}">
                {market.yes}%
                <span class="arrow">{market.trend === 'up' ? '▲' : '▼'}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="grid-row">
      <div class="grid-inner scroll-left">
        {#each [...row3, ...row3] as market}
          <div class="tile">
            <div class="tile-title">{market.title}</div>
            <div class="tile-bottom">
              <div class="tile-outcomes">
                <span class="yes">Yes</span>
                <span class="no">No</span>
              </div>
              <div class="tile-prob {market.trend}">
                {market.yes}%
                <span class="arrow">{market.trend === 'up' ? '▲' : '▼'}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Headline below the grid -->
  <div class="headline-container">
    <h1>People are betting billions<br/>on war and crisis</h1>
    <p class="byline">By Sammy Liu</p>
    <p class="lead">Prediction markets aim to financialize everything: words uttered from Trump’s, Hegseth’s, Powell’s mouths, the number of tweets Elon Musk and the White House are going to post in a week, the pregnancy of Taylor Swift, Katy Perry, even the time Jesus Christ returns. All kinds of future events become “commodities” tied to bettors’ wallets – including those related to human suffering.</p>
  </div>

  <div class="fade-bottom"></div>
</div>

<style>
  .hero {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background: #fff;
  }

  .grid-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 3rem 0 1.5rem;
    overflow: hidden;
  }

  .grid-row {
    overflow: hidden;
  }

  .grid-inner {
    display: flex;
    gap: 12px;
    width: max-content;
  }

  .scroll-left {
    animation: scroll-left 30s linear infinite;
  }

  .scroll-right {
    animation: scroll-right 35s linear infinite;
  }

  @keyframes scroll-left {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  @keyframes scroll-right {
    0%   { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }

  .tile {
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 180px;
    max-width: 180px;
    height: 100px;
    background: #f5f5f5;
    border-radius: 8px;
    padding: 10px 12px;
    flex-shrink: 0;
  }

  .tile-title {
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    text-align: left;
    font-weight: 500;
    color: #222;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tile-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
  }

  .tile-outcomes {
    display: flex;
    flex-direction: row;
    gap: 4px;
  }

  .yes, .no {
    font-family: 'Inter', sans-serif;
    font-size: 0.62rem;
    font-weight: 600;
    padding: 1px 8px;
    border-radius: 3px;
    display: inline-block;
  }

  .yes { background: #d4edda; color: #155724; }
  .no  { background: #f8d7da; color: #721c24; }

  .tile-prob {
    font-family: 'Inter', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tile-prob.up   { color: #2d8a4e; }
  .tile-prob.down { color: #c0392b; }

  .arrow { font-size: 0.6rem; }

  /* Headline sits below the grid */
  .headline-container {
    padding: 2rem 5rem 0;
    text-align: center;
    z-index: 10;
    position: relative;
  }

  h1 {
    font-family: 'Inter', sans-serif;
    font-size: 3rem;
    font-weight: 700;
    line-height: 1.15;
    color: #111;
    margin: 0 0 0.75rem;
  }

  .byline {
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    color: #999;
    letter-spacing: 0.05em;
    margin: 0;
  }

  .lead {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #333;
  text-align: left;
  margin: 2rem 0;
}

  /* Fade bottom so hero blends into next section */
  .fade-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 120px;
    background: linear-gradient(to bottom, transparent, #fff);
    pointer-events: none;
    z-index: 5;
  }
</style>