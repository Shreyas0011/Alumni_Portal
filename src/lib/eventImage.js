// True when an event image is a real photo rather than a text-baked placeholder.
export const isRealPhoto = (src) => Boolean(src) && !/placehold\.co|via\.placeholder|dummyimage/i.test(src);
