// export function setItem(key,value){
//     return window.sessionStorage.setItem(key,JSON.stringify(value))
// }
//
// export function getItem(key){
//     return JSON.parse(window.sessionStorage.getItem(key))
// }
export function setItem(key,value){
    return window.sessionStorage.setItem(key,value)
}

export function getItem(key){
    return window.sessionStorage.getItem(key)
}