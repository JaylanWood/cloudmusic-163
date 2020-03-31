{
    let view = {
        el: '#cover-page>.library',
        init() {
            this.$el = $(this.el)
        },
        show() {
            this.$el.addClass('active')
        },
        hide() {
            this.$el.removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.bindEventHub()
            this.loadModule('./js/admin/cover-page/addResource.js')
            this.loadModule('./js/admin/cover-page/showResource.js')
        },
        loadModule(src) {
            let script = document.createElement('script')
            script.src = src
            document.body.appendChild(script)
        },
        bindEventHub() {
            window.eventHub.on('tab-selectTab', (tabName) => {
                if (tabName === 'cover-page') {
                    this.view.show()
                } else {
                    this.view.hide()
                }
            })
        },
    }
    controller.init(view, model)
}