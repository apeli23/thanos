import React, { useRef, useEffect } from 'react';


export default function Home() {
  const contentRef = useRef(null);

  function handleChange() {
    const content = contentRef.current;
    console.log('content', content);

    const canvas = document.createElement("canvas")
    console.log('canvas', canvas)
    
    const ctx = canvas.getContext("2d");
    console.log('ctx', ctx);
    
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log('imageData', imageData);

    var pixelArr = imageData.data;
    console.log("pixelArr", pixelArr);
  }
 
  return (
    <div>
      <div ref={contentRef}>
        <img src='https://www.downloadclipart.net/large/marvel-thanos-png-free-download.png' height="300" alt='sample' />
      </div>
      <button onClick={handleChange} id="start-btn">Snap!</button>
    </div>
  )
}
