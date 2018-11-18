export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}
export function addClass(el, className) {
  if (hasClass(el, className)) return 0;
  let newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
}
