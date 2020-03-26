{
    let view = {
        el: '.editResource>.upload',
        template: `
            <div id="dragArea">
                <button id="clickArea">
                    <p>点击或拖拽上传</p>
                    <p>文件不能超过50MB</p>
                </button>
            </div>
        `,
        render() {
            $(this.el).html(this.template)
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
            images: [
                // {name:'',url:''}
            ]
        },
        create(data) {
            this.data.images.push(data)
        },
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render()
            this.bindEvents()
            window.eventHub.on('addResource', () => {
                this.view.show()
            })
            window.eventHub.on('editResource', () => {
                this.view.hide()
            })
            window.eventHub.on('imageSaved', () => {
                this.view.hide()
            })
            window.eventHub.on('cancelEdit', () => {
                this.view.hide()
            })
        },
        bindEvents() {
            var uploader = Qiniu.uploader({
                runtimes: 'html5', //上传模式,依次退化
                browse_button: 'clickArea', //上传选择的点选按钮，**必需**
                uptoken_url: 'http://localhost:6677/uptoken', //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                domain: 'q7mvdohg1.bkt.clouddn.com', //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false, //设置上传文件的时候是否每次都重新获取新的token
                container: 'dragArea', //上传区域DOM ID，默认是browser_button的父元素，
                max_file_size: '50mb', //最大文件体积限制
                max_retries: 3, //上传失败最大重试次数
                dragdrop: true, //开启可拖曳上传
                drop_element: 'dragArea', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb', //分块上传时，每片的体积
                auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function (up, files) {
                        plupload.each(files, function (file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': function (up, file) {
                        // 每个文件上传前,处理相关的事情
                    },
                    'UploadProgress': function (up, file) {
                        // 每个文件上传时,处理相关的事情
                    },
                    'FileUploaded': function (up, file, info) {
                        var domain = up.getOption('domain')
                        var response = JSON.parse(info.response)
                        var url = `http://${domain}/${encodeURIComponent(response.key)}`
                        var name = response.key
                        window.eventHub.emit('uploaded', {
                            'name': name,
                            'url': url,
                        })
                    },
                    'Error': function (up, err, errTip) {
                        //上传出错时,处理相关的事情
                    },
                    'UploadComplete': function () {
                        //队列文件处理完毕后,处理相关的事情
                    },
                }
            })
        }
    }
    controller.init(view, model)
}