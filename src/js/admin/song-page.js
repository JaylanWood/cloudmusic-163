{
    let view = {
        el: '#song-page',
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
            this.bindEvents()
            this.loadModule('./js/admin/song-page/library.js')
            this.loadModule('./js/admin/song-page/manage.js')
        },
        loadModule(src) {
            let script = document.createElement('script')
            script.src = src
            document.body.appendChild(script)
        },
        bindEventHub() {
            window.eventHub.on('tab-selectTab', (tabName) => {
                if (tabName === 'song-page') {
                    this.view.show()
                } else {
                    this.view.hide()
                }
            })

        },
        bindEvents() {
            $(document).ready(() => {
                this.view.show()
            })
        }
    }
    controller.init(view, model)
}