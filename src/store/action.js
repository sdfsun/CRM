import { setStore,getStore } from '@/utils/'

export default{
    setCustomSource({commit},name){
        const customSources = JSON.parse(getStore(name));
        commit('SETCUSTOMSOURCE',customSources);
    },
    updateCustomSource({state,commit},result){
        let customSources = state.customSource.slice();
        const index = state.customSource.findIndex(function(item, index, arr) {
            return item.id === result.id;
        });
        customSources[index] = result;
        setStore("customSource",customSources);
        commit('SETCUSTOMSOURCE',customSources);
    },
    addCustomSource({state,commit},result){
        let customSources = state.customSource.slice();
        customSources.push(result);
        setStore("customSource",customSources);
        commit('SETCUSTOMSOURCE',customSources);
    }
}