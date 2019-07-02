const _ = require('lodash');

let data = require('./data');

data = _.sortBy(data, ['tier', 'start']);

const result = [];
let curItem;
for (const item of data) {
    item.children = [];
    if (!curItem) {
        item.parent = null;
        result.push(item);
        curItem = item;
        continue;
    }

    let appended = false;
    do {
        const result = tryAppendChild(curItem, item);
        if (result) {
            appended = true;
            curItem = result;
            break;
        }
        curItem = curItem.parent;
    } while (curItem != null);
    if (!appended) {
        item.parent = null;
        result.push(item);
        curItem = item;
    }

}

function tryAppendChild(parent, item) {
    const lastChild = _.last(parent.children);
    if (lastChild && item.tier == lastChild.tier) {
        lastChild.children.push(item);
        item.parent = curItem;
        return lastChild;
    }

    if (item.tier == curItem.tier || item.tier.includes(curItem.tier)) {
        parent.children.push(item);
        item.parent = parent;
        return parent;
    }

    return null;
}

console.log(JSON.stringify(result, ['start', 'tier', 'children']));