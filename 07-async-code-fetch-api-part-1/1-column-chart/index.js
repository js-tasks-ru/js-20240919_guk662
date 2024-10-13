import fetchJson from './utils/fetch-json.js';
import ColumnChart from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChartV2 extends ColumnChart {
  constructor(props = {}) {
    super(props);

    this.url = props.url;
  }

  async update(from, to) {
    this.element.className = "column-chart column-chart_loading";

    const data = await this.fetchData(from, to);

    super.update(Object.values(data));

    return data;
  }

  async fetchData(from, to) {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.set('from', from);
    url.searchParams.set('to', to);

    const data = await fetchJson(url);
    
    return data;
  }
}
