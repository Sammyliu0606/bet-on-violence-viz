export const scrollSteps = [
  {
    // Step 0 — opening, zoomed into Jan
    date: '2025-01-01',
    scale: 2,
    highlightIds: [],
    text: 'Analysis of nearly 4.6 million prediction market events created within 2025 on Kalshi and Polymarket shows the two dominant platforms have been creating markets at an exponential rate.',
  },
  {
    // Step 1 — first highlighted event
    date: '2025-03-01',   // pan camera near this event's date
    scale: 2,
    highlightIds: ['16282','17738','21317'],
    text: null,  // tooltip on bubble tells the story, no text box needed
  },
  {
    // Step 2 — second highlighted event
    date: '2025-05-01',
    scale: 2,
    highlightIds: ['22981','25044', '27821', 'KXNEXTPOPE-35','KXNATHANDOGS-25'],
    text: null,
  },
  {
    // Step 3 — third highlighted event
    date: '2025-08-01',
    scale: 2,
    highlightIds: ['33495','KXBTCMAX125-1'],
    text: null,
  },
  {
    // Step 4 — end of timeline, no highlight
    date: '2025-12-01',
    scale: 2,
    highlightIds: ['59297','57463','111908','103575','19696'],
    text: null,
  },
  {
    // Step 5 — zoom out, show full picture
    date: null,
    scale: 0.65,
    highlightIds: [],
    text: 'In January, 5,967 new events were created across both platforms, while in December, the number expanded 480-fold: over 2.8 million new events sprang up in a month.',
  },
  {
    // Step 6 — highlight violence/coercion/crisis (66 colored bubbles)
    date: null,
    scale: 0.65,
    highlightIds: [],  // no individual tooltip, category coloring handles this
    text: 'As more and more of daily life gets a price tag stuck on it – an odds number reflecting what traders collectively believe will happen – <span class="tag violence">violence</span>, <span class="tag coercion">coercion</span>, and <span class="tag crisis">crisis</span> events are no exception.',
  },
  {
    // Step 7 
    date: null,
    scale: 0.65,
    highlightIds: ['16537', '133118'],
    text: '“The world’s gone mad, trade it.” As one Kalshi advertisement put it, when disaster unfolds, a market is created right after, opening the door for traders to wager their money.',
  },
  {
    // Step 8 
    date: null,
    scale: 0.65,
    highlightIds: [],
    text: 'When the  LA wildfire began on January 7, 2025, threatening tens of thousands of people and buildings, markets betting on <span class="tag crisis">how wide the fire would spread</span> and <span class="tag crisis">how many acres would burn</span> were already created within two days. Nearly $420,000 poured in before the markets resolved.',
  },
  {
    // Step 9
    date: null,
    scale: 0.65,
    highlightIds: [],
    text: 'Amid ongoing Israel-Iran tension and the subsequent bombardment of military facilities and cities in June 2025, at least 56 markets betting on <span class="tag violence">whether either the US or Israel would initiate additional drone, missile, air strike or ground offensive on Iran</span> continued to spring up throughout the year. The one on the largest scale attracted nearly 30 million dollars in around three months.',
  },
{
    // Step 10
    date: null,
    scale: 0.65,
    highlightIds: [],
    text: 'With political tensions intensifying around the world, people put millions on the line, profiting or losing money <span class="tag coercion">when individuals are arrested, freed, deported or extradited</span>.The subjects spanned a wide range, from South Korea\'s former president Yoon Suk Yeol to Federal Reserve Governor Lisa Cook, climate activist Greta Thunberg, and former U.S. President Barack Obama, all the subject of markets betting on their arrest. Every event attracted at least hundreds of thousands to nearly $2 million in wagers.',
  },
  {
    // Step 11 — collapse to average bubbles
    date: null,
    scale: 0.65,
    highlightIds: [],
    text: '<p>Although markets whose resolutions were tied to violence, coercion or crisis only account for less than 1% in total, they tend to attract significantly larger trading volumes.</p><p>Nearly 1 in 6 violence, coercion, or crisis events exceeded $1 million in trading volume while only 0.1% of neutral events crossed the threshold.</p>',
  },
   {
    // Step 12 
    date: null,
    scale: 0.65,
    highlightIds: [],
    text: 'On average, a <span class="tag neutral">neutral event</span> attracted $9,587 in trading volume in 2025. <span class="tag crisis">Crisis events</span> averaged $1.5 million — 158 times more. <span class="tag violence">Violence events</span> averaged $956,000, <span class="tag coercion">coercion events</span> $343,000, each drawing roughly 100 and 36 times the volume of a neutral market.',
  },
     {
    // Step 13 
    date: null,
    scale: 0.65,
    highlightIds: [],
    text: 'In total, there are 938 events whose resolution tied to violence, coercion, and crisis that were created in 2025. Over $933 million flowed through them.',
  },
  {
    // Step 14
    date: null,
    scale: 0.65,
    highlightIds: [],
    text: 'The Commodity Futures Trading Commission prohibits U.S.-based prediction markets from creating contracts that “involve, relate to, or reference terrorism, assassination or war.”',
  },
  {
    // Step 15
    date: null,
    scale: 0.65,
    highlightIds: [],
    text: 'Kalshi, which is subject to the regulation, had not created contracts requiring direct resolution by violence in 2025. Yet the regulation cannot completely ban markets that could plausibly be resolved by violence – contracts betting on political leaders being removed in unstable situations, such as Nicolas Maduro in Venezuela and Ali Khamenei in Iran, still ran freely.',
  },
    {
    // Step 16
    date: null,
    scale: 0.65,
    highlightIds: [],
    text: 'Polymarket, however, is not effectively subject to the regulation. After being fined $1.4 million by the CFTC, it blocked U.S. users and mainly operated offshore. Over 95% of the violence, coercion and crisis-related events we identified in 2025 were created by Polymarket.',
  },
  {
    // Step 17 
    date: null,
    scale: 0.65,
    highlightIds: [],
    text: '<p>Both platforms are built on the idea of harnessing the wisdom of crowds.</p> <p>A note published across Polymarket’s Middle East markets saying – prediction markets could give people affected by conflict “the answers they needed in ways TV news and 𝕏 could not.” Kalshi similarly argues its financial mechanism produces truth that “shouldn’t be limited to business performance but to other meaningful events.”</p>',
  },
    {
    // Step 18
    date: null,
    scale: 0.65,
    highlightIds: [],
    text: 'The same financial incentives, however, monetize confidential information and potentially manipulate the outcomes being predicted.”',
  },
  {
    // Step 19
    date: null,
    scale: 0.65,
    highlightIds: [],
    text: '<p>In February, an Israeli air force reservist,according to court records reported by an Israeli news outlet, was indicted for sharing confidential information and betting on the timing of first strike and the end date of the 12-day war on Polymarket, allegedly netting $162,663.</p> <p>Two months later, a U.S. special forces soldier involved in the capture of Venezuelan President Nicolás Maduro was charged for placing 13 bets on U.S. operations in Venezuela on Polymarket, netting more than $40,000.</p>',
  },
    {
    // Step 20
    date: null,
    scale: 0.65,
    highlightIds: [],
    text: '<p>Throughout 2025, violence, coercion, and crisis-related events were created at a steady pace of 60 to 70 per month. But the number of trades flowing through them on Polymarket alone grew 7.5-fold — from 96,668 to 736,554 a month. The markets are not slowing down.</p><p>Hover to explore.</p>',
  },
];