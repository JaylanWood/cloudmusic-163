{
    let view = {
        el: '#song-page>.library>.addResource',
        template: `
            <button>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-add"></use>
                </svg>
                <span>新建歌曲</span>
            </button>
        `,
        init() {
            this.$el = $(this.el)
        },
        render() {
            this.$el.html(this.template)
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
            this.view.render()
            this.view.show()
            this.bindEvents()
        },
        bindEvents() {
            this.view.$el.find('button').on('click', () => {
                window.eventHub.emit('addResource-song')
            })
        },
    }
    controller.init(view, model)
}