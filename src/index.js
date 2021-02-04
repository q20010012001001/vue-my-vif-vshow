class Vue {
    constructor(options) {
        let {
            data,
            methods,
            el
        } = options
        this.data = data
        this.methods = methods
        this.el = document.querySelector(el)
        this.showPool = new Map()
        this.eventPool = new Map()
        this.init()
    }

    init() {
        this.initData()
        this.initDom(this.el)
        this.initEvent(this.eventPool)
        this.initView(this.showPool)
    }

    /* 1.数据劫持 */
    initData() {
        for (let key in this.data) {
            Object.defineProperty(this, key, {
                get() {
                    return this.data[key]
                },
                set(newval) {
                    this.changeDom(key, this.showPool)
                    this.data[key] = newval
                }
            })
        }
    }

    /* 2. 初始化Dom */
    initDom(el) {

        let _childnode = el.childNodes
        if (!_childnode.length) {
            return
        }

        _childnode.forEach(dom => {
            if (dom.nodeType == 1) {
                let vif = dom.getAttribute('v-if')
                let vshow = dom.getAttribute('v-show')
                let vclick = dom.getAttribute('@click')
                if (vif) {
                    this.showPool.set(dom, {
                        type: 'if',
                        show: this.data[vif],
                        data: vif
                    })
                }
                if (vshow) {
                    this.showPool.set(dom, {
                        type: 'show',
                        show: this.data[vshow],
                        data: vshow
                    })
                }
                if (vclick) {
                    this.eventPool.set(dom, this.methods[vclick])
                }
            }
            this.initDom(dom)
        })

    }

    /* 3. 初始化视图 */
    initView(showPool) {
        for (const [k, v] of showPool) {
            if (v.type == 'if') {
                let comment = document.createComment('v-if')
                v.comment = comment
                if (!v.show) {
                    k.parentNode.replaceChild(v.comment, k)
                }
            }
            if (v.type == 'show') {
                if (!v.show) {
                    k.style.display = 'none'
                }
            }
        }
    }

    /* 4. 初始化事件 */
    initEvent(eventPool) {
        for (const [k, v] of eventPool) {
            k.addEventListener('click', v.bind(this), false)
        }
    }

    /* 5. 改变数据同步dom */
    changeDom(data, showPool) {
        for (const [k, v] of showPool) {
            if (v.data == data) {
                if (v.type == 'if') {
                    v.show ? k.parentNode.replaceChild(v.comment, k) : v.comment.parentNode.replaceChild(k, v.comment)
                    v.show = !v.show
                }
                if (v.type == 'show') {
                    v.show ? k.style.display = 'none' : k.style.display = 'block';
                    v.show = !v.show
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
            console.log(this);
            this.ifbox1 = !this.ifbox1
        },
        funbtn2() {
            this.ifbox2 = !this.ifbox2
        },
        funbtn3() {
            this.showbox1 = !this.showbox1
        },
        funbtn4() {
            this.showbox2 = !this.showbox2
        },
    }
})