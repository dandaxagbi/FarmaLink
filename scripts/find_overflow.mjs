import { chromium } from 'playwright';

async function findOverflowSource() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const widestElements = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const all = Array.from(document.querySelectorAll('*'));
    
    return all
      .map(el => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          className: el.className ? String(el.className).substring(0, 80) : '',
          text: el.innerText ? el.innerText.substring(0, 30).replace(/\n/g, ' ') : '',
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          offsetWidth: el.offsetWidth,
          rectWidth: rect.width,
          right: rect.right,
          minWidth: style.minWidth,
          width: style.width
        };
      })
      .filter(item => item.rectWidth > docWidth + 2 || item.scrollWidth > docWidth + 2)
      .sort((a, b) => (b.scrollWidth || b.rectWidth) - (a.scrollWidth || a.rectWidth))
      .slice(0, 20);
  });

  console.log('--- ELEMENTOS MAS ANCHOS ---');
  console.log(JSON.stringify(widestElements, null, 2));

  await browser.close();
}

findOverflowSource();
