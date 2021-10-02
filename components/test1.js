import React, { useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button'
import html2canvas from 'html2canvas';

var Chance = require('chance');

function Test() {
    const contentRef = useRef(null);
    const bodyRef = useRef(null);
    const canvasRef = useRef(null);
    const c_Ref = useRef(null)


    var imageDataArray = [];
    var canvasCount = 35;
    var chance = new Chance();


    function handleChange() {
        const content = contentRef.current;
        // console.log('content', content);


        const cnv = canvasRef.current
        var cw = cnv.width = 500;
        var ch = cnv.height = 300;
        console.log('cnv', cnv);

        html2canvas(content).then(canvas => {
            var ctx = canvas.getContext("2d");
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var pixelArr = imageData.data;

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
            //create canvas for each imageData and append to target element
            for (let i = 0; i < canvasCount; i++) {
                let c = newCanvasFromImageData(imageDataArray[i], canvas.width, canvas.height);
                c.classList.add("dust");
                $("body").append(c);
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
        function weightedRandomDistrib(peak) {
            var prob = [], seq = [];
            for (let i = 0; i < canvasCount; i++) {
                prob.push(Math.pow(canvasCount - Math.abs(peak - i), 3));
                seq.push(i);
            }
            return chance.weighted(seq, prob);
        }

    }
    function newCanvasFromImageData(imageDataArray, w, h) {
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var tempCtx = canvas.getContext("2d");
        tempCtx.putImageData(new ImageData(imageDataArray, w, h), 0, 0);

        return canvas;
    }

    return (
        <div ref={bodyRef}>
            <div className="content" ref={contentRef}>
                <img src='https://www.downloadclipart.net/large/marvel-thanos-png-free-download.png' width='500' height="300" alt='sample' />
            </div><br />
            <Button variant='contained' color='primary' onClick={handleChange} id="start-btn">Snap!</Button>
            <canvas ref={canvasRef}></canvas>

        </div>
    )
}; export default Test
