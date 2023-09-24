import React, { Component } from 'react';
import { Button } from 'antd';
import Webcam from 'react-webcam';
class HomePage extends Component {
    constructor(props :any) {
        super(props);
        this.webcamRef = React.createRef();
    }
    state={
        showCamera: false, // 默认不显示摄像头
        imgUrl:''
    }
    toggleCamera = () => {
        this.setState((prevState) => ({
            showCamera: !prevState.showCamera,
        }));
    };

    capturePhoto = () => {
        const imageSrc = this.webcamRef.current.getScreenshot();
        const startIndex = "data:image/webp;base64,".length;
        const base64String = imageSrc.substring(startIndex);
        const decodedString = window.atob(base64String);

        const byteCharacters = new Array(decodedString.length);
        for (let i = 0; i < decodedString.length; i++) {
            byteCharacters[i] = decodedString.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteCharacters);

        const blob = new Blob([byteArray], { type: 'image/webp' });

        const formData = new FormData();
        formData.append('file', blob, 'photo.webp'); // 将 blob 对象添加到 FormData 中

        fetch('http://www.wzsqyg.com/attachment/upload', {
            method: 'POST',
            body:formData
        }).then(response => response.json()) // 解析响应中的 JSON 数据
            .then(data => {
                console.log('Upload', data.msg);
                this.setState({imgUrl:data.msg},()=>{
                    console.log('图片',this.state.imgUrl)
                })
                // 使用响应中的图片地址显示或下载图像
                const imageUrl = data.imageUrl;
                const img = document.createElement('img');
                img.src = imageUrl;
            })
            .catch(error => {
                console.error('Upload error:', error);
            });
    };


    render() {
        const { showCamera } = this.state;

        return (
            <div>
                {showCamera && <Webcam ref={this.webcamRef} />}
                <button onClick={this.toggleCamera}>
                    {showCamera ? '关闭摄像头' : '打开摄像头'}
                </button>
                <img src={this.state.imgUrl}/>
                {showCamera && <button onClick={this.capturePhoto}>拍照</button>}
            </div>
        );
    }
}

export default HomePage;
