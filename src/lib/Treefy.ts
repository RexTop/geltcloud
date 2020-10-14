type TreefyArgs = { stringArray: string[], separator: string };

type TreefyObject = { [key: string]: TreefyObject };

export const treefy = ({separator, stringArray}: TreefyArgs) => {
    return treefyInternal({separator, stringArray, _current: {}})
};

const treefyInternal = ({_current = {}, separator, stringArray}: TreefyArgs & { _current: {} }) => {
    return stringArray.reduce((accumulator, current) => {
        const partsArray = current.split(separator);
        const key = partsArray.shift()?.trim();
        if (!key) return accumulator;
        const value = partsArray.length ? treefyInternal({
            separator,
            stringArray: [partsArray.join(separator)],
            _current: accumulator[key],
        }) : {};
        accumulator[key] = {...accumulator[key], ...value};
        return accumulator;
    }, _current as TreefyObject);
};
