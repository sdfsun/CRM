import {getDateStr} from '@/utils/index';

export default {
    addGoods({state,commit,dispatch},res){//添加产品到购物车
        const cartGoods =  state.goods;
        res.space = '未知';//空间
        res.is_stand = res.is_custom == 'true'?1:0;//是否是定制单
        res.is_standSelected = res.is_stand == 1?true:false;//是否选中定制单
        res.sum = Number(res.num*res.price);
        res.gifs_flag = 'false';//是否是赠品
        res.fileStr = '';//附件
        res.install_flag = 'false';//设置为非安装服务
        res.bprice = res.price;
        if(!res.send_time && state.cumtomFormData.sendProDate){
            res.send_time = state.cumtomFormData.sendProDate;
        }
        res.send_time_sys = res.send_time;
        if(cartGoods.length > 0){
            const index = cartGoods.findIndex((item=>{
                return item.product_id === res.product_id;
            }));
            if(index !== -1){//找到相同的产品 则修改数量，小计
                let numTemp = Number(cartGoods[index].num)+Number(res.num);
                res.num = numTemp;
                dispatch('updateGood',{'index':index,'res':res});
            }else{
                commit('ADDCARTGOODS',res);//添加产品
            }
        }else{
            commit('ADDCARTGOODS',res);//添加产品
        }
        dispatch('setOrderMethod');//设置配送方式
        dispatch('setOrderTotalMoney');
        dispatch('setBuyInstallFlag');//设置是否可购买安装服务
    },
    updateGood({state,commit,dispatch},data){//更新产品数量，小计，应付，实付金额
        const index = data.index;
        let updateGoodJson = {};
        let num = data.res.num;
        if(data.res.canal === 'ziti'){
            num = num > data.res.org_store ? data.res.org_store : num;
        }else{
            num = num > data.res.store ? data.res.store : num;
        }
        const sum = Number(num*data.res.price);
        data.res.num = num;
        data.res.sum = sum;
        updateGoodJson.index = index;
        updateGoodJson.goodData = data.res;
        commit('UPDATEGOODDATA',updateGoodJson);//更新购物车产品数量及小计
        //查看是否有安装服务 同时修改安装服务的数量
        if(data.res.install_pid){
            dispatch('updateServiceGood',{proItem:data.res});
        }
        dispatch('setOrderTotalMoney');
    },
    setOrderTotalMoney({state,commit}){//设置订单总金额 添加产品，删除产品，更改数量，标记赠品，提取订单
        let totalMoney = 0,serviceMoney = 0;
        state.goods.forEach( function(item, il) {
            if(item.install_flag === 'false'){//产品
                totalMoney += Number(item.num*item.price);
            }else{//安装服务
                serviceMoney += Number(item.num*item.price);
            }
        });
        const selectedZitiMethod = state.goods.every(function (e1) {
            return e1.canal === 'ziti';
        });
        serviceMoney = serviceMoney > 0 ? serviceMoney < 80 ? 80 : serviceMoney : 0;
        totalMoney += serviceMoney;

        commit('UPDATEORDERMONEY',{'totalMoney':totalMoney,'selectedZitiMethod':selectedZitiMethod});//设置订单总金额 实付金额
    },
    setOrderMethod({state,commit}){//设置配送方式 添加产品，删除产品，产品设置配送方式，提取订单
        const wuliuFlag = state.goods.some(item=>{
            return item.wuliu === 'true';//是否有大件
        });
        const method = wuliuFlag?'wuliu':'kuaidi';
        commit('SETORDERMETHOD',method);//设置订单的配送方式
        commit('RESETGOODMETHOD');//重置产品的配送方式
    },
    setBuyInstallFlag({state,commit},type){//设置是否可购买安装服务 设置是否有定制品
        if(!type){
            const buyInstallFlag = state.goods.some(item=>{
                return item.install === 'true';//是否有安装服务
            });
            commit('SETBUYINSTALLFLAG',buyInstallFlag);//设置是否可购买安装服务
        }
        const isStandFlag = state.goods.some(item=>{
            return item.is_stand == 1 ;//是否有定制品
        });
        let standSendTime = "",updateGoodsSendTimes = [];//仓库完成日期
        if(isStandFlag){//有定制品 且仓库完成日期为空 则获取45天后的日期为仓库完成日期
            if(!state.cumtomFormData.sendProDate){
                standSendTime = getDateStr(45);
            }
            updateGoodsSendTimes = state.goods.map((item)=>{
                if(!item.send_time){
                    item.send_time = item.send_time_sys;
                }
                return item;
            });
        }else{//没有定制品，判断标准品中是否有交期时间 有则获取最晚的时候赋值给仓库完成时间 再清空标准品的交期时间
            let sendTimes = [];
            updateGoodsSendTimes = state.goods.map((item)=>{
                if(item.send_time){
                    sendTimes.push(item.send_time);
                    item.send_time = "";
                }
                return item;
            });
            if(sendTimes.length > 0){
                sendTimes.sort();
                standSendTime = sendTimes[sendTimes.length-1];
            }
        }
        commit('SETISSTANDFLAG',{isStandFlag:isStandFlag,standSendTime:standSendTime});//设置是否有定制品
        commit('ADDSERVICES',updateGoodsSendTimes);//重置标准品的交期时间
    },
    addService({state,commit,dispatch},lists) {//添加安装服务
        //先删除购物车里的安装服务
        let newArr = state.goods.filter(function(item,index) {
            if(item.install_flag === 'false'){//产品
                return item;
            }
        });
        let goods = newArr.concat(lists);
        commit('ADDSERVICES',goods);
        dispatch('setOrderTotalMoney');
    },
    updateServiceGood({state,commit},data){//更改安装服务的数量
        //找到对应的安装服务
        const serviceIndex = state.goods.findIndex(function (item) {
            return data.proItem.install_pid === item.product_id;
        });
        if(serviceIndex !== -1){//找到安装服务，同时修改数量   产品修改数量，删除产品时都需要调用这个方法 安装服务和产品存在一对多的关系
            let item = state.goods[serviceIndex];
            let relaPros = item.parent_id;
            let serviceNum = 0,num = 0,temp = false;
            let tempItem;
            if(relaPros && relaPros.length>0){
                relaPros.forEach(function (item, index) {
                    state.goods.forEach(function (el, il) {
                        if(item === el.product_id){
                            serviceNum += Number(el.num);
                            num++;
                            if(!temp) {//删除产品时 重置安装服务的配送方式及空间
                                if(!tempItem){
                                    tempItem = el;
                                }
                                if(el.canal === 'wuliu' || el.canal === 'kuaidi'){
                                    tempItem = el;
                                    temp = true;
                                }
                            }
                        }
                    });
                });
                if(num > 0){
                    const sum = Number(serviceNum*item.price);
                    item.num = serviceNum;
                    item.sum = sum;
                    item.canal = tempItem.canal;
                    item.space = tempItem.space;
                    item.channel = tempItem.channel;
                    item.send_time = tempItem.send_time;
                    commit('UPDATEGOODDATA',{index:serviceIndex,goodData:item});//更新安装服务
                }else{//删除安装服务
                    commit('DELETEGOOD',serviceIndex);
                }
            }else{
                throw {message:'安装服务获取关联产品错误'};
            }
        }
    }
}