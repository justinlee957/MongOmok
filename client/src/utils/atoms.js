import { atom } from 'recoil'

export const coordinates = atom({
    key: 'coordinates', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
})

export const turnAtom = atom({
    key: 'turn', // unique ID (with respect to other atoms/selectors)
    default: false, // default value (aka initial value)
})

export const winAtom = atom({
    key: 'win', // unique ID (with respect to other atoms/selectors)
    default: -1, // default value (aka initial value)
})

export const canvasImageAtom = atom({
    key: 'canvas',
    default: ''
})

export const postsAtom = atom({
    key: 'posts',
    default: false
})