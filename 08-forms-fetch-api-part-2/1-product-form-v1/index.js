import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element;

  constructor (productId) {
    this.productId = productId;

    this.url = new URL(BACKEND_URL);
  }

  async _getCategories(sort, refs) {
    const url = new URL('api/rest/categories', this.url);
    url.searchParams.set('_sort', sort);
    url.searchParams.set('_refs', refs);

    return await fetchJson(url);
  }

  async _getProduct(productId) {
    const url = new URL('api/rest/products', this.url);
    url.searchParams.set('id', productId);

    return await fetchJson(url);
  }

  _createCategoriesTemplate(categories, currentSubCategoryId) {
    return categories.map(category => {
      let categoriesTemplate = '';
      for (const sub of category.subcategories) {
        categoriesTemplate += `
          <option value="${sub.id}" ${sub.id === currentSubCategoryId ? 'selected' : ''}>${category.title} &gt; ${sub.title}</option>
        `;
      }

      return categoriesTemplate;
    }).join('');
  }

  _createImagesTemplate(images) {
    return images.map(image => `
      <li class="products-edit__imagelist-item sortable-list__item" style="">
        <input type="hidden" name="url" value="${image.url}">
        <input type="hidden" name="source" value="${image.source}">
        <span>
          <img src="icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="Image" src="${image.url}">
          <span>${image.source}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-delete-handle="" alt="delete">
        </button>
      </li>
    `).join('');
  }

  _createElement(product, categories) {
    const element = document.createElement('div');
    element.innerHTML = `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input required="" type="text" name="title" class="form-control" placeholder="Название товара">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${product?.description ?? ''}</textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer">
              <ul class="sortable-list">
                ${product?.images ? this._createImagesTemplate(product.images) : ''}
              </ul>
            </div>
            <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select class="form-control" name="subcategory">
              ${this._createCategoriesTemplate(categories, product?.subcategory)}
            </select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input value="${product?.price ?? ''}" required="" type="number" name="price" class="form-control" placeholder="100">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input value="${product?.discount ?? ''}" required="" type="number" name="discount" class="form-control" placeholder="0">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input value="${product?.quantity ?? ''}" required="" type="number" class="form-control" name="quantity" placeholder="1">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select class="form-control" name="status">
              <option ${product?.status === 1 ? 'selected' : ''} value="1">Активен</option>
              <option ${product?.status === 0 ? 'selected' : ''} value="0">Неактивен</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
        </form>
      </div>
    `;

    element.querySelector('input[name="title"]').value = product?.title ?? '';

    return element.firstElementChild;
  }

  async render () {
    this.categories = await this._getCategories('weight', 'subcategory');
    if (this.productId) {
      this.product = (await this._getProduct(this.productId))[0];
    }

    this.element = this._createElement(this.product, this.categories);
  }
}
