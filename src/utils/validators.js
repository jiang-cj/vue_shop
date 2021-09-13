export const checkMobile = function(rule, value, callback){
    const RegExpMobile = /^[1]([3-9])[0-9]{9}$/
    if (RegExpMobile.test(value)) {
        return callback()
    }else{
        callback(new Error('请输入中国大陆11位手机号码'))
    }
}