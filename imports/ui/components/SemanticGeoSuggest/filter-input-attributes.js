/**
 * Attributes allowed on input elements
 */
const allowedAttributes = [
  'autoCapitalize',
  'autoComplete',
  'autoCorrect',
  'autoFocus',
  'disabled',
  'form',
  'formAction',
  'formEncType',
  'formMethod',
  'formNoValidate',
  'formTarget',
  'height',
  'id',
  'inputMode',
  'maxLength',
  'name',
  'onClick',
  'onContextMenu',
  'onCopy',
  'onCut',
  'onDoubleClick',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onPaste',
  'pattern',
  'placeholder',
  'readOnly',
  'required',
  'size',
  'spellCheck',
  'tabIndex',
  'title',
  'aria-atomic',
  'aria-busy',
  'aria-controls',
  'aria-current',
  'aria-describedby',
  'aria-details',
  'aria-disabled',
  'aria-dropeffect',
  'aria-errormessage',
  'aria-flowto',
  'aria-grabbed',
  'aria-haspopup',
  'aria-hidden',
  'aria-invalid',
  'aria-keyshortcuts',
  'aria-label',
  'aria-labelledby',
  'aria-live',
  'aria-owns',
  'aria-relevant',
  'aria-roledescription',
  'aria-activedescendant',
  'aria-autocomplete',
  'aria-multiline',
  'aria-placeholder',
  'aria-readonly',
  'aria-required',
];

/**
 * Filter the properties for only allowed input properties
 * @param  {Object} props The properties to filter
 * @return {Object} The filtered, allowed properties
 */
export default function (props) {
  const attributes = {};

  allowedAttributes.forEach((allowedAttribute) => {
    if (props[allowedAttribute]) {
      attributes[allowedAttribute] = props[allowedAttribute];
    }
  });

  return attributes;
}
