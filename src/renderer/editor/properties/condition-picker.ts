//////////////////////////////////////////////////////////////////////////////////////////
//   _  _ ____ _  _ ___  ____                                                           //
//   |_/  |__| |\ | |  \ |  |    This file belongs to Kando, the cross-platform         //
//   | \_ |  | | \| |__/ |__|    pie menu. Read more on github.com/menu/kando           //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////

// SPDX-FileCopyrightText: Simon Schneegans <code@simonschneegans.de>
// SPDX-License-Identifier: MIT

import { EventEmitter } from 'events';

/**
 * This class shows an inline dialog in the properties panel that allows the user to
 * choose conditions under which the current menu should be shown. The dialog contains two
 * buttons: "OK" and "Cancel". When the user clicks "OK", the first the 'select' event is
 * emitted. If either of the two buttons is clicked, the 'hide' event is emitted as well.
 *
 * @fires hide - When the user closes the condition picker via one of the two buttons.
 * @fires select - When the user selected new conditions. The selected conditions are
 *   passed as arguments to the event handler.
 */
export class ConditionPicker extends EventEmitter {
  /** The container to which the condition picker is appended. */
  private container: HTMLElement = null;

  /** The input field for filtering by app name. */
  private appName: HTMLInputElement = null;

  /** The input field for filtering by window title. */
  private windowTitle: HTMLInputElement = null;

  /**
   * Creates a new ConditionPicker and appends it to the given container.
   *
   * @param container - The container to which the condition picker will be appended.
   */
  constructor(container: HTMLElement) {
    super();

    this.container = container;

    const template = require('./templates/condition-picker.hbs');
    container.classList.value = 'd-flex flex-column justify-content-center hidden';
    container.innerHTML = template({});

    this.appName = container.querySelector(
      '#kando-properties-condition-app-name'
    ) as HTMLInputElement;

    this.windowTitle = container.querySelector(
      '#kando-properties-condition-window-title'
    ) as HTMLInputElement;

    // Close the condition picker when the user clicks the OK button. Before, we emit the
    // select event with the selected conditions.
    const okButton = container.querySelector('#kando-properties-condition-picker-ok');
    okButton.addEventListener('click', () => {
      const appName = this.appName.value;
      const windowTitle = this.windowTitle.value;
      this.emit('select', appName, windowTitle);
      this.hide();
    });

    // Close the condition picker when the user clicks the Cancel button.
    const cancelButton = container.querySelector(
      '#kando-properties-condition-picker-cancel'
    );
    cancelButton.addEventListener('click', () => {
      this.hide();
    });
  }

  /**
   * Shows the condition picker. The condition picker will open with the given condition
   * and theme selected.
   *
   * @param appName - The initial app name filter.
   * @param windowTitle - The initial window title filter.
   */
  public show(appName: string, windowTitle: string) {
    this.container.classList.remove('hidden');
    this.appName.value = appName;
    this.windowTitle.value = windowTitle;
  }

  /** Hides the condition picker. */
  public hide() {
    this.container.classList.add('hidden');
    this.emit('hide');
  }
}
