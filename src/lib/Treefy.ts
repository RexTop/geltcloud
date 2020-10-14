type TreefyArgs = { stringArray: string[], separator: string, _current?: {} };

type TreefyObject = { [key: string]: TreefyObject };

export const treefy = ({_current = {}, separator, stringArray}: TreefyArgs) => {
    return stringArray.reduce((accumulator, current) => {
        const partsArray = current.split(separator);
        const key = partsArray.shift()?.trim();
        if (!key) return accumulator;
        const value = partsArray.length ? treefy({
            separator,
            stringArray: [partsArray.join(separator)],
            _current: accumulator[key],
        }) : {};
        accumulator[key] = {...accumulator[key], ...value};
        return accumulator;
    }, _current as TreefyObject);
};
