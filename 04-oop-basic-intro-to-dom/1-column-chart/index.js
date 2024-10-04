export default class ColumnChart {
  constructor(props = {}) {
    const {
      data = [],
      label = '',
      value = 0,
      link = '',
      chartHeight = 50,
      formatHeading = (value) => value
    } = props;

    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.chartHeight = chartHeight;
    this.formatHeading = formatHeading;

    this.element = this.createElement();
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  createLinkTemplate() {
    return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
  }

  createDataTemplate() {
    return this.getColumnProps(this.data).map(({ value, percent }) => `<div style="--value: ${value}" data-tooltip="${percent}"></div>`).join('\n');
  }

  createTotalValue() {
    const numberFormat = new Intl.NumberFormat('en-US');
    return this.formatHeading(numberFormat.format(this.value));
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML =
      ` 
        <div class="column-chart ${this.data.length > 0 ? '' : 'column-chart_loading'}" style="--chart-height: ${this.chartHeight}">
          <div class="column-chart__title">
              ${this.label}
              ${this.createLinkTemplate()}
          </div>
          <div class="column-chart__container">
              <div data-element="header" class="column-chart__header">${this.createTotalValue()}</div>
                  <div data-element="body" class="column-chart__chart">
                      ${this.createDataTemplate()}
                  </div>
              </div>
          </div>
      `;

    return element.firstElementChild;
  }

  update(newData) {
    this.data = newData;
    this.element = this.createElement();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
