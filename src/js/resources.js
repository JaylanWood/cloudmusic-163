{
    let view = {
        el: '.library>.resources',
        template: `
            <ul class="images">
                
            </ul>
        `,
        init() {
            this.$el = $(this.el)
        },
        render(images) {
            // 渲染ul
            this.$el.html(this.template)
            images.map((image) => {
                // 创建li
                let $Li = $('<li></li>').attr('data-image-id', image.id)
                // 替换li的html
                let html = `<img src="{{url}}"><span class="imgName">{{name}}</span><button class="copyImgUrl">复制链接</button>`
                let palcehold = ['name', 'url']
                palcehold.map((string) => {
                    html = html.replace(`{{${string}}}`, image[string])
                })
                // 渲染li
                $Li.html(html)
                // ul插入li
                this.$el.find('ul').append($Li)
            })
        }
    }
    let model = {
        data: {
            images: [
                // {name:'',id:'',url:''}
            ],
            selectedImageId: ''
        },
        reset() {
            this.data.images = []
        },
        create(data) {
            this.data.images.push(data)
        },
        getAvObject() {
            return new AV.Query('Image').find()
        },
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.model.getAvObject()
                .then((images) => {
                    this.model.data.images = []
                    images.map((image) => {
                        this.model.data.images.push({
                            'name': image.attributes.name,
                            'id': image.id,
                            'url': image.attributes.url
                        })
                    })
                    return images
                })
                .then((images) => {
                    this.view.render(this.model.data.images)
                    return images
                })
            this.bindEvents()
        },
        bindEvents() {
            window.eventHub.on('imageSaved', () => {
                this.model.getAvObject()
                    .then((images) => {
                        this.model.reset()
                        images.map((image) => {
                            this.model.data.images.push({
                                'name': image.attributes.name,
                                'id': image.id,
                                'url': image.attributes.url
                            })
                        })
                        return images
                    })
                    .then((images) => {
                        this.view.render(this.model.data.images)
                        return images
                    })
            })
            window.eventHub.on('deleted', () => {
                console.log('删除了啊')
                this.model.getAvObject()
                    .then((images) => {
                        this.model.reset()
                        images.map((image) => {
                            this.model.data.images.push({
                                'name': image.attributes.name,
                                'id': image.id,
                                'url': image.attributes.url
                            })
                        })
                        return images
                    })
                    .then((images) => {
                        console.log(this.model.data.images)
                        this.view.render(this.model.data.images)
                        console.log('渲染了啊')
                        return images
                    })

            })
            $(this.view.el).on('click', 'li', (eee) => {
                let $li = $(eee.currentTarget)
                this.model.selectedImageId = $li.attr('data-image-id')
                let selectedImage;
                for (let i = 0; i < this.model.data.images.length; i++) {
                    if (this.model.data.images[i].id === this.model.selectedImageId) {
                        selectedImage = this.model.data.images[i]
                        break
                    }
                }
                window.eventHub.emit('editResource', selectedImage)
            })
        }
    }
    controller.init(view, model)
}