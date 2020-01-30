import axios from 'axios'
let host = process.env=='production'?"http://47.105.210.34:8086":'http://localhost:8086';

/**
 * 登录
 * @param {*} user_name  -用户名
 * @param {*} user_password -密码
 */
export const login = function (user_name, user_password) {
    return axios.post(
        host + "/users/login",
        {
            user_name,
            user_password
        }
    )
}
/**
 * 注册用户
 * @param {*} user_name -用户名
 * @param {*} user_password -密码
 */
export const register = function(user_name,user_password){
    return axios.post(
        host + "/users/register",
        {
            user_name,
            user_password
        }
    )
}
/**
 * 检查登录
 * @param {*} token -凭证
 */
export const checkLogin = function(token){
    return axios.get(
        host + "/users/checkLogin?token="+token,
    )
}

/**
 * 获取好友列表
 * @param user_name
 * @param token
 * @return {AxiosPromise<any>}
 */
export const getFriendList = function(user_name,token){
    return axios.get(
        host + "/users/friendList?user_name="+user_name+"&token="+token,
    )
}


/**
 * 添加好友
 * @param data -请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
export const addFriend = function(data) {
  return axios.post(
    host + "/users/addFriend",
    data,
  )
}

/**
 * 上传文件
 * @param {*} data 
 */
export const uploadFile = function(data){
    return axios.post(
        host + '/upload',
        data,
    )
}

/**
 * 设置头像
 * @param {*} user_name 
 * @param {*} url 
 */
export const setUserAva = function(user_name,url){
    return axios.post(
        host + '/users/setUserAva',
        {
            user_name,
            url,
            token,
        },
    )
}

/**
 * 删除好友
 * @param {*} token 
 * @param {*} user_name 
 * @param {*} friend_name 
 */
export const deleteFriend = function(token,user_name,friend_name){
    return axios.post(
        host + '/users/deleteFriend',
        {
            token,
            user_name,
            friend_name,
        },
    )
}