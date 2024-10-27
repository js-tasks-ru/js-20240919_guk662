import SortableList from '../2-sortable-list/index.js';
import ProductFormV1 from '../../08-forms-fetch-api-part-2/1-product-form-v1/index.js';

import escapeHtml from './utils/escape-html.js';

export default class ProductForm extends ProductFormV1 {
  sortableImageList;

  _createImageListElement(images) {
    const elements = images.map(image => {
      return this._createImageElement(image);
    });

    this.sortableImageList = new SortableList({items: elements});
    return this.sortableImageList.element;
  }

  _createImageElement(image) {
    const element = document.createElement('div');
    element.innerHTML = `
      <li class="products-edit__imagelist-item">
        <input type="hidden" name="url" value="${escapeHtml(image.url)}">
        <input type="hidden" name="source" value="${escapeHtml(image.source)}">
        <span>
          <img src="icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="Image" referrerpolicy="no-referrer" src="${escapeHtml(image.url)}">
          <span>${escapeHtml(image.source)}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-delete-handle="" alt="delete">
        </button>
      </li>
    `;

    return element.firstElementChild;
  }

  _createElement(product, categories) {
    const element = document.createElement('div');
    element.innerHTML = `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input value="${escapeHtml(product?.title ?? '')}" id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${escapeHtml(product?.description ?? '')}</textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer">

            </div>
            <button type="button" name="uploadImage" data-element="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select id="subcategory" class="form-control" name="subcategory">
              ${this._createCategoriesTemplate(categories, product?.subcategory)}
            </select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input id="price" value="${escapeHtml(product?.price?.toString() ?? '')}" required="" type="number" name="price" class="form-control" placeholder="100">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input id="discount" value="${escapeHtml(product?.discount?.toString() ?? '')}" required="" type="number" name="discount" class="form-control" placeholder="0">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input id="quantity" value="${escapeHtml(product?.quantity?.toString() ?? '')}" required="" type="number" class="form-control" name="quantity" placeholder="1">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select id="status" class="form-control" name="status">
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

    element.querySelector('div[data-element="imageListContainer"]').append(this._createImageListElement(product?.images ?? []));

    return element.firstElementChild;
  }

  _addImageToForm(source, url) {
    const image = {source, url};
    const imageElement = this._createImageElement(image);

    this.sortableImageList.addElement(imageElement);
  }
}
