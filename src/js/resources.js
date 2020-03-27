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
            this.data.images = data
        },
        getDataFormAv() {
            return new AV.Query('Image').find().then((images) => {
                this.data.images = images.map((image) => {
                    return {
                        id: image.id,
                        ...image.attributes
                    }
                })
                return images
            })
        },
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.rednerAfterGetDataFormAv()
            this.bindEventHub()
            this.bindEvents()
        },
        rednerAfterGetDataFormAv() {
            this.model.getDataFormAv().then((images) => {
                this.view.render(this.model.data.images)
                return images
            })
        },
        bindEventHub() {
            window.eventHub.on('imageSaved', () => {
                this.rednerAfterGetDataFormAv()
            })
            window.eventHub.on('deleted', () => {
                this.rednerAfterGetDataFormAv()
            })
        },
        bindEvents() {
            this.view.$el.on('click', 'li', (eee) => {
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

            this.view.$el.on('click', '.copyImgUrl', (eee) => {
                eee.stopPropagation()
                let url = $(eee.currentTarget).siblings('img').attr('src')
                this.copyContent(url)
            })
        },
        copyContent(content) {
            let aux = document.createElement("input")
            aux.setAttribute("value", content)
            document.body.appendChild(aux)
            aux.select()
            document.execCommand("copy",true)
            document.body.removeChild(aux)
        }
    }
    controller.init(view, model)
}