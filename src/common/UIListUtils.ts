export type SubHeadersType = { [key: string]: string }

export const getSubheaders = <T extends {}>(array: T[], getGroupKey: (item: T) => string, getItemId: (item: T) => string): SubHeadersType => {
    return array.reduce((acc, cur, i) => {
        // It's guaranteed that the array is sorted by the field we are interested in.
        const groupKey = getGroupKey(cur);
        if (!acc.indexedKeys.includes(groupKey)) {
            acc.headers[getItemId(cur)] = groupKey;
            acc.indexedKeys.push(groupKey);
        }
        return acc;
    }, {indexedKeys: [] as string[], headers: {} as { [key: string]: string }}).headers;
};
