{
    let view = {
        el: '.library>.addResource',
        template: `
            <button>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-add"></use>
                </svg>
                <span>新建</span>
            </button>
        `,
        init() {
            this.$el = $(this.el)
        },
        render() {
            this.$el.html(this.template)
        }
    }
    let model = {

    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.view.render()
            this.bindEvents()
        },
        bindEvents() {
            this.view.$el.find('button').eq(0).on('click', () => {
                window.eventHub.emit('addResource')
            })
        }
    }
    controller.init(view, model)
}