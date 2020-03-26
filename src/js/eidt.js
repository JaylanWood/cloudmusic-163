{
    let view = {
        el: '.editResource>.edit',
        template: `
            <form>
                <h3>编辑封面</h3>
                <div class="row">
                    <label>
                        <span>名字：</span>
                        <input name="name" type="text" value="{{name}}">
                    </label>
                </div>
                <div class="row">
                    <label>
                        <span>链接：</span>
                        <input name="url" type="text" value="{{url}}">
                    </label>
                </div>
                <div class="row">
                    <label>
                        <span>预览：</span>
                        <img src="{{url}}" width="200">
                    </label>
                </div>
                <div id="editBtn" class="row">
                    <button type="submit" class="save">保存</button>
                    <button type="button" class="cancel">取消</button>
                </div>
            </form>
        `,
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            let placehold = ['name', 'url', 'url']
            let html = this.template
            placehold.map((string) => {
                html = html.replace(`{{${string}}}`, data[string] || '')
            })
            $(this.el).html(html)
            if (data.id) {
                $(this.el).find('#editBtn').append('<button type="button" class="delete">删除</button>')
            } 
        },
        reset() {
            this.render({})
        },
        show() {
            $(this.el).removeClass('hidden').addClass('active')
        },
        hide() {
            $(this.el).removeClass('active').addClass('hidden')
        }
    }
    let model = {
        data: {
            'name': '',
            'url': '',
        },
        reset() {
            this.data = {}
        },
        create(data) {
            this.data = data
        },
        saveAvObject(className, data) {
            let AvObjetct = AV.Object.extend(className)
            let avObjetct = new AvObjetct()
            return avObjetct.set(data).save()
        },
        updateAvObject(className, data) {
            return AV.Object.createWithoutData(className, data.id).set(data).save()
        },
        deleteAvObject(className, id) {
            return AV.Object.createWithoutData(className, id).destroy()
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.bindEvents()
        },
        bindEvents() {
            window.eventHub.on('addResource', () => {
                this.model.reset()
                this.view.reset()
                this.view.show()
            })
            window.eventHub.on('uploaded', (data) => {
                this.model.create(data)
                this.view.render(this.model.data)
            })
            window.eventHub.on('editResource', (data) => {
                this.view.show()
                this.model.reset()
                this.model.create(data)
                this.view.render(this.model.data)
            })
            window.eventHub.on('imageSaved', () => {
                this.view.hide()
            })
            window.eventHub.on('cancelEdit', () => {
                this.view.hide()
            })
            this.view.$el.on('submit', (eee) => {
                eee.preventDefault()
                this.model.data.name = $(this.view.el).find(`[name="name"]`).val()
                this.model.data.url = $(this.view.el).find(`[name="url"]`).val()

                if (this.model.data.id) {
                    this.model.updateAvObject('Image', this.model.data)
                        .then((image) => {
                            window.eventHub.emit('imageSaved', {
                                'name': image.attributes.name,
                                'id': image.id,
                                'url': image.attributes.url
                            })
                        })
                } else {
                    this.model.saveAvObject('Image', {
                        'name': this.model.data.name,
                        'url': this.model.data.url
                    }).then((image) => {
                        window.eventHub.emit('imageSaved', {
                            'name': image.attributes.name,
                            'id': image.id,
                            'url': image.attributes.url
                        })
                    })
                }
            })
            this.view.$el.on('click', '.cancel', () => {
                window.eventHub.emit('cancelEdit')
            })
            this.view.$el.on('click', '.delete', () => {
                this.model.deleteAvObject('Image', this.model.data.id)
                    .then(() => {
                        window.eventHub.emit('deleted')
                    })
                    .then(() => {
                        this.view.hide()
                    })
            })
        },
    }
    controller.init(view, model)
}