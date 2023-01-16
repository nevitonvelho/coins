import axios from 'axios';
import { create } from 'zustand'
import debounce from '../helpers/debounce';

const homeStore = create((set) => ({
    coins: [],
    trending: [],
    query: '',

    setQuery: (e) => {
        set({query: e.target.value})
        homeStore.getState().searchCoins()
    },

    searchCoins: debounce ( async () => {
        const {query, trending} = homeStore.getState()
        const res =  await axios.get(`https://api.coingecko.com/api/v3/search?query=${query}`)

        if (query.length > 2){
            const coins = res.data.coins.map(coin => {
                return {
                    name: coin.name,
                    image: coin.large,
                    id: coin.id
                }
            });
    
            set({coins});
        } else {
            set({coins: trending});
        }
        
    }, 500),

    fetchCoins: async () => {
        const res = await axios.get('https://api.coingecko.com/api/v3/search/trending')

        const coins = res.data.coins.map(coin => {
            return {
                name: coin.item.name,
                image: coin.item.image,
                id: coin.item.id,
                priceBtc: coin.item.price_btc,
                
            }
        })

        set ({coins})        
    }
}))

export default homeStore;   