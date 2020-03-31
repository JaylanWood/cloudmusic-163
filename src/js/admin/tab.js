{
    let view = {
        el: '#tab',
        init() {
            this.$el = $(this.el)
        },
        activeSelfAndDeactiveSiblings(jQelement) {
            jQelement.addClass('active').siblings().removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.bindEvents()
        },
        bindEvents() {
            this.view.$el.on('click', 'li', (eee) => {
                let $li = $(eee.currentTarget)
                let tabName = $li.attr('data-tab-name')
                this.view.activeSelfAndDeactiveSiblings($li)
                window.eventHub.emit('tab-selectTab', tabName)
            })
            $(document).ready(() => {
                this.view.$el.find('ul li:first-child').trigger('click')
            })
        },
    }
    controller.init(view, model)
}