import pinyin from 'pinyin';
import _ from 'lodash';

export function addPinyinForData(typesTabDatas = []) {
  let letter = '';
  for (let i = 0, len = typesTabDatas.length; i < len; i++) {
    letter = pinyin(typesTabDatas[i].league_name, { style: pinyin.STYLE_FIRST_LETTER }) || [];
    typesTabDatas[i].letter = letter.length > 0 ? String(letter[0]).toUpperCase() : '';
  }
  return sortByLetter(typesTabDatas);
}

export function sortByLetter(typesTabDatas = []) {
  return typesTabDatas.sort((a, b) => a.letter > b.letter);
}

export function groupByLetter(typesTabDatas = []) {
  let groups = [];
  const add = (item) => {
    let foundIndex = groups.findIndex(t => t.title === item.letter);
    if (foundIndex > -1) {
      groups[foundIndex].items.push(item);
    } else {
      groups.push({ title: item.letter, items: [item] });
    }
  };
  for (let i = 0, len = typesTabDatas.length; i < len; i++) {
    add(typesTabDatas[i]);
  }
  return groups;
}

export function removeRepeatData(typesTabDatas = []) {
  let datas = [];
  let found;
  typesTabDatas.forEach(data => {
    found = datas.find(item => item.league_id === data.league_id && item.league_name === data.league_name);
    if (!found) {
      datas.push(data);
    }
  });
  return datas;
}

function filterUnvaibleData(typesTabDatas = []) {
  return typesTabDatas.filter(data => Object.prototype.hasOwnProperty.call(data, 'league_id'));
}

export function formatFilterData(typeTabs = [], typesTabDatas = []) {
  typesTabDatas = filterUnvaibleData(typesTabDatas);
  let datas = addPinyinForData(typesTabDatas);
  return typeTabs.map(tab => {
    if (tab.id === 0) {
      tab.datas = groupByLetter(removeRepeatData(_.cloneDeep(datas)));
    } else {
      tab.datas = groupByLetter(getTabDataById(datas, tab.id));
    }
    return tab;
  });
}

export function getTabDataById(typesTabDatas = [], typeTabId) {
  let datas = [];
  for (let i = 0, len = typesTabDatas.length; i < len; i++) {
    if (typesTabDatas[i].league_category_id === typeTabId) {
      datas.push(typesTabDatas[i]);
    }
  }
  return datas;
}
