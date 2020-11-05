import { getinit, readOnline } from '../../http/APIs';
// 统计阅读在线人数
const countPeople = (AuthUserId, AuthToken, userId,type, matchId) => {
    let query = {
        AuthUserId,
        AuthToken,
        userId,
        type,
        matchId
    }
    getinit([readOnline, query]).then(res => {
        console.log('统计阅读在线人数', res);
    }, err => {
        console.log('统计阅读在线人数', err);
    })
}
export default countPeople;