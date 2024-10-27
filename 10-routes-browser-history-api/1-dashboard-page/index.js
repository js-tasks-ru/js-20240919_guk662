import RangePicker from "../../08-forms-fetch-api-part-2/2-range-picker/index.js";
import SortableTable from "../../07-async-code-fetch-api-part-1/2-sortable-table-v3/index.js";
import ColumnChart from "../../07-async-code-fetch-api-part-1/1-column-chart/index.js";
import header from "./bestsellers-header.js";

class Page {
  components = {};
  subElements = {};
  element;

  async render() {
    this.element = this.createElement(this.createTemplate());
    this.selectComponentElements();

    for (const [componentName, componentInstance] of Object.entries(this.components)) {
      componentInstance.render();
      this.subElements[componentName] = componentInstance.element;
      this.componentElements[componentName].appendChild(componentInstance.element);
    }
  }

  selectComponentElements() {
    this.componentElements = {};

    const elements = this.element.querySelectorAll('[data-component]');

    for (const element of elements) {
      const name = element.getAttribute('data-component');
      this.componentElements[name] = element;
    }
  }

  createElement(template) {
    const element = document.createElement('div');

    element.innerHTML = template;
    
    return element.firstElementChild;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
    this.remove();
  }
}

export default class DashboardPage extends Page {
  components = {
    rangePicker: new RangePicker(),
    sortableTable: new SortableTable(header, {
      url: "api/dashboard/bestsellers",
    }),
    ordersChart: new ColumnChart({
      label: "Orders",
      link: "/sales",
      formatHeading: (data) => data,
      url: "api/dashboard/orders",
    }),
    salesChart: new ColumnChart({
      label: "Sales",
      link: "",
      formatHeading: (data) => data,
      url: "api/dashboard/sales",
    }),
    customersChart: new ColumnChart({
      label: "Customers",
      link: "",
      formatHeading: (data) => data,
      url: "api/dashboard/customers",
    })
  }

  async render() {
    await super.render();
    this.createEventListeners();
    return this.element;
  }

  dateSelectHandler = (e) => {
    const {from, to} = e.detail;

    this.components.ordersChart.update(from, to);
    this.components.salesChart.update(from, to);
    this.components.customersChart.update(from, to);
  };

  createEventListeners() {
    document.addEventListener('date-select', this.dateSelectHandler);
  }

  removeEventListeners() {
    document.removeEventListener('date-select', this.dateSelectHandler);
  }

  createTemplate() {
    return `
      <div class="dashboard">
        <div class="content__top-panel">
          <h2 class="page-title">Dashboard</h2>
          <div data-component="rangePicker"></div>
        </div>
        <div data-element="chartsRoot" class="dashboard__charts">
          <div data-component="ordersChart" class="dashboard__chart_orders"></div>
          <div data-component="salesChart" class="dashboard__chart_sales"></div>
          <div data-component="customersChart" class="dashboard__chart_customers"></div>
        </div>

        <h3 class="block-title">Best sellers</h3>

        <div data-component="sortableTable"></div>
      </div>
    `;
  }

  destroy() {
    this.removeEventListeners();
    super.destroy();
    this.remove();
  }
}
