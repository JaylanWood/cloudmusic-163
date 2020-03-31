{
    let view = {
        el: '#song-page>.manage',
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
            this.loadModule('./js/admin/song-page/uploadResource.js')
            this.loadModule('./js/admin/song-page/editResource.js')
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
            window.eventHub.on('addResource-song', () => {
                this.view.show()
            })
            window.eventHub.on('editResource-song', () => {
                this.view.show()
            })
            window.eventHub.on('editResource-song-save',()=>{
                this.view.hide()
            })
            window.eventHub.on('editResource-song-cancel',()=>{
                this.view.hide()
            })
            window.eventHub.on('editResource-song-delete',()=>{
                this.view.hide()
            })
        },
    }
    controller.init(view, model)
}