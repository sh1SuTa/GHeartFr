import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'

//vpn节点查询列表
export const vpnDataListService = ()=>{
    
    return request.get('/vpn')
}