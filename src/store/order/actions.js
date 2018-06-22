export default {
    addGoods({state,commit,dispatch},res){//添加产品到购物车
        const cartGoods =  state.goods;
        res.space = '主卧';//空间
        res.is_custom = res.is_custom === 'true'?true:false;//是否是定制单
        res.is_stand = res.is_custom === true?1:0;//是否是定制单
        res.is_standSelected = res.is_stand === 1?true:false;//是否选中定制单
        res.sum = Number(res.num*res.price);
        res.gifs_flag = false;//是否是赠品
        res.fileStr = '';//附件
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
        dispatch('setOrderTotalMoney');
        dispatch('setOrderMethod');//设置配送方式
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
        dispatch('setOrderTotalMoney');
    },
    setOrderTotalMoney({state,commit}){//设置订单总金额 添加产品，删除产品，更改数量，标记赠品，提取订单
        let totalMoney = 0;
        state.goods.forEach( function(item, il) {
            totalMoney += Number(item.num*item.price);
        });
        commit('UPDATEORDERMONEY',{'totalMoney':totalMoney});//设置订单总金额 实付金额
    },
    setOrderMethod({state,commit}){//设置配送方式 添加产品，删除产品，产品设置配送方式，提取订单
        const wuliuFlag = state.goods.some(item=>{
            return item.wuliu === 'true';//是否有大件
        });
        const method = wuliuFlag?'wuliu':'kuaidi';
        commit('SETORDERMETHOD',method);//设置订单的配送方式
        commit('RESETGOODMETHOD');//重置产品的配送方式
    }
}