class Vue {

    constructor({
        el,
        data,
        methods
    }) {
        this.el = document.querySelector(el)
        this.data = data
        this.methods = methods
        this.showPool = new Map()
        this.eventPool = new Map()
        this.init()
    }

    init() {
        this.proxyData()
        this.initDom(this.el)
        this.initView(this.showPool)
        this.initEvent(this.eventPool)
    }

    /* 1. 代理数据 */
    proxyData() {
        for (let key in this.data) {
            Object.defineProperty(this, key, {
                get() {
                    console.log(`响应式获取`);
                    return this.data[key]
                },
                set(newval) {
                    console.log(`响应式设置`);
                    this.domChange(key, this.showPool)
                    this.data[key] = newval
                }
            })
        }
    }

    /* 2. 初始化DOM */
    initDom(el) {

        const _childNodes = el.childNodes

        if (!_childNodes.length) {
            return
        }

        _childNodes.forEach(dom => {
            if (dom.nodeType === 1) {
                const vif = dom.getAttribute('v-if')
                const vshow = dom.getAttribute('v-show')
                const event = dom.getAttribute('@click')
                if (vif) {
                    this.showPool.set(dom, {
                        type: 'if',
                        show: this.data[vif],
                        data: vif
                    })
                } else if (vshow) {
                    this.showPool.set(dom, {
                        type: 'show',
                        show: this.data[vshow],
                        data: vshow
                    })
                }
                if (event) {
                    this.eventPool.set(dom, this.methods[event])
                }
            }

            this.initDom(dom)

        })

    }

    /* 3.初始化视图 */
    initView(showPool) {
        for (const [k, v] of showPool) {
            switch (v.type) {
                case 'if':
                    v.comment = document.createComment(`v-if`)
                    if (!v.show) {
                        k.parentNode.replaceChild(v.comment, k)
                    }
                    break;
                case 'show':
                    if (!v.show) {
                        k.style.display = 'none'
                    }
                    break;
                default:
                    break;
            }
        }
    }

    /* 4. eventPool事件处理函数的绑定 */
    initEvent(eventPool) {
        for (const [k, v] of eventPool) {
            k.addEventListener('click', v.bind(this), false)
        }
    }

    /* 5. 改变数据的同时,改变DOM */
    domChange(data, showPool) {
        for (const [k, v] of showPool) {
            if (v.data === data) {
                switch (v.type) {
                    case 'if':
                        if (v.show) {
                            k.parentNode.replaceChild(v.comment, k)
                        } else {
                            v.comment.parentNode.replaceChild(k, v.comment)
                        }
                        v.show = !v.show
                        break;
                    case 'show':
                        if (v.show) {
                            k.style.display = 'none'
                        } else {
                            k.style.display = 'block'
                        }
                        v.show = !v.show
                        break;
                    default:
                        break;
                }
            }
        }
    }

}

let p = new Vue({
    el: '#app',
    data: {
        ifbox1: false,
        ifbox2: false,
        showbox1: false,
        showbox2: false
    },
    methods: {
        funbtn1() {
            this.ifbox1 = !this.ifbox1
        },
        funbtn2() {
            this.ifbox2 = !this.ifbox2s
        },
        funbtn3() {
            this.showbox1 = !this.showbox1
        },
        funbtn4() {
            this.showbox2 = !this.showbox2
        }
    }
})