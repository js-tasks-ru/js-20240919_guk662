export default class RangePicker {
  element;

  constructor({
    from = new Date(new Date(Date.now()).setMonth(new Date(Date.now()).getMonth() - 1)),
    to = new Date(Date.now())
  } = {}) {

    this.from = from;
    this.to = to;

    this.open = false;

    if (this.from > this.to) {
      [this.from, this.to] = [this.to, this.from];
    }

    const {leftCalendar, rightCalendar} = this._getCalendars(this.to.getFullYear(), this.to.getMonth());
    this.leftCalendar = leftCalendar;
    this.rightCalendar = rightCalendar;

    this.element = this._createElement();
    this.subElements = {};

    this.selectSubElements();
    this._createEventListeners();
  }

  _createEventListeners() {
    document.addEventListener('click', this._outsideClickHandler);
    this.element.addEventListener('click', this._rangePickerClickHandler);
    this.subElements.leftControl.addEventListener('click', this._selectorControlClickHandler);
    this.subElements.rightControl.addEventListener('click', this._selectorControlClickHandler);
    this.subElements.leftGrid.addEventListener('click', this._buttonGridClickHandler);
    this.subElements.rightGrid.addEventListener('click', this._buttonGridClickHandler);
  }

  _removeEventListeners() {
    document.addEventListener('click', this._outsideClickHandler);
    this.element.removeEventListener('click', this._rangePickerClickHandler);
    this.subElements.leftControl.removeEventListener('click', this._selectorControlClickHandler);
    this.subElements.rightControl.removeEventListener('click', this._selectorControlClickHandler);
    this.subElements.leftGrid.removeEventListener('click', this._buttonGridClickHandler);
    this.subElements.rightGrid.removeEventListener('click', this._buttonGridClickHandler);
  }

  _outsideClickHandler = (e) => {
    if (e.target.closest('.rangepicker')) { return; }
    
    if (this.open) {
      this._toggleOpenClose();
    }
  };

  _rangePickerClickHandler = (e) => {
    if (e.target.closest('div').dataset.element !== 'input') { return; }

    this._toggleOpenClose();
  };

  _buttonGridClickHandler = (e) => {
    e.stopPropagation();

    if (!e.target.dataset.value) { return; }

    if (this.to == null) {
      this.to = new Date(Date.parse(e.target.dataset.value));
      
      if (this.to < this.from) {
        [this.from, this.to] = [this.to, this.from];
      }

      this._updateInput();

      this.element.dispatchEvent(new Event('date-select'));
      this._toggleOpenClose();
    } else {
      this.from = new Date(Date.parse(e.target.dataset.value));
      this.to = null;
    }

    this._updateDateGridElement();
  };

  _selectorControlClickHandler = (e) => {
    e.stopPropagation();

    let calendars;
    if (e.target.dataset.element === 'leftControl') {
      calendars = this._getCalendars(this.leftCalendar.year, this.leftCalendar.month);
    } else {
      calendars = this._getCalendars(this.rightCalendar.year, this.rightCalendar.month + 1);
    }

    this.leftCalendar = calendars.leftCalendar;
    this.rightCalendar = calendars.rightCalendar;
    
    this.subElements.leftMonth.datetime = this.leftCalendar.monthName;
    this.subElements.leftMonth.textContent = this.leftCalendar.monthName;
    this.subElements.rightMonth.datetime = this.rightCalendar.monthName;
    this.subElements.rightMonth.textContent = this.rightCalendar.monthName;
    this._updateDateGridElement();
  };

  _updateInput() {
    this.subElements.from.textContent = this.from.toLocaleString('ru', { dateStyle: 'short' });
    this.subElements.to.textContent = this.to.toLocaleString('ru', { dateStyle: 'short' });
  }

  _updateDateGridElement() {
    this.subElements.leftGrid.innerHTML = this._createDateGridTemplate(this.leftCalendar);
    this.subElements.rightGrid.innerHTML = this._createDateGridTemplate(this.rightCalendar);
  }

  _toggleOpenClose() {
    if (!this.open) {
      this.open = true;
      this.element.classList.add('rangepicker_open');
    } else {
      this.open = false;
      this.element.classList.remove('rangepicker_open');
    }
  }

  _getMonthName(month) {
    return month.toLocaleString('en', {month: 'long'});
  }

  _getCalendarObject(year, month) {
    const calendar = {};

    const monthYearDate = new Date(year, month + 1, 0);
    calendar.month = monthYearDate.getMonth();
    calendar.year = monthYearDate.getFullYear();
    calendar.dayCount = monthYearDate.getDate();
    calendar.monthName = this._getMonthName(monthYearDate);
    calendar.firstWeekDay = new Date(monthYearDate.setDate(1)).getDay();

    return calendar;
  }

  _getCalendars(year, month) {
    const leftCalendar = this._getCalendarObject(year, month - 1);
    const rightCalendar = this._getCalendarObject(year, month);

    return {leftCalendar, rightCalendar};
  }

  _getSelectClassName(date) {
    if (+date === +this.from) {
      return 'rangepicker__selected-from';
    }

    if (+date === +this.to) {
      return 'rangepicker__selected-to';
    }

    if (this.from < date && date < this.to) {
      return 'rangepicker__selected-between';
    }
    return '';
  }

  _createDateGridTemplate(calendar) {
    let template = '';

    for (let i = 1; i <= calendar.dayCount; i++) {
      const date = new Date(calendar.year, calendar.month, i);
      template += `
      <button type="button" class="rangepicker__cell ${this._getSelectClassName(date)}" data-value="${date.toISOString()}"
        ${i === 1 ? `style="--start-from: ${calendar.firstWeekDay}"` : ''}>
        ${i}
      </button>`;
    }

    return template;
  }

  _createElement() {
    const element = document.createElement('div');

    element.innerHTML = `
    <div class="rangepicker">
      <div class="rangepicker__input" data-element="input">
        <span data-element="from">${this.from.toLocaleString('ru', { dateStyle: 'short' })}</span> -
        <span data-element="to">${this.to.toLocaleString('ru', { dateStyle: 'short' })}</span>
      </div>
      <div class="rangepicker__selector" data-element="selector">
        <div class="rangepicker__selector-arrow"></div>
        <div class="rangepicker__selector-control-left" data-element="leftControl"></div>
        <div class="rangepicker__selector-control-right" data-element="rightControl"></div>
        <div class="rangepicker__calendar">
          <div class="rangepicker__month-indicator">
            <time data-element="leftMonth" datetime="${this.leftCalendar.monthName}">${this.leftCalendar.monthName}</time>
          </div>
          <div class="rangepicker__day-of-week">
            <div>Пн</div>
            <div>Вт</div>
            <div>Ср</div>
            <div>Чт</div>
            <div>Пт</div>
            <div>Сб</div>
            <div>Вс</div>
          </div>
          <div class="rangepicker__date-grid" data-element="leftGrid">
            ${this._createDateGridTemplate(this.leftCalendar)}
          </div>
        </div>
        <div class="rangepicker__calendar">
          <div class="rangepicker__month-indicator">
            <time data-element="rightMonth" datetime="${this.rightCalendar.monthName}">${this.rightCalendar.monthName}</time>
          </div>
          <div class="rangepicker__day-of-week">
            <div>Пн</div>
            <div>Вт</div>
            <div>Ср</div>
            <div>Чт</div>
            <div>Пт</div>
            <div>Сб</div>
            <div>Вс</div>
          </div>
          <div class="rangepicker__date-grid" data-element="rightGrid">
            ${this._createDateGridTemplate(this.rightCalendar)}
          </div>
        </div>
      </div>
  </div>`;

    return element.firstElementChild;
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this._removeEventListeners();
    this.remove();
  }
}
