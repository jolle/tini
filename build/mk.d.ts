declare module 'tini';

export type MkArg = string | Object | HTMLElement;

export function mk(query: string, ...MkArg): HTMLElement;
