{
    let view = {
        el: '#playlist-page>.manage>.editResource',
        template: `
            <form>
                <h3>歌单信息</h3>
                <div class="row">
                    <label>
                        <span>名字：</span>
                        <input name="playlistName" type="text" value="{{playlistName}}">
                    </label>
                </div>
                <div class="row">
                    <label>
                        <span>简介：</span>
                        <input name="summary" type="text" value="{{summary}}">
                    </label>
                </div>
                <div class="row">
                    <label>
                        <span>标签：</span>
                        <input name="tag" type="text" value="{{tag}}">
                    </label>
                </div>
                <div class="row">
                    <label>
                        <span>描述：</span>
                        <input name="description" type="text" value="{{description}}">
                    </label>
                </div>
                <div class="row">
                    <label>
                        <span>歌单封面链接：</span>
                        <input name="coverUrl" type="text" value="{{coverUrl}}">
                    </label>
                </div>
                <div class="row">
                    <label>
                        <span>歌单封面预览：</span>
                        <img src="{{coverUrl}}" width="200">
                    </label>
                </div>
                <div class="row">
                    <label>
                        <span>编辑者：</span>
                        <input name="editor" type="text" value="{{editor}}">
                    </label>
                </div>
                <div class="row">
                    <label>
                        <span>编辑者封面链接：</span>
                        <input name="editorCover" type="text" value="{{editorCover}}">
                    </label>
                </div>
                <div class="row">
                    <label>
                        <span>添加歌曲：</span>
                        <input name="songUrl" type="text" value="{{songUrl}}">
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
        render(dataObj) {
            let placehold = ['playlistName', 'summary', 'tag', 'description', 'coverUrl', 'coverUrl', 'editor', 'editorCover', 'songUrl']
            let html = this.template
            placehold.map((string) => {
                html = html.replace(`{{${string}}}`, dataObj[string] || '')
            })
            this.$el.html(html)
            if (dataObj.id) {
                this.$el.find('#editBtn').append('<button type="button" class="delete">删除</button>')
            }
        },
        reset() {
            this.render({})
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
            dataObj: {} // {'name':'','url':'','id':''}
        },
        avClassName: 'Playlist',
        reset() {
            this.data.dataObj = {}
        },
        create(dataObj) {
            this.data.dataObj = dataObj
        },
        saveAvObject(avClassName, dataObj) {
            let AvObjetct = AV.Object.extend(avClassName)
            return new AvObjetct().set(dataObj).save()
        },
        updateAvObject(avClassName, dataObj) {
            return AV.Object.createWithoutData(avClassName, dataObj.id).set(dataObj).save()
        },
        deleteAvObject(avClassName, id) {
            return AV.Object.createWithoutData(avClassName, id).destroy()
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.bindEventHub()
            this.bindEvents()
        },
        bindEventHub() {
            window.eventHub.on('addResource-playlist', () => {
                this.model.reset()
                this.view.reset()
                this.view.show()
            })
            window.eventHub.on('editResource-playlist', (selectedDataObj) => {
                this.model.data.dataObj = selectedDataObj
                this.view.render(this.model.data.dataObj)
                this.view.show()
            })
            window.eventHub.on('fileUploadToQiniu-playlist', (fileObj) => {
                this.view.render(fileObj)
            })
        },
        bindEvents() {
            this.view.$el.on('submit', (eee) => {
                eee.preventDefault()

                let needValue = ['playlistName', 'summary', 'tag', 'description', 'coverUrl', 'editor', 'editorCover', 'songUrl']
                needValue.map((string) => {
                    this.model.data.dataObj[string] = this.view.$el.find(`[name="${string}"]`).val()
                })

                if (this.model.data.dataObj.id) {
                    this.model.updateAvObject(this.model.avClassName, this.model.data.dataObj)
                        .then((dataObj) => {
                            let {
                                id,
                                attributes
                            } = dataObj
                            let dataObjWithId = Object.assign(this.model.data.dataObj, {
                                id,
                                ...attributes
                            })
                            console.log('更新成功')
                            console.log(dataObjWithId)
                            window.eventHub.emit('editResource-playlist-save')
                        })
                } else {
                    this.model.saveAvObject(this.model.avClassName, this.model.data.dataObj)
                        .then((dataObj) => {
                            let {
                                id,
                                attributes
                            } = dataObj
                            let dataObjWithId = Object.assign(this.model.data.dataObj, {
                                // id,
                                ...attributes
                            })
                            console.log('保存成功')
                            console.log(dataObjWithId)
                            window.eventHub.emit('editResource-playlist-save')
                        })
                }
            })
            this.view.$el.on('click', '.cancel', () => {
                window.eventHub.emit('editResource-playlist-cancel')
            })
            this.view.$el.on('click', '.delete', () => {
                this.model.deleteAvObject(this.model.avClassName, this.model.data.dataObj.id)
                    .then(() => {
                        window.eventHub.emit('editResource-playlist-delete')
                    })
            })
        },
    }
    controller.init(view, model)
}