// utils/idUtils.js

/**
 * Safely converts MongoDB ObjectId / any id to string
 */
export const stringifyId = (id) => {
    if (!id) return "";
    return String(id);
};

/**
 * Compares two ids (ObjectId or string)
 */
export const idEquals = (id1, id2) => {
    return stringifyId(id1) === stringifyId(id2);
};
