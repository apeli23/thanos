import React, { useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button'
import html2canvas from 'html2canvas';

var Chance = require('chance');
var $ = require('jquery');

function Test() {
    const contentRef = useRef(null);
    const bodyRef = useRef(null);
    const canvasRef = useRef(null);
    const c_Ref = useRef(null)
    const resultRef = useRef(null);
    const imageRef = useRef(null);

    var body = bodyRef.current


    var imageDataArray = [];
    var canvasCount = 35;
    var chance = new Chance();


    function handleChange() {
        const content = contentRef.current;
        // console.log('content', content);

        html2canvas(content).then(canvas => {
            canvas.width = '500';
            canvas.height = '300';
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
                var body = bodyRef.current
                content.append(c);
            }

            //clear all children except the canvas
            $(".content").children().not(".dust").fadeOut(3500);

            //apply animation
            $(".dust").each(function (index) {
                animateBlur($(this), 0.8, 800);
                setTimeout(() => {
                    animateTransform($(this), 100, -100, chance.integer({ min: -15, max: 15 }), 800 + (110 * index));
                }, 70 * index);


                // $(this).delay(70 * index).fadeOut((110 * index) + 800, "easeInQuint", () => { $(this).remove(); });
            })
        })
    }

    function animateTransform(elem, sx, sy, angle, duration) {
        var td = 0;
        var tx = 0;
        var ty = 0;

        $({ x: 0, y: 0, deg: 0 }).animate({ x: sx, y: sy, deg: angle }, {
            duration: duration,
            easing: "easeInQuad",
            step: function (now, fx) {
                if (fx.prop == "x")
                    tx = now;
                else if (fx.prop == "y")
                    ty = now;
                else if (fx.prop == "deg")
                    td = now;
                elem.css({
                    transform: 'rotate(' + td + 'deg)' + 'translate(' + tx + 'px,' + ty + 'px)'
                });
            }
        });
    }

    function animateBlur(elem, radius, duration) {
        var r = 0;
        $({ rad: 0 }).animate({ rad: radius }, {
            duration: duration,
            // easing: "easeOutQuad",
            step: function (now) {
                elem.css({
                    filter: 'blur(' + now + 'px)'
                });
            }
        });
    }

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
                <img ref={imageRef} src='https://www.downloadclipart.net/large/marvel-thanos-png-free-download.png' width='500' height="300" alt='sample' />
            </div><br />
            <Button variant='contained' color='primary' onClick={handleChange} id="start-btn">Snap!</Button>
            {/* <canvas ref={canvasRef}></canvas> */}
            <div ref={resultRef}></div>
        </div>
    )
}; export default Test
