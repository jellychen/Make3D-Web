/* eslint-disable no-unused-vars */

// https://localforage.docschina.org/#api-setitem

import localforage from "localforage";

localforage.setDriver([localforage.INDEXEDDB, localforage.WEBSQL]);

export default localforage;
