{
    let view = {
        el: '#playlist-page>.manage',
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
            this.loadModule('./js/admin/playlist-page/editResource.js')
        },
        loadModule(src) {
            let script = document.createElement('script')
            script.src = src
            document.body.appendChild(script)
        },
        bindEventHub() {
            window.eventHub.on('tab-selectTab', () => {
                this.view.hide()
            })
            window.eventHub.on('addResource-playlist', () => {
                this.view.show()
            })
            window.eventHub.on('editResource-playlist', () => {
                this.view.show()
            })
            window.eventHub.on('editResource-playlist-save',()=>{
                this.view.hide()
            })
            window.eventHub.on('editResource-playlist-cancel',()=>{
                this.view.hide()
            })
            window.eventHub.on('editResource-playlist-delete',()=>{
                this.view.hide()
            })
        },
    }
    controller.init(view, model)
}