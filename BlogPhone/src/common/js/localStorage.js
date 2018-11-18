export function updateSearch(searchText) {
  let storage = window.localStorage;
  if (storage.search) {
    let search = JSON.parse(storage.search);
    let index = search.indexOf(searchText);
    if (index != -1) {
      search.splice(index, 1);
      search.unshift(searchText);
    } else {
      if (search.length <= 7) {
        search.unshift(searchText);
      } else {
        search.splice(0, 1);
        search.unshift(searchText);
      }
    }
    search = JSON.stringify(search);
    storage.setItem('search', search);
  } else {
    let search = JSON.stringify([searchText]);
    storage.setItem('search', search);
  }
}

export function deleteOne(index) {
  let storage = window.localStorage;
  let search = JSON.parse(storage.search);
  search.splice(index,1);
  search = JSON.stringify(search);
  storage.setItem('search', search);
}

export function clear() {
  let storage = window.localStorage;
  let search = JSON.stringify([]);
  storage.setItem('search', search);
}
