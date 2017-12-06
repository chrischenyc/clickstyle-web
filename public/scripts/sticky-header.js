/**
 * Sticky header
 */
$(document).ready(() => {
  $('#header')
    .not('#header.not-sticky')
    .clone(true)
    .addClass('cloned unsticky')
    .insertAfter('#header');
  $('#navigation.style-2')
    .clone(true)
    .addClass('cloned unsticky')
    .insertAfter('#navigation.style-2');

  // Logo for header style 2
  $('#logo .sticky-logo')
    .clone(true)
    .prependTo('#navigation.style-2.cloned ul#responsive');

  // sticky header script
  const headerOffset = $('#header-container').height() * 2; // height on which the sticky header will shows

  $(window).scroll(() => {
    if ($(window).scrollTop() >= headerOffset) {
      $('#header.cloned')
        .addClass('sticky')
        .removeClass('unsticky');
      $('#navigation.style-2.cloned')
        .addClass('sticky')
        .removeClass('unsticky');
    } else {
      $('#header.cloned')
        .addClass('unsticky')
        .removeClass('sticky');
      $('#navigation.style-2.cloned')
        .addClass('unsticky')
        .removeClass('sticky');
    }
  });
});
