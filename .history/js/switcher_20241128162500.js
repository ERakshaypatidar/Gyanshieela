window.console =
  window.console ||
  (function () {
    var e = {};
    e.log =
      e.warn =
      e.debug =
      e.info =
      e.error =
      e.time =
      e.dir =
      e.profile =
      e.clear =
      e.exception =
      e.trace =
      e.assert =
        function () {};
    return e;
  })();

$(document).ready(function () {
    var e =

    '<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight">' +
        '<div class="offcanvas-header">' +
            '<h6 id="offcanvasRightLabel">Setting</h6>' +
            '<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>' +
        '</div>' +
        '<div class="offcanvas-body">' +
            '<div class="widget-tabs">' +
                '<ul class="widget-menu-tab style-1">' +
                    '<li class="item-title active">' +
                        '<span class="inner">' +
                            '<div class="body-title">Theme Style</div>' +
                        '</span>' +
                    '</li>' +
                    '<li class="item-title">' +
                        '<span class="inner">' +
                            '<div class="body-title">Theme Colors</div>' +
                        '</span>' +
                    '</li>' +
                '</ul>' +
                '<div class="widget-content-tab">' +
                    '<div class="widget-content-inner active">' +
                        '<form class="form-theme-style">' +
                            '<fieldset class="theme-dark-light">' +
                                '<div class="body-title mb-5">Theme color mode:</div>' +
                                '<div class="radio-buttons">' +
                                    '<div class="item button-dark-light light">' +
                                        '<input class="" type="radio" name="mode" id="mode1" checked="">' +
                                        '<label class=""><div class="body-title">Light</div></label>' +
                                    '</div>' +
                                    '<div class="item button-dark-light dark">' +
                                        '<input class="" type="radio" name="mode" id="mode2">' +
                                        '<label class=""><div class="body-title">Dark</div></label>' +
                                    '</div>' +
                                '</div>' +
                            '</fieldset>' +
                            '<fieldset class="layout-width">' +
                                '<div class="body-title mb-5">Layout width style</div>' +
                                '<div class="radio-buttons">' +
                                    '<div class="item">' +
                                        '<input class="full" type="radio" name="width-style" id="width-style1" checked="">' +
                                        '<label for="width-style1" class=""><div class="body-title">Full width</div></label>' +
                                    '</div>' +
                                    '<div class="item">' +
                                        '<input class="boxed" type="radio" name="width-style" id="width-style2">' +
                                        '<label for="width-style2" class=""><div class="body-title">Boxed</div></label>' +
                                    '</div>' +
                                '</div>' +
                            '</fieldset>' +
                            '<fieldset class="menu-style">' +
                                '<div class="body-title mb-5">Vertical & Horizontal menu style</div>' +
                                '<div class="radio-buttons">' +
                                    '<div class="item">' +
                                        '<input class="menu-click" type="radio" name="menu-style" id="menu-style1" checked="">' +
                                        '<label class="" for="menu-style1"><div class="body-title">Menu click</div></label>' +
                                    '</div>' +
                                    '<div class="item">' +
                                        '<input class="icon-hover" type="radio" name="menu-style" id="menu-style2">' +
                                        '<label class="" for="menu-style2"><div class="body-title">Icon hover</div></label>' +
                                    '</div>' +
                                    '<div class="item">' +
                                        '<input class="icon-default" type="radio" name="menu-style" id="menu-style3">' +
                                        '<label class="" for="menu-style3"><div class="body-title">Icon default</div></label>' +
                                    '</div>' +
                                '</div>' +
                            '</fieldset>' +
                            '<fieldset class="menu-position">' +
                                '<div class="body-title mb-5">Menu position</div>' +
                                '<div class="radio-buttons">' +
                                    '<div class="item">' +
                                        '<input class="menu-fixed" type="radio" name="menu-position" id="menu-position1" checked="">' +
                                        '<label class="" for="menu-position1"><div class="body-title">Fixed</div></label>' +
                                    '</div>' +
                                    '<div class="item">' +
                                        '<input class="menu-scrollable" type="radio" name="menu-position" id="menu-position2">' +
                                        '<label class="" for="menu-position2"><div class="body-title">Scrollable</div></label>' +
                                    '</div>' +
                                '</div>' +
                            '</fieldset>' +
                            '<fieldset class="header-position">' +
                                '<div class="body-title mb-5">Header positions</div>' +
                                '<div class="radio-buttons">' +
                                    '<div class="item">' +
                                        '<input class="header-fixed" type="radio" name="header-positions" id="header-positions1" checked="">' +
                                        '<label class="" for="header-positions1"><div class="body-title">Fixed</div></label>' +
                                    '</div>' +
                                    '<div class="item">' +
                                        '<input class="header-scrollable" type="radio" name="header-positions" id="header-positions2">' +
                                        '<label class="" for="header-positions2"><div class="body-title">Scrollable</div></label>' +
                                    '</div>' +
                                '</div>' +
                            '</fieldset>' +
                            '<fieldset class="style-loader">' +
                                '<div class="body-title mb-5">Loader</div>' +
                                '<div class="radio-buttons">' +
                                    '<div class="item">' +
                                        '<input class="style-loader-on" type="radio" name="loader" id="loader1" checked="">' +
                                        '<label class="" for="loader1"><div class="body-title">Enable</div></label>' +
                                    '</div>' +
                                    '<div class="item">' +
                                        '<input class="style-loader-off" type="radio" name="loader" id="loader2">' +
                                        '<label class="" for="loader2"><div class="body-title">Disable</div></label>' +
                                    '</div>' +
                                '</div>' +
                            '</fieldset>' +
                            '<div class="tf-button cursor-pointer w-full button-clear-select">Clear all</div>' +
                        '</form>' +
                    '</div>' +
                    '<div class="widget-content-inner">' +
                        '<form class="form-theme-color">' +
                            '<fieldset class="menu-color">' +
                                '<div class="body-title mb-10">Menu Background color</div>' +
                                '<div class="select-colors-theme colors-menu mb-10">' +
                                    '<div class="item color-fff active default"></div>' +
                                    '<div class="item color-1E293B"></div>' +
                                    '<div class="item color-1B1B1C"></div>' +
                                    '<div class="item color-3A3043"></div>' +
                                '</div>' +
                                '<div class="text-tiny">Note:If you want to change color Menu dynamically change from below Theme Primary color picker</div>' +
                            '</fieldset>' +
                            '<fieldset class="">' +
                                '<div class="body-title mb-10">Header Background color</div>' +
                                '<div class="select-colors-theme colors-header mb-10">' +
                                    '<div class="item color-fff active default"></div>' +
                                    '<div class="item color-1E293B"></div>' +
                                    '<div class="item color-1B1B1C"></div>' +
                         