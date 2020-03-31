{
    let view = {
        el: '#cover-page>.library>.showResource',
        template: `<ul class="covers"></ul>`,
        init() {
            this.$el = $(this.el)
        },
        render(dataArr) {
            this.$el.html(this.template)
            dataArr.map((dataObj) => {
                let $Li = $('<li></li>').attr('data-id', dataObj.id)
                let html = `
                    <img src="{{coverUrl}}" width="200">
                    <span class="imgName">{{coverName}}</span>
                    <button class="copyImgUrl">复制链接</button>
                `
                let palcehold = ['coverName', 'coverUrl']
                palcehold.map((string) => {
                    html = html.replace(`{{${string}}}`, dataObj[string])
                })
                $Li.html(html)
                this.$el.find('ul').append($Li)
            })
        },
        show() {
            this.$el.addClass('active')
        },
        hide() {
            this.$el.removeClass('active')
        }
    }
    let model = {
        data: {
            dataArr: [], // [ {name:'',url:''}, {name:'',url:''} ]
            selectedDataObjId: ''
        },
        avClassName:'Cover',
        reset() {
            this.data.dataArr = []
        },
        create(dataArr) {
            this.data.dataArr = dataArr
        },
        getDataArrFormAv(avClassName) {
            return new AV.Query(avClassName).find().then((dataArr) => {
                this.data.dataArr = dataArr.map((dataObj) => {
                    return {
                        id: dataObj.id,
                        ...dataObj.attributes
                    }
                })
                return dataArr
            })
        },
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.view.show()
            this.renderAfterGetDataArrFormAv(this.model.avClassName)
            this.bindEventHub()
            this.bindEvents()
        },
        bindEventHub() {
            window.eventHub.on('editResource-cover-save', () => {
                this.renderAfterGetDataArrFormAv(this.model.avClassName)
            })
            window.eventHub.on('editResource-cover-delete', () => {
                this.renderAfterGetDataArrFormAv(this.model.avClassName)
            })
        },
        bindEvents() {
            this.view.$el.on('click', 'li', (eee) => {
                let $li = $(eee.currentTarget)

                this.model.data.selectedDataObjId = $li.attr('data-id')
                let selectedDataObj;
                for (let i = 0; i < this.model.data.dataArr.length; i++) {
                    if (this.model.data.dataArr[i].id === this.model.data.selectedDataObjId) {
                        selectedDataObj = this.model.data.dataArr[i]
                        break
                    }
                }
                console.log('选中的对象ID:' + selectedDataObj.id)
                window.eventHub.emit('editResource-cover', selectedDataObj)
            })

            this.view.$el.on('click', '.copyImgUrl', (eee) => {
                eee.stopPropagation()

                let url = $(eee.currentTarget).siblings('img').attr('src')
                this.copyContent(url)
            })
        },
        renderAfterGetDataArrFormAv(avClassName) {
            this.model.getDataArrFormAv(avClassName).then(() => {
                this.view.render(this.model.data.dataArr)
            })
        },
        copyContent(content) {
            let aux = document.createElement("input")
            aux.setAttribute("value", content)
            document.body.appendChild(aux)
            aux.select()
            document.execCommand("copy", true)
            document.body.removeChild(aux)
        }
    }
    controller.init(view, model)
}