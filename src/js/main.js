import Vue from 'vue'
import VueResource from 'vue-resource'

import { find, sumBy, indexOf } from 'lodash'

Vue.use(VueResource)

new Vue({
    el: 'body',

    data: {
        products: [],
        productDetail: {
            name: '',
            image: '',
            effect: '',
            ingredient: '',
            price: '',
        },
        productToCart: [],
        productTotal: '',

        openDetails: false,
        showMenu: false,
        cart: false,
    },

    methods: {
        /**
         * Abre a lightbox com informações do produto
         * sendo alimentadas por uma chamada AJAX com
         * base no ID passado
         *
         * @param  {int} id ID do produto
         * @return {obj}    Objeto com as informações do produto
         */
        openProduct(id) {
            this.openDetails = true
            this.productDetail = find(this.products, {'id': id})
        },

        /**
         * Fecha a lightbox com detalhes dos produtos
         *
         * @return {boolean}
         */
        closeDetails () {
            this.openDetails = false
        },

        /**
         * Abre o menu 'sanduíche' em dispositíveis móveis
         *
         * @return {boolean}
         */
        openMenu () {
            this.showMenu = true
        },

        /**
         * Fecha o menu 'sanduíche' em dispositíveis móveis
         *
         * @return {boolean}
         */
        closeMenu () {
            this.showMenu = false
        },

        /**
         * Fecha informações do carrinho pelo ícone interno
         *
         * @return {boolean}
         */
        closeCart () {
            this.cart = false
        },

        /**
         * Toggle padrão
         * Mostra ou esconde o carrinho
         *
         * @return {boolean}
         */
        toggleCart () {
            if ( this.cart ) {
                this.cart = false
            } else {
                this.cart = true
            }
        },

        /**
         * Adiciona um produto no carrinho e realiza a soma
         *
         * @param {int} id ID do produto
         */
        addToCart (id) {
            const prod = find(this.products, {'id': id})

            if ( !find(this.productToCart, {'id': prod.id}) ) {
                this.productToCart.push({
                    id: prod.id,
                    name: prod.name,
                    image: prod.image,
                    price: prod.price,
                    qnt: 1,
                    total: prod.price,
                })

                this.sumAndClose()
                return false
            }

            let index = this.findProd(prod.id)
            this.productToCart[index].qnt++
            this.productToCart[index].total += this.productToCart[index].price

            this.sumAndClose()
        },

        /**
         * Remove uma quantidade de produto do carrinho pelo seu id
         *
         * @param  {int} id ID do produto
         * @return {obj}    Decrementa a quantidade. Se chegar a 'zero', elimina
         * o produto do array
         */
        removeToCart (id) {
            let index = this.findProd(id)

            this.productToCart[index].qnt--
            this.productToCart[index].total -= this.productToCart[index].price

            this.productTotal = parseFloat(sumBy(this.productToCart, 'total').toFixed(2))

            if ( this.productToCart[index].qnt == 0 ) {
                this.productToCart.splice(index, 1)
            }
        },

        /**
         * Procura o produto pelo id correspondente
         *
         * @param  {int} id ID do produto procurado
         * @return {int}    Retorna o índice do produto
         */
        findProd (id) {
            let found = find(this.productToCart, {'id': id})

            if ( found ) {
                let index = indexOf(this.productToCart, found)

                return index
            }
        },

        /**
         * Soma o valor total dos itens no carrinho e
         * fecha a lightbox após o clique em 'Add to Cart'
         */
        sumAndClose () {
            this.productTotal = parseFloat(sumBy(this.productToCart, 'total').toFixed(2))
            this.openDetails = false
        },
    },

    /**
     * Após carregado o DOM, realiza a chamada AJAX e
     * armazena os objetos no objeto local 'products'
     *
     * @return {obj} Objeto com os produtos
     */
    ready () {
        this.$http.get('potions.json').then( ({ data }) => {
            this.products = data.potions
        })
    }
})
