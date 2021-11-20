import React, { useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import Thanos from '../public/thanos.png';
import useStyles from '../utils/styles';


var Chance = require('chance');
var $ = require('jquery');

function Test() {
    const classes = useStyles();
    
    const contentRef = useRef(null);
    const cnvRef = useRef(null);
    const buttonRef = useRef();


    var imageDataArray = [];
    var canvasCount = 35;
    var chance = new Chance();
    
    function handleSnap () {

        let content = contentRef.current;
        html2canvas($(content)[0]).then(canvas => {
            let ctx = canvas.getContext("2d");
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            console.log('imageData', imageData);
            var pixelArr = imageData.data;

            createBlankImageData(imageData);
            console.log('blank imageData', imageData)

            //put pixel info to imageDataArray (Weighted Distributed)
            for (let i = 0; i < pixelArr.length; i+=4) {
                //find the highest probability canvas the pixel should be in
                let p = Math.floor((i/pixelArr.length) *canvasCount);
                let a = imageDataArray[weightedRandomDistrib(p)];
                a[i] = pixelArr[i];
                a[i+1] = pixelArr[i+1];
                a[i+2] = pixelArr[i+2];
                a[i+3] = pixelArr[i+3]; 
            }
            //create canvas for each imageData and append to target element
            for (let i = 0; i < canvasCount; i++) {
                let c = newCanvasFromImageData(imageDataArray[i], canvas.width, canvas.height);
                c.classList.add("dust");
                    content.append(c);
            }
            // console.log('content',content)
            $(".content").children().not(".dust").fadeOut(3500)
            //apply animation
            $(".dust").each( function(index){
                animateBlur($(this),0.8,800);
                // setTimeout(() => {
            //     animateTransform($(this),100,-100,chance.integer({ min: -15, max: 15 }),800+(110*index));
            //     }, 70*index); 
            //     //remove the canvas from DOM tree when faded
                // $(this).delay(70*index).fadeOut((110*index)+800,"easeInQuint",()=> {$( this ).remove();});
            });
             
        });
    }

    function animateBlur(elem,radius,duration) {
        var r =0;
        $({rad:0}).animate({rad:radius}, {
            duration: duration,
            function(){
                elem.css({
                    transition: 'transform 0.6s cubic-bezier(0.5, 1, 0.89, 1)',
                });
            },
            step: function(now) {
              elem.css({
                    filter: 'blur(' + now + 'px)'
                });
            }
        });
    }

    function newCanvasFromImageData(imageDataArray ,w , h) {
        var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            let tempCtx = canvas.getContext("2d");
            tempCtx.putImageData(new ImageData(imageDataArray, w , h), 0, 0);
                
        return canvas;
    }

    function weightedRandomDistrib(peak) {
        var prob = [], seq = [];
        
        for(let i=0;i<canvasCount;i++) {
            prob.push(Math.pow(canvasCount-Math.abs(peak-i),3));
            seq.push(i);
        }
        
        return chance.weighted(seq, prob);
    };

    function createBlankImageData(imageData) {
            
        for(let i=0;i<canvasCount;i++)
            
        {
            let arr = new Uint8ClampedArray(imageData.data);
            for (let j = 0; j < arr.length; j++) {
                arr[j] = 0;
            }
            imageDataArray.push(arr);
        }
    }


    
    return (
        <div>
            <div className="content" ref={contentRef}>
                <Image crossOrigin="Anonymous" src={Thanos} id="image" alt='sample' />
            </div>
            <Button ref={buttonRef} onClick={handleSnap} variant='contained' color='primary' id="start-btn">Snap!</Button><br />
            <canvas  ref={cnvRef}></canvas>
        </div>

    )
} export default Test