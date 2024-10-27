import fetchJson from './utils/fetch-json.js';
import ColumnChart from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChartV2 extends ColumnChart {
  constructor({
    label = '',
    link = '',
    formatHeading = data => data,
    url = '',
    range = {
      from: new Date(),
      to: new Date(),
    }
  } = {}) {
    super({label, link, formatHeading, url, range});

    this.from = range.from;
    this.to = range.to;
    
    this.url = url;
  }

  async update(from, to) {
    this.element.className = "column-chart column-chart_loading";

    const data = await this.fetchData(from, to);

    super.update(Object.values(data));

    return data;
  }

  async fetchData(from, to) {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.set('from', from.toISOString());
    url.searchParams.set('to', to.toISOString());

    const data = await fetchJson(url);
    
    return data;
  }

  async render() {
    await this.update(this.from, this.to);
    return this.element;
  }
}
