import React, { useRef, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import html2canvas from 'html2canvas';

var Chance = require('chance');

const Test2 = props => {
    const contentRef = useRef();
    const imgRef = useRef();
    const canvasRef = useRef();
    const buttonRef = useRef();

    var imageDataArray = [];
    var canvasCount = 35;
    var chance = new Chance();

    let image, c_out, ctx_out, c_tmp, ctx_tmp, button;

    useEffect(() => {
        image = imgRef.current
        // console.log('image', image);

        c_out = canvasRef.current
        var cw = c_out.width = 500;
        var ch = c_out.height = 300;
        // console.log('canvas', c_out);

        html2canvas(image).then(canvas => {
            c_out = canvas.getContext("2d");
            var imageData = c_out.getImageData(0, 0, canvas.width, canvas.height);
            console.log('imageData', imageData);
            var pixelArr = imageData.data;
            console.log('pixelArr', pixelArr);

            createBlankImageData(imageData);

            //put pixel info to imageDataArray (Weighted Distributed)
            for (let i = 0; i < pixelArr.length; i += 4) {
                //find the highest probability canvas the pixel should be in
                let p = Math.floor((i / pixelArr.length) * canvasCount);
                let a = imageDataArray[weightedRandomDistrib(p)];
                a[i] = pixelArr[i];
                a[i + 1] = pixelArr[i + 1];
                a[i + 2] = pixelArr[i + 2];
                a[i + 3] = pixelArr[i + 3];
            }
        })

        function createBlankImageData(imageData) {
            for (let i = 0; i < canvasCount; i++) {
                let arr = new Uint8ClampedArray(imageData.data);
                for (let j = 0; j < arr.length; j++) {
                    arr[j] = 0;
                }
                imageDataArray.push(arr);
            }
        }

    }, [])
    function handleSnap() {

    }
    return (
        <div>
            <div className="content" ref={contentRef}>
                <img ref={imgRef} src='https://www.downloadclipart.net/large/marvel-thanos-png-free-download.png' width='500' height="300" alt='sample' />
            </div>
            <Button ref={buttonRef} onClick={handleSnap} variant='contained' color='primary' id="start-btn">Snap!</Button><br />
            <canvas ref={canvasRef}></canvas>
        </div>

    )
}; export default Test2